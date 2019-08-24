/*

DEBUG=kg:*,nc:* yarn tsn-script ./scripts/updateUserStars.ts

 */

import { runScript } from '@naturalcycles/nodejs-lib'
import { releasesService } from '@src/releases/releases.service'
import { releasesUserDao } from '@src/releases/releasesUser.model'

runScript(async () => {
  const u = await releasesUserDao.requireById('xlmyalsayaftqgcz')
  const etagMap = await releasesService.loadEtagMap()
  const _repos = await releasesService.updateUserStars(u, etagMap)
})
