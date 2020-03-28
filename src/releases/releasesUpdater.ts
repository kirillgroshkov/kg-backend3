import { coloredHttpCode } from '@naturalcycles/backend-lib'
import { Saved } from '@naturalcycles/db-lib'
import { pMap, _flatten, _uniq } from '@naturalcycles/js-lib'
import { Debug, dimGrey } from '@naturalcycles/nodejs-lib'
import { Dayjs, dayjs, since } from '@naturalcycles/time-lib'
import { atomService } from '@src/releases/atom.service'
import { Release, releaseDao } from '@src/releases/model/release.model'
import { ReleasesRepo, releasesRepoDao } from '@src/releases/model/releasesRepo.model'
import { releasesUserDao } from '@src/releases/model/releasesUser.model'
import { mongoDB } from '@src/srv/db'
import { slackReleases, slackService } from '@src/srv/slack.service'
import got from 'got'

export interface ReleasesUpdaterOpts {
  forceUpdateAll?: boolean

  /**
   * If true - it will ignore existing releases and fetch all as new.
   */
  updateExisting?: boolean

  /**
   * @default 16
   */
  concurrency?: number

  /**
   * @default 100
   */
  maxReleasesPerRepo?: number

  throwOnError?: boolean

  onlyUserIds?: string[]
}

const log = Debug('app:releases')

export const releasesUpdaterSchedule = '0 * * * *' // every 1 hour

const updateAfterMinutes = 30

/**
 * If takes longer - job will be started anyway.
 * No way to "cancel" previous hanged job.
 */
const timeoutToRestartMinutes = 120

class ReleasesUpdater {
  lastStarted?: Dayjs
  lastFinished?: Dayjs

  async start(opts: ReleasesUpdaterOpts = {}): Promise<void> {
    if (this.lastStarted) {
      if (this.lastStarted.isBefore(dayjs().subtract(timeoutToRestartMinutes, 'minute'))) {
        void slackService.send(
          `releasesUpdater timeout! Will start new job anyway. LastStarted: ${this.lastStarted.toPretty()}`,
        )
      } else {
        void slackService.send(
          `releasesUpdater was already started since ${this.lastStarted.toPretty()}`,
        )
        return
      }
    }

    this.lastStarted = dayjs()

    void slackService.sendMsg({
      text: 'releasesUpdater.start',
      kv: {
        lastFinished: this.lastFinished ? this.lastFinished.toPretty() : 'never',
      },
    })

    const newReleases = await this.run(opts)
    const fromRepos = _uniq(newReleases.map(r => r.repoFullName))

    void slackService.send(
      `releasesUpdater ${newReleases.length} new releases from ${
        fromRepos.length
      } repos (${newReleases.map(r => r.id).join(', ')}) in ${since(this.lastStarted.valueOf())}`,
    )

    this.lastFinished = dayjs()
    this.lastStarted = undefined
  }

  /**
   * Returns new releases
   */
  async run(opts: ReleasesUpdaterOpts = {}): Promise<Release[]> {
    const { forceUpdateAll, concurrency = 16, throwOnError, onlyUserIds } = opts
    // 1. Get, merge, dedupe starred repos from all active users

    const q = releasesUserDao.query().filter('accessToken', '>', '')

    if (onlyUserIds) {
      q.filter('id', 'in', onlyUserIds)
    }

    const users = await releasesUserDao.runQuery(q)
    const repoIdsTotal = users.reduce((ids, u) => ids.concat(u.starredRepos), [] as string[])
    const repoIds = _uniq(repoIdsTotal)

    // 2. Select only those that was last updated longer than threshold (or non-existing for some reason)
    const updatedThreshold = dayjs().subtract(forceUpdateAll ? 0 : updateAfterMinutes, 'minute')
    const repos = await releasesRepoDao
      .query()
      .filter('releasesChecked', '<', updatedThreshold.unix())
      .runQuery()

    void slackService.send(
      `releasesUpdater: total repos / unique / to check ${[
        repoIdsTotal.length,
        repoIds.length,
        repos.length,
      ].join(' / ')}`,
    )

    if (!repos.length) return []

    const newReleases = _flatten(
      await pMap(
        repos,
        async repo => {
          return this.checkRepo(repo).catch(err => {
            if (throwOnError) throw err
            void slackReleases.error(`checkRepo ${repo.id}`)
            void slackReleases.error(err)
            return []
          })
        },
        { concurrency },
      ),
    )

    return newReleases
  }

