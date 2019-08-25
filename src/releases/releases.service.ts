import { Unsaved } from '@naturalcycles/db-lib'
import { pMap } from '@naturalcycles/js-lib'
import { since } from '@naturalcycles/time-lib'
import { atomService } from '@src/releases/atom.service'
import { Release, releaseDao } from '@src/releases/release.model'
import { releasesRepoDao } from '@src/releases/releasesRepo.model'
import { ReleasesUser } from '@src/releases/releasesUser.model'
import { parseSemver } from '@src/releases/semver.util'
import { log } from '@src/srv/log.service'
import * as got from 'got'
import * as semver from 'semver'

class ReleasesService {
  async updateUserReleases (
    u: ReleasesUser,
    limitRepos = 99999,
    limitReleasedPerRepo = 100,
    concurrency = 1,
  ): Promise<void> {
    const repoNames = u.starredRepos
    // console.log({repoNames})

    await pMap(
      repoNames.slice(0, limitRepos),
      async repoName => {
        await this.updateRepoReleases(repoName)
      },
      { concurrency },
    )
  }

  async updateRepoReleases (repoFullName: string, limitReleasedPerRepo = 100): Promise<void> {
    log(`updateRepoReleases ${repoFullName}`)

    const repo = await releasesRepoDao.getById(releasesRepoDao.naturalId(repoFullName))
    const lastReleaseTag = repo && repo.lastReleaseTag

    const releases = await this.fetchReleases(
      repoFullName,
      lastReleaseTag,
      limitReleasedPerRepo,
    ).catch(err => {
      console.error(err)
      // todo: collect errors
      return []
    })
    // console.log(releases)

    if (releases.length) {
      await releaseDao.saveBatch(releases)

      const [lastRelease] = releases
      if (repo && repo.lastReleaseTag !== lastRelease.tagName) {
        await releasesRepoDao.save({
          ...repo,
          lastReleaseTag: lastRelease.tagName,
        })
      }
    }
  }

  async fetchReleases (
    repoFullName: string,
    lastReleaseTag?: string,
    limit = 100,
  ): Promise<Unsaved<Release>[]> {
    log(`fetchReleases ${repoFullName}...`, { limit })
    const lastReleaseTagParsed = parseSemver(lastReleaseTag)
    const releasesUrl = `https://github.com/${repoFullName}/releases.atom`
    let after = ''
    let fetchedReleases: Unsaved<Release>[]
    const releases: Unsaved<Release>[] = []

    do {
      const url = `${releasesUrl}?after=${after}`
      // log(`>> ${url}`)
      const started = Date.now()
      const { body } = await got(url)
      fetchedReleases = await atomService.parseAsReleases(body, repoFullName).catch(err => {
        log.error(`!!!!!!!!! ${repoFullName}`, err)
        return []
      })
      log(`<< ${url} in ${since(started)}: ${fetchedReleases.length} releases`)
      if (fetchedReleases.length) {
        const [lastRelease] = [...fetchedReleases].reverse()

        if (lastReleaseTagParsed) {
          const lastTagnameParsed = parseSemver(lastRelease.tagName)
          if (lastTagnameParsed && semver.cmp(lastTagnameParsed, '<', lastReleaseTagParsed, true)) {
            // This is last page, filtering is needed
            releases.push(
              ...fetchedReleases.filter(r => {
                const tagNameParsed = parseSemver(r.tagName)
                if (!tagNameParsed) return true
                semver.cmp(tagNameParsed, '>', lastReleaseTagParsed, true)
              }),
            )
            log(`fetchReleases ${repoFullName}: ${releases.length} new releases`)
            return releases
          }
        }

        releases.push(...fetchedReleases)
        after = lastRelease.tagName
      }
    } while (fetchedReleases.length === 10 && releases.length < limit)

    log(`fetchReleases ${repoFullName}: ${releases.length} releases`)
    return releases
  }

  async getLastReleases (): Promise<Release[]> {
    const q = releaseDao
      .createQuery()
      .order('published', true)
      .limit(200)
    return releaseDao.runQuery(q, { onlyCache: true })
  }
}

export const releasesService = new ReleasesService()
