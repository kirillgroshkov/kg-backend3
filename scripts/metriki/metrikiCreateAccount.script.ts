/*

yarn tsn metriki/metrikiCreateAccount.script

 */

/* tslint:disable:ordered-imports no-unused-variable */
import '@src/bootstrap'
import { requireEnvKeys } from '@naturalcycles/nodejs-lib'
import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { metrikiApiKeyDao } from '@src/metriki/metriki.model'

runScript(async () => {
  // const acc = await metrikiAccountDao.save({})
  // console.log(acc)
  //
  const { METRIKI_ACCOUNT_ID } = requireEnvKeys('METRIKI_ACCOUNT_ID')
  const key = await metrikiApiKeyDao.save({
    accountId: METRIKI_ACCOUNT_ID,
    permission: 'rw',
  })
  console.log(key)
})
