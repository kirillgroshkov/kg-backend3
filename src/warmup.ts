import { memoFn } from '@naturalcycles/js-lib'
import { mongoDB } from '@src/srv/db'
import { log } from '@src/srv/log.service'

export const warmup = memoFn(async () => {
  await mongoDB.client()
  log('warmup done')
})
