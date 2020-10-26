import { FirestoreDB } from '@naturalcycles/firestore-lib'
import { seFirebaseService } from '@src/se/seFirebase.service'

const firestore = seFirebaseService.admin().firestore()

export const seFirestoreDB = new FirestoreDB({
  firestore,
})
