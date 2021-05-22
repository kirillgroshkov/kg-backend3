/*

yarn tsn metriki/metrikiPut.script

 */

/* tslint:disable:ordered-imports no-unused-variable */
/* eslint-disable */
import '@src/bootstrap'
import { getGot, requireEnvKeys } from '@naturalcycles/nodejs-lib'
import { runScript } from '@naturalcycles/nodejs-lib/dist/script'

runScript(async () => {
  const { METRIKI_KEY, METRIKI_ACCOUNT_ID } = requireEnvKeys('METRIKI_KEY', 'METRIKI_ACCOUNT_ID')

  const metricCode = 'abc-d2'
  const metricValue = 12
  const ts = 1586607842

  const got = getGot().extend({
    prefixUrl: 'http://localhost:8080/metriki',
    headers: {
      authorization: METRIKI_KEY,
    },
  })
  // await got.put(`${METRIKI_ACCOUNT_ID}/metrics/${metricCode}/${metricValue}`)
  // const r = await got(`${METRIKI_ACCOUNT_ID}/metrics`).json<any>()
  // const r = await got(`${METRIKI_ACCOUNT_ID}/metrics/${metricCode}`).json<any>()
  // const r = await got.delete(`${METRIKI_ACCOUNT_ID}/metrics/${metricCode}/${ts}`).json<any>()
  const r = await got.delete(`${METRIKI_ACCOUNT_ID}/metrics/${metricCode}`).json<any>()
  console.log(r)
})
