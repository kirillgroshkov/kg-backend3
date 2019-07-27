/*

DEBUG=kg:*,nc:* yarn tsn-script ./scripts/getLastReleases.ts

 */

require('dotenv').config()
import { dayjs } from '@naturalcycles/time-lib'
import { releasesService } from '@src/releases/releases.service'

void main()

async function main () {
  // const u = await releasesUserDao.requireById('xlmyalsayaftqgcz')
  // const etagMap = await releasesService.loadEtagMap()
  const r = await releasesService.getLastReleases()
  const m = r.map(r => [dayjs.unix(r.published).toPretty(), r.repoFullName, r.v])
  console.table(m)
}
