import { CommonDaoLogLevel } from '@naturalcycles/db-lib'
import { mongoDB } from '@src/srv/firestore.db'

export const defaultDaoCfg = {
  // db: firestoreCacheDB,
  db: mongoDB,
  throwOnDaoCreateObject: true,
  throwOnEntityValidationError: true,
  logStarted: true,
  logLevel: CommonDaoLogLevel.DATA_FULL,
}
