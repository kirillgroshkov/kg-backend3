import { FirebaseSharedService } from '@naturalcycles/backend-lib'
import { secret, secretOptional } from '@naturalcycles/nodejs-lib'
import * as admin from 'firebase-admin'

class FirebaseService extends FirebaseSharedService {
  async verifyIdToken (idToken: string): Promise<admin.auth.DecodedIdToken> {
    return this.auth().verifyIdToken(idToken)
  }

  async getUser (uid?: string): Promise<admin.auth.UserRecord | undefined> {
    if (!uid) return
    return this.auth().getUser(uid)
  }

  async requireUser (uid: string): Promise<admin.auth.UserRecord> {
    const user = this.auth().getUser(uid)
    if (!user) {
      throw new Error(`Firebase User not found: ${uid}`)
    }
    return user
  }
}

export const firebaseService = new FirebaseService({
  serviceAccount: secretOptional('SECRET_FIREBASE_SERVICE_ACCOUNT'),
  authDomain: secret('SECRET_FIREBASE_AUTH_DOMAIN'),
  apiKey: secret('SECRET_FIREBASE_API_KEY'),
})