  /**
   * Returns new releases array (can be empty if no updates).
   * Mutates and saves repo with .releasesChecked = now
   */
  async checkRepo(repo: Saved<ReleasesRepo>, opts: ReleasesUpdaterOpts = {}): Promise<Release[]> {
    let releases: Release[] = (await this.fetchReleases(repo.id, opts)).map(r => ({
      ...r,
      avatarUrl: repo.avatarUrl,
    }))

    if (releases.length) {
      releases = await releaseDao.saveBatch(releases)
    }

    repo.releasesChecked = dayjs().unix()
    await releasesRepoDao.save(repo)

    return releases
  }

  async fetchReleases(repoFullName: string, opts: ReleasesUpdaterOpts = {}): Promise<Release[]> {
    const { maxReleasesPerRepo = 100, updateExisting, throwOnError } = opts
    log(`fetchReleases ${repoFullName}...`, { maxReleasesPerRepo })

    const existingTagNames = updateExisting
      ? new Set<string>()
      : new Set<string>(
          await mongoDB.distinct<any>('Release', 'tagName', {
            repoFullName,
          }),
        )

    const releasesUrl = `https://github.com/${repoFullName}/releases.atom`
    let after = ''
    let fetchedReleases: Release[]
    const releases: Release[] = []
    // log({lastReleaseTag, lastReleaseTagParsed})
    // log(`${repo.id} ${existingTagNames.size} existing releases`, [...existingTagNames])

    do {
      const url = `${releasesUrl}?after=${encodeURIComponent(after)}`
      // log(`>> ${url}`)
      const started = Date.now()

      const { body, statusCode, statusMessage } = await got(url, {
        throwHttpErrors: false,
      }).catch(err => {
        void slackReleases.error(err)
        throw err
      })

      if (!body || !statusCode || statusCode >= 400) {
        const errMsg = `${url}: ${statusCode}: ${statusMessage}`
        if (throwOnError) throw new Error(errMsg)
        if ([451, 404].includes(statusCode)) {
          // Unavailable for legal reasons, e.g: "gloomyson/StarCraft"
          log(`<< GET ${coloredHttpCode(statusCode)} ${dimGrey(url)} skipping`)
        } else {
          void slackReleases.error(errMsg)
        }
        break
      }

      fetchedReleases = await atomService.parseAsReleases(body, repoFullName).catch(err => {
        if (throwOnError) throw err
        log.error(repoFullName, err)
        void slackReleases.error(`atomService.parseAsReleases ${url}`)
        void slackReleases.error(err)
        return [] // 0 releases
      })
      log(`<< ${url} in ${since(started)}: ${fetchedReleases.length} release(s)`)

      if (!fetchedReleases.length) break

      //
      // Rule: if at least ONE of fetched releases was existing - don't fetch more pages
      //

      let thisPageHasExistingReleases = false
      fetchedReleases.forEach(r => {
        if (existingTagNames.has(r.tagName)) {
          thisPageHasExistingReleases = true
        } else {
          releases.push(r)
        }
      })

      if (thisPageHasExistingReleases) {
        break
      }

      const [lastRelease] = [...fetchedReleases].reverse()
      after = lastRelease.tagName
    } while (fetchedReleases.length === 10 && releases.length < maxReleasesPerRepo)

    log(`fetchReleases ${repoFullName}: ${releases.length} new release(s)`)
    return releases
  }
}

export const releasesUpdater = new ReleasesUpdater()
