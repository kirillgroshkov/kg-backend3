/*

APP_ENV=dev DEBUG=app*,kg:*,nc:* yarn tsn ./scripts/updateUserStars.ts

 */

/* tslint:disable:ordered-imports */
import '@src/bootstrap'
import { runScript } from '@naturalcycles/nodejs-lib'
import { releasesRepoDao } from '@src/releases/model/releasesRepo.model'
import { releasesUserDao } from '@src/releases/model/releasesUser.model'
import { userStarsUpdater } from '@src/releases/userStarsUpdater'

runScript(async () => {
  const u = await releasesUserDao.requireById('xlmyalsayaftqgcz')
  const existingRepoIds = new Set(await releasesRepoDao.getAllIds())
  await userStarsUpdater.updateUser(u, existingRepoIds)
})
