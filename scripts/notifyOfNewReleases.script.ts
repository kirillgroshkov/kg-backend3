/*

APP_ENV=dev DEBUG=app*,kg:*,nc:* yarn tsn ./scripts/notifyOfNewReleases.script.ts

 */

/* tslint:disable:ordered-imports */
import '@src/bootstrap'
import { runScript } from '@naturalcycles/nodejs-lib'
import { notifyOfNewReleasesDaily } from '@src/releases/handlers/notifyOfNewReleases'

runScript(async () => {
  await notifyOfNewReleasesDaily()
})
