/*

APP_ENV=dev DEBUG=app*,kg:*,nc:* yarn tsn-script ./scripts/updateUserStars.ts

 */

/* tslint:disable:ordered-imports */
import '@src/bootstrap'
import { runScript } from '@naturalcycles/nodejs-lib'
import { releasesUserDao } from '@src/releases/releasesUser.model'
import { userStarsUpdater } from '@src/releases/userStarsUpdater'

runScript(async () => {
  const u = await releasesUserDao.requireById('xlmyalsayaftqgcz')
  await userStarsUpdater.updateUser(u)
})
