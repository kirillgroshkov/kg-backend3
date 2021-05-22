/*

APP_ENV=prod DEBUG=nc* yarn tsn se/se

 */

/* tslint:disable:ordered-imports no-unused-variable */
import '@src/bootstrap'
import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { seSlack } from '@src/se/seSlack'

runScript(async () => {
  // await seAccountDao.save({
  //   id: 'abcd',
  //   phoneNumber: '+46123123',
  // })

  await seSlack.send('преведко')
})
