import { CacheDB, CommonDaoLogLevel, InMemoryDB } from '@naturalcycles/db-lib'
import { MongoDB } from '@naturalcycles/mongo-lib'
import { secret } from '@naturalcycles/nodejs-lib'

// const firestore = firebaseService.admin().firestore()
//
// export const db = new FirestoreDB({
//   firestore,
// })

// const _fileDB = new SimpleFileDB({
//   storageDir: `${tmpDir}/storage`,
// })

// export const redisDB = new RedisDB({
//   runQueries: true,
// })

export const mongoDB = new MongoDB({
  uri: secret('SECRET_MONGO_URI'),
  db: 'db1',
})

export const mongoMemoryCachedDB = new CacheDB({
  name: 'cache',
  cacheDB: new InMemoryDB(),
  downstreamDB: mongoDB,
  logCached: true,
  logDownstream: true,
  awaitCache: true,
})

// const inMemoryDB = new InMemoryDB()

// export const firestoreCacheDB = new CacheDB({
//   name: 'cache',
//   // cacheDB: new InMemoryDB(),
//   // cacheDB: fileDB,
//   cacheDB: redisDB,
//   downstreamDB: firestoreDB,
//   logCached: true,
//   logDownstream: true,
//   awaitCache: true,
// })

export const defaultDaoCfg = {
  // db: firestoreCacheDB,
  db: mongoDB,
  throwOnDaoCreateObject: true,
  throwOnEntityValidationError: true,
  logStarted: true,
  logLevel: CommonDaoLogLevel.OPERATIONS,
}
