import { createdUpdatedFields, Saved } from '@naturalcycles/db-lib'
import { dayjs } from '@naturalcycles/time-lib'
import { DEF_FROM } from '@src/cnst/email.cnst'
import { jobDao } from '@src/releases/model/job.model'
import { AuthInput, BackendResponse } from '@src/releases/model/releases.model'
import { releasesRepoDao } from '@src/releases/model/releasesRepo.model'
import { ReleasesUser, releasesUserDao } from '@src/releases/model/releasesUser.model'
import { releasesUpdater } from '@src/releases/releasesUpdater'
import { userStarsUpdater } from '@src/releases/userStarsUpdater'
import { firebaseService } from '@src/srv/firebase.service'
import { sendgridService } from '@src/srv/sendgrid.service'
import { slackReleases } from '@src/srv/slack.service'

export async function authUser(input: AuthInput): Promise<BackendResponse> {
  const { username, idToken, accessToken } = input
  // it will throw an error if token is invalid
  const { uid } = await firebaseService.verifyIdToken(idToken)
  const { email, displayName = 'User' } = await firebaseService.requireUser(uid)
  const existingUser = await releasesUserDao.getById(uid)
  const newUser = !existingUser

  const user = await releasesUserDao.save({
    settings: {
      notificationEmail: email,
    }, // default
    id: uid,
    starredRepos: [],
    ...createdUpdatedFields(),
    ...existingUser, // to preserve "starredRepos"
    username,
    accessToken,
    displayName,
  })

  if (newUser) {
    void emailNewUser(user)
    void initNewUser(user)
  }

  return {
    newUser,
    userFM: releasesUserDao.bmToTM(user),
  }
}

async function emailNewUser(user: ReleasesUser): Promise<void> {
  await Promise.all([
    slackReleases.send(`New user! ${user.username} ${user.id}`),

    sendgridService.send({
      from: DEF_FROM,
      to: { email: '1@inventix.ru' },
      subject: `Releases user: ${user.username} ${user.id}`,
      content: `Tadaam!`,
    }),
  ])
}

async function initNewUser(user: Saved<ReleasesUser>): Promise<void> {
  const now = dayjs()
  const { id } = user

  const job = await jobDao.save({
    id: `initNewUser_${id}`,
    type: 'initNewUser',
    started: now.unix(),
    status: 'active',
  })

  // 1. Fetch stars

  const existingRepoIds = new Set(await releasesRepoDao.getAllIds())

  await userStarsUpdater.updateUser(user, existingRepoIds)

  await releasesUpdater.run({
    onlyUserIds: [id],
  })

  const finished = dayjs().unix()

  await jobDao.save({
    ...job,
    finished,
    status: 'done',
    // result
  })
}
