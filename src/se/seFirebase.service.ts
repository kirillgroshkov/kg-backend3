import { FirebaseSharedService } from '@naturalcycles/backend-lib'
import { secret, secretOptional } from '@naturalcycles/nodejs-lib'

class FirebaseService extends FirebaseSharedService {}

export const seFirebaseService = new FirebaseService({
  serviceAccount: secretOptional('SECRET_FIREBASE_SE_SERVICE_ACCOUNT'),
  authDomain: secret('SECRET_FIREBASE_SE_AUTH_DOMAIN'),
  apiKey: secret('SECRET_FIREBASE_SE_API_KEY'),
  opt: {
    // databaseURL: 'https://serviceexchangese.firebaseio.com',
    storageBucket: 'serviceexchangese.appspot.com',
  },
  appName: 'ServiceExchange',
})
