/*

APP_ENV=dev DEBUG=app*,kg:*,nc:* yarn tsn notifyOfNewReleases.script.ts

 */

/* tslint:disable:ordered-imports */
import '@src/bootstrap'
import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { notifyOfNewReleasesDaily } from '@src/releases/handlers/notifyOfNewReleases'

runScript(async () => {
  await notifyOfNewReleasesDaily()
})
