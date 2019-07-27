/*

DEBUG=kg:*,nc:* yarn tsn-script ./scripts/updateUserReleases.ts

 */

require('dotenv').config()
import { releasesService } from '@src/releases/releases.service'
import { releasesUserDao } from '@src/releases/releasesUser.model'

void main()

async function main () {
  const u = await releasesUserDao.requireById('xlmyalsayaftqgcz')
  // const etagMap = await releasesService.loadEtagMap()
  await releasesService.updateUserReleases(u, 10, 100, 1)
}
