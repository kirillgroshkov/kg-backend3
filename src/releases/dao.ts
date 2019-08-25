import { CommonDaoLogLevel } from '@naturalcycles/db-lib'
import { mongoDB } from '@src/srv/db'

export const defaultDaoCfg = {
  // db: firestoreCacheDB,
  db: mongoDB,
  throwOnDaoCreateObject: true,
  throwOnEntityValidationError: true,
  logStarted: true,
  logLevel: CommonDaoLogLevel.OPERATIONS,
}
