import { SimpleFileDB } from '@naturalcycles/db-lib'
import { FirestoreDB } from '@naturalcycles/firestore-lib/dist/firestore.db'
import { MongoDB } from '@naturalcycles/mongo-lib'
import { requireEnvKeys } from '@naturalcycles/nodejs-lib'
import { tmpDir } from '@src/cnst/paths.cnst'
import { firebaseService } from '@src/srv/firebase.service'

const firestore = firebaseService.admin().firestore()

export const firestoreDB = new FirestoreDB({
  firestore,
})

const _fileDB = new SimpleFileDB({
  storageDir: `${tmpDir}/storage`,
})

// export const redisDB = new RedisDB({
//   runQueries: true,
// })

const { MONGO_URI } = requireEnvKeys('MONGO_URI')

export const mongoDB = new MongoDB({
  uri: MONGO_URI,
  db: 'db1',
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
