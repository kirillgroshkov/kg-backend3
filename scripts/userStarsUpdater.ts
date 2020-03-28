/*

APP_ENV=dev DEBUG=app*,kg:*,nc:* yarn tsn userStarsUpdater.ts

 */

/* tslint:disable:ordered-imports */
import '@src/bootstrap'
import { pDelay } from '@naturalcycles/js-lib'
import { runScript } from '@naturalcycles/nodejs-lib'
import { userStarsUpdater } from '@src/releases/userStarsUpdater'

runScript(async () => {
  await userStarsUpdater.start() // no force
  // await userStarsUpdater.start(true)
  await pDelay(1000) // for slack to send msg
})
