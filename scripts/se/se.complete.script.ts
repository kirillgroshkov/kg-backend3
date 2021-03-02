/*

APP_ENV=prod DEBUG=nc* yarn tsn se/se.complete

 */
/* tslint:disable:ordered-imports no-unused-variable */
import '@src/bootstrap'
import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { dayjs } from '@naturalcycles/time-lib'
import { isAccountCompleted, seAccountDao } from '@src/se/seAccount.model'

runScript(async () => {
  let completed = 0
  const now = dayjs().unix()

  await seAccountDao.query().streamQueryForEach(
    async acc => {
      const shouldBeCompleted = isAccountCompleted(acc)

      if (shouldBeCompleted && !acc.completed) {
        acc.completed = now
        completed++
        // todo: save
      } else if (!shouldBeCompleted && acc.completed) {
        delete acc.completed
        // todo: save
      }
    },
    {
      concurrency: 1,
      extra: () => ({ completed }),
    },
  )
})
