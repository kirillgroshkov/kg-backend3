/*

DEBUG=kg:*,nc:* yarn tsn-script ./scripts/getLastReleases.ts

 */

import { runScript } from '@naturalcycles/nodejs-lib'
import { dayjs } from '@naturalcycles/time-lib'
import { releasesService } from '@src/releases/releases.service'

runScript(async () => {
  // const u = await releasesUserDao.requireById('xlmyalsayaftqgcz')
  // const etagMap = await releasesService.loadEtagMap()
  const r = await releasesService.getLastReleases()
  const m = r.map(r => [dayjs.unix(r.published).toPretty(), r.repoFullName, r.v])
  console.table(m)
})
