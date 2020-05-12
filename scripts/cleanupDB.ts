/*

APP_ENV=dev DEBUG=app*,kg:*,nc:* yarn tsn cleanupDB

 */

/* tslint:disable:ordered-imports */
import '@src/bootstrap'
import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { dayjs } from '@naturalcycles/time-lib'
import { releaseDao } from '@src/releases/model/release.model'

runScript(async () => {
  const threshold = dayjs('2020-01-01')

  const r = await releaseDao.query().filter('published', '<', threshold.unix()).deleteByQuery()
  // .runQueryCount()
  // .order('published', false)
  // .limit(200)
  // .runQuery()
  // const m = r.map(r => [dayjs.unix(r.published).toPretty(), r.repoFullName, r.v])
  // console.table(m)
  console.log(r)
})
