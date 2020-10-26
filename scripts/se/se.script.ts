/*

APP_ENV=prod DEBUG=nc* yarn tsn se/se

 */

/* tslint:disable:ordered-imports no-unused-variable */
import '@src/bootstrap'
import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { seAccountDao } from '@src/se/seAccount.model'
import { seSlack } from '@src/se/seSlack'

runScript(async () => {
  // await seAccountDao.save({
  //   id: 'abcd',
  //   phoneNumber: '+46123123',
  // })

  await seSlack.send('преведко')
})
