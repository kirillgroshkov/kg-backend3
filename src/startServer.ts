/* tslint:disable:ordered-imports */

//
// 1. Log 'startServer' and record `bootstrapStarted`
//
console.log('startServer... ')
const bootstrapStartedAt = Date.now()

//
// 2. Imports
// These imports should be always on top
//
import 'tsconfig-paths/register'
import '@src/bootstrap'

//
// 3. Further imports and bootstrap
//
import { startServer } from '@naturalcycles/backend-lib'
import { expressApp } from '@src/express.app'

startServer({
  bootstrapStartedAt,
  expressApp,
})
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
