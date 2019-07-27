import { CacheDB, SimpleFileDB } from '@naturalcycles/db-lib'
import { FirestoreDB } from '@naturalcycles/firestore-lib/dist/firestore.db'
import { tmpDir } from '@src/cnst/paths.cnst'
import { firebaseService } from '@src/srv/firebase.service'

const firestore = firebaseService.admin().firestore()

const firestoreDB = new FirestoreDB({
  firestore,
})

const fileDB = new SimpleFileDB({
  storageDir: `${tmpDir}/storage`,
})

// const inMemoryDB = new InMemoryDB()

export const firestoreCacheDB = new CacheDB({
  name: 'cache',
  // cacheDB: new InMemoryDB(),
  cacheDB: fileDB,
  downstreamDB: firestoreDB,
  logCached: true,
  logDownstream: true,
  awaitCache: true,
})
