/*

APP_ENV=dev DEBUG=app*,kg:*,nc:* yarn tsn updateAllUserStars

 */

/* tslint:disable:ordered-imports */
import '@src/bootstrap'
import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { userStarsUpdater } from '@src/releases/userStarsUpdater'

runScript(async () => {
  await userStarsUpdater.start()
})
