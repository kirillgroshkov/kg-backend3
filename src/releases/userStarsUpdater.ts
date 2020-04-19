import { pMap, _since } from '@naturalcycles/js-lib'
import { Debug } from '@naturalcycles/nodejs-lib'
import { dimGrey, yellow } from '@naturalcycles/nodejs-lib/dist/colors'
import { Dayjs, dayjs } from '@naturalcycles/time-lib'
import { githubService } from '@src/releases/github.service'
import { releasesRepoDao } from '@src/releases/model/releasesRepo.model'
import { ReleasesUser, releasesUserDao } from '@src/releases/model/releasesUser.model'
import { slackService } from '@src/srv/slack.service'

const log = Debug('app:stars')

export const userStarsUpdaterSchedule = '30 */4 * * *' // every 4 hours

const updateAfterMinutes = 30

/**
 * If takes longer - job will be started anyway.
 * No way to "cancel" previous hanged job.
 */
const timeoutToRestartMinutes = 60

class UserStarsUpdater {
  lastStarted?: Dayjs
  lastFinished?: Dayjs

  async start(forceUpdateAll = false): Promise<void> {
    if (this.lastStarted) {
      if (this.lastStarted.isBefore(dayjs().subtract(timeoutToRestartMinutes, 'minute'))) {
        void slackService.send(
          `userStarsUpdater timeout! Will start new job anyway. LastStarted: ${this.lastStarted.toPretty()}`,
        )
      } else {
        void slackService.send(
          `userStarsUpdater was already started since ${this.lastStarted.toPretty()}`,
        )
        return
      }
    }

    this.lastStarted = dayjs()

    void slackService.sendMsg({
      text: 'userStarsUpdater.start',
      kv: {
        lastFinished: this.lastFinished ? this.lastFinished.toPretty() : 'never',
      },
    })

    const updatedUserIds = await this.run(forceUpdateAll)

    void slackService.send(
      `userStarsUpdater ${updatedUserIds.length} users have stars updated (${updatedUserIds.join(
        ', ',
      )}) in ${_since(this.lastStarted.valueOf())}`,
    )

    this.lastFinished = dayjs()
    this.lastStarted = undefined
  }

  /**
   * Returns array of updated user ids.
   */
  async run(forceUpdateAll = false): Promise<string[]> {
    // 1. Fetch users that need to be updated
    const updatedThreshold = dayjs().subtract(forceUpdateAll ? 0 : updateAfterMinutes, 'minute')
    const users = await releasesUserDao
      .query()
      .filter('accessToken', '>', '')
      .filter('updated', '<', updatedThreshold.unix())
      .runQuery()

    log(
      `${yellow(users.length)} user(s) with accessToken and .updated < ${dimGrey(
        updatedThreshold.toPretty(),
      )} (${dimGrey(users.map(u => [u.id, u.displayName].join('_')).join(', '))})`,
    )

    void slackService.send(
      `${
        users.length
      } user(s) with accessToken and .updated < ${updatedThreshold.toPretty()} (${users
        .map(u => [u.id, u.displayName].join('_'))
        .join(', ')})`,
    )

    if (!users.length) return []

    const existingRepoIds = new Set(await releasesRepoDao.getAllIds())

    const updatedUserIds = (
      await pMap(
        users,
        async user => {
          const updated = await this.updateUser(user, existingRepoIds)
          return updated ? user.id : undefined
        },
        { concurrency: 1 },
      )
    ).filter(Boolean) as string[]

    return updatedUserIds
  }

  /**
   * Returns true if user has new stars.
   *
   * Mutates existingRepoIds set
   */
  async updateUser(u: ReleasesUser, existingRepoIds: Set<string>): Promise<boolean> {
    const initialStarredRepos = u.starredRepos

    const repos = await githubService.getUserStarredRepos(u)

    if (!repos) {
      log(`${u.id} unchanged (${initialStarredRepos.length} stars)`)
      void slackService.send(`${u.id} unchanged (${initialStarredRepos.length} stars)`)
    } else {
      log(`${u.id} stars ${initialStarredRepos.length} > ${repos.length}`)
      u.starredRepos = repos.map(r => r.id!)

      // Save only new (non-existing) repos

      const newRepos = repos.filter(r => !existingRepoIds.has(r.id!))
      await releasesRepoDao.saveBatch(newRepos)
      newRepos.forEach(r => existingRepoIds.add(r.id!))

      void slackService.send(
        `${u.id} stars ${initialStarredRepos.length} > ${repos.length}, newRepos: ${newRepos.length}`,
      )
      // log(newRepos.map(r => r.id))
    }

    await releasesUserDao.save(u) // updates .updated field

    return !!repos
  }
}

export const userStarsUpdater = new UserStarsUpdater()
