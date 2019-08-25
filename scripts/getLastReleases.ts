/*

DEBUG=app*,kg:*,nc:* yarn tsn-script ./scripts/getLastReleases.ts

 */

/* tslint:disable:ordered-imports */
import '@src/bootstrap'
import { runScript } from '@naturalcycles/nodejs-lib'
import { dayjs } from '@naturalcycles/time-lib'
import { releasesService } from '@src/releases/releases.service'

runScript(async () => {
  const r = await releasesService.getLastReleases()
  const m = r.map(r => [dayjs.unix(r.published).toPretty(), r.repoFullName, r.v])
  console.table(m)
})
