import { memo } from '@naturalcycles/js-lib'
import { projectDir } from '@src/cnst/paths.cnst'
import * as firebaseAdmin from 'firebase-admin'

class FirebaseService {
  init (): void {
    this.admin()
  }

  @memo()
  admin (): firebaseAdmin.app.App {
    const { FIREBASE_SERVICE_ACCOUNT_PATH } = process.env

    const credential = FIREBASE_SERVICE_ACCOUNT_PATH
      ? firebaseAdmin.credential.cert(require(`${projectDir}${FIREBASE_SERVICE_ACCOUNT_PATH}`))
      : firebaseAdmin.credential.applicationDefault()

    return firebaseAdmin.initializeApp({
      credential,
      databaseURL: 'https://kg-backend3.firebaseio.com',
    })
  }
}

export const firebaseService = new FirebaseService()
