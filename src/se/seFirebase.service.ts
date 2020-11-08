import { FirebaseSharedService } from '@naturalcycles/backend-lib'
import { secret, secretOptional } from '@naturalcycles/nodejs-lib'
import { StorageBucket } from '@src/srv/storage/storageBucket'

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

export const seBucket = seFirebaseService.admin().storage().bucket()

export const seStorageBucket = new StorageBucket({
  bucket: seBucket,
})
