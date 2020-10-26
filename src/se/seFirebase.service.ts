import { FirebaseSharedService } from '@naturalcycles/backend-lib'
import { secret, secretOptional } from '@naturalcycles/nodejs-lib'
import * as admin from 'firebase-admin'

class FirebaseService extends FirebaseSharedService {
  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    return await this.auth().verifyIdToken(idToken)
  }

  async getUser(uid?: string): Promise<admin.auth.UserRecord | null> {
    if (!uid) return null
    return await this.auth().getUser(uid)
  }

  async requireUser(uid: string): Promise<admin.auth.UserRecord> {
    const user = await this.auth().getUser(uid)
    if (!user) {
      throw new Error(`Firebase User not found: ${uid}`)
    }
    return user
  }
}

export const seFirebaseService = new FirebaseService({
  serviceAccount: secretOptional('SECRET_FIREBASE_SE_SERVICE_ACCOUNT'),
  authDomain: secret('SECRET_FIREBASE_SE_AUTH_DOMAIN'),
  apiKey: secret('SECRET_FIREBASE_SE_API_KEY'),
  // opt: {
  //   databaseURL: 'https://serviceexchangese.firebaseio.com',
  // }
  appName: 'ServiceExchange',
})
