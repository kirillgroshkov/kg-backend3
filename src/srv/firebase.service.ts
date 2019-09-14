import { FirebaseSharedService } from '@naturalcycles/backend-lib'
import { secret, secretOptional } from '@naturalcycles/nodejs-lib'

export const firebaseService = new FirebaseSharedService({
  serviceAccount: secretOptional('SECRET_FIREBASE_SERVICE_ACCOUNT'),
  authDomain: secret('SECRET_FIREBASE_AUTH_DOMAIN'),
  apiKey: secret('SECRET_FIREBASE_API_KEY'),
})
