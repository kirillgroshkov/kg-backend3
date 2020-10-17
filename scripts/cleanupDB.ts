/*

APP_ENV=dev DEBUG=app*,kg:*,nc:* yarn tsn cleanupDB

 */

/* tslint:disable:ordered-imports no-unused-variable */
import '@src/bootstrap'
import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { dayjs } from '@naturalcycles/time-lib'
import { releaseDao } from '@src/releases/model/release.model'
import { releasesRepoDao } from '@src/releases/model/releasesRepo.model'

runScript(async () => {
  const threshold = dayjs('2020-10-05')

  await releasesRepoDao.query().deleteByQuery() // delete ALL repos!
  await releaseDao.query().deleteByQuery() // delete ALL releases!
  // const r = await releaseDao.query().filter('published', '<', threshold.unix()).deleteByQuery()
  // .runQueryCount()
  // .order('published', false)
  // .limit(200)
  // .runQuery()
  // const m = r.map(r => [dayjs.unix(r.published).toPretty(), r.repoFullName, r.v])
  // console.table(m)
  // console.log(r)
})
