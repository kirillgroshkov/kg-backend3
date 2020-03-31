/*

DEBUG=app*,kg:*,nc:* yarn tsn updateUserReleases.ts

 */

/* tslint:disable:ordered-imports */
import '@src/bootstrap'
import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { releasesUserDao } from '@src/releases/model/releasesUser.model'

runScript(async () => {
  // const u = await firestoreDB.getById('ReleasesUser', 'xlmyalsayaftqgcz')
  // await mongoDB.saveBatch<any>('ReleasesUser', [u])

  const _u = await releasesUserDao.requireById('xlmyalsayaftqgcz')
  // // const etagMap = await releasesService.loadEtagMap()
  // await releasesService.updateUserReleases(u, 100000, 100, 64)
})
