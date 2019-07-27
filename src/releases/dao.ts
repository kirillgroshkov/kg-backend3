import { CommonDaoLogLevel } from '@naturalcycles/db-lib'
import { firestoreCacheDB } from '@src/srv/firestore.db'

export const defaultDaoCfg = {
  db: firestoreCacheDB,
  throwOnDaoCreateObject: true,
  throwOnEntityValidationError: true,
  logStarted: true,
  logLevel: CommonDaoLogLevel.DATA_FULL,
}
