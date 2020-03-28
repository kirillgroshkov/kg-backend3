/* tslint:disable:ordered-imports */

//
// 1. Log 'startServer' and record `bootstrapStarted`
//
console.log('startServer... ')
const bootstrapStartedAt = Date.now()

// These imports should be BEFORE any other imports
if (process.env.GAE_INSTANCE) {
  // Agents are only enabled in GAE environment
  require('@google-cloud/trace-agent').start()
  // require('@google-cloud/debug-agent').start()
  // void require('@google-cloud/profiler').start()
}

//
// 2. Imports
// These imports should be always on top
//
import 'tsconfig-paths/register'
import './bootstrap'

//
// 3. Further imports and bootstrap
//
import { isGAE, startServer } from '@naturalcycles/backend-lib'
import { filterUndefinedValues, pHang } from '@naturalcycles/js-lib'
import { runScript } from '@naturalcycles/nodejs-lib'
import { ms } from '@naturalcycles/time-lib'
import { expressApp } from '@src/express.app'
import { notifyOfNewReleasesDaily } from '@src/releases/handlers/notifyOfNewReleases'
import { releasesUpdater, releasesUpdaterSchedule } from '@src/releases/releasesUpdater'
import { userStarsUpdater, userStarsUpdaterSchedule } from '@src/releases/userStarsUpdater'
import { slackService } from '@src/srv/slack.service'
import { warmup } from '@src/warmup'
import * as nodeSchedule from 'node-schedule'

runScript(async () => {
  const { APP_ENV } = process.env
  const kv = filterUndefinedValues({
    // APP_ENV,
    // GOOGLE_CLOUD_PROJECT, GAE_SERVICE, GAE_VERSION, GAE_INSTANCE,
  })

  process.on('uncaughtException', err => {
    void slackService.send('uncaughtException\n' + err)
  })
  process.on('unhandledRejection', err => {
    void slackService.send('unhandledRejection\n' + err)
  })
  process.on('SIGINT', signal => {
    void slackService.send(`onSignal: ${signal}`)
  })
  process.on('SIGTERM', signal => {
    void slackService.send(`onSignal: ${signal}`)
  })

  const { bootstrapMillis } = await startServer({
    bootstrapStartedAt,
    expressApp,
    forceShutdownTimeout: 5000,
    onShutdown: async () => {
      await slackService.send(`kg-backend3 onShutdown`)
    },
  })

  if (isGAE()) {
    void slackService.sendMsg({
      text: `kg-backend3 *${APP_ENV}* server started in ${ms(bootstrapMillis)}`,
      kv,
    })

    await warmup()

    // schedule
    nodeSchedule.scheduleJob(userStarsUpdaterSchedule, () => userStarsUpdater.start())
    nodeSchedule.scheduleJob(releasesUpdaterSchedule, () => releasesUpdater.start())
    nodeSchedule.scheduleJob('0 2 * * *', () => notifyOfNewReleasesDaily())
  }

  await pHang() // keep server running
})
