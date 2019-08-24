/*

DEBUG=kg:*,nc:* yarn tsn-script ./scripts/updateUserReleases.ts

 */

require('dotenv').config()
import { releasesService } from '@src/releases/releases.service'
import { releasesUserDao } from '@src/releases/releasesUser.model'

void main()
  .then(async () => {
    process.exit(0)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

async function main () {
  // const u = await firestoreDB.getById('ReleasesUser', 'xlmyalsayaftqgcz')
  // await mongoDB.saveBatch<any>('ReleasesUser', [u])

  const u = await releasesUserDao.requireById('xlmyalsayaftqgcz')
  // // const etagMap = await releasesService.loadEtagMap()
  await releasesService.updateUserReleases(u, 100000, 100, 1)
}
