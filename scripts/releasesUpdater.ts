/*

APP_ENV=dev DEBUG=app*,kg:*,nc:* yarn tsn releasesUpdater.ts

 */

/* tslint:disable:ordered-imports */
import '@src/bootstrap'
import { pDelay } from '@naturalcycles/js-lib'
import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { releasesUpdater } from '@src/releases/releasesUpdater'

runScript(async () => {
  await releasesUpdater.start({
    // forceUpdateAll: true,
    concurrency: 32,
  })
  await pDelay(1000) // for slack to send msg
})
