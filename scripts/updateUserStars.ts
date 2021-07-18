/*

APP_ENV=dev DEBUG=app*,kg:*,nc:* yarn tsn updateUserStars.ts

 */

/* tslint:disable:ordered-imports */
import '@src/bootstrap'
import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { releasesRepoDao } from '@src/releases/model/releasesRepo.model'
import { releasesUserDao } from '@src/releases/model/releasesUser.model'
import { userStarsUpdater } from '@src/releases/userStarsUpdater'

runScript(async () => {
  const u = await releasesUserDao.requireById('7FfDSISActZLSGX7FSWo4wldSFd2')
  const existingRepoIds = new Set(await releasesRepoDao.getAllIds())
  await userStarsUpdater.updateUser(u, existingRepoIds)
})
