import {
  getDefaultRouter,
  loginHtml,
  okHandler,
  statusHandlerData,
} from '@naturalcycles/backend-lib'
import { adminService, reqAdmin } from '@src/admin/admin.service'
import { releasesUpdater } from '@src/releases/releasesUpdater'
import { userStarsUpdater } from '@src/releases/userStarsUpdater'
import { env } from '@src/srv/env.service'
import { firebaseService } from '@src/srv/firebase.service'
import { slackService } from '@src/srv/slack.service'
import { warmup } from '@src/warmup'

const router = getDefaultRouter()
export const rootResource = router

router.get('/', okHandler())

router.get('/login.html', loginHtml(firebaseService.cfg))

router.get('/status', reqAdmin(), async (req, res) => {
  res.json({
    ...statusHandlerData(),
    userStarsUpdater: {
      lastStarted: userStarsUpdater.lastStarted ? userStarsUpdater.lastStarted.toPretty() : 'never',
      lastFinished: userStarsUpdater.lastFinished
        ? userStarsUpdater.lastFinished.toPretty()
        : 'never',
    },
    releasesUpdater: {
      lastStarted: releasesUpdater.lastStarted ? releasesUpdater.lastStarted.toPretty() : 'never',
      lastFinished: releasesUpdater.lastFinished
        ? releasesUpdater.lastFinished.toPretty()
        : 'never',
    },
  })
})

router.get('/debug', reqAdmin(), async (req, res) => {
  res.json({
    adminInfo: await adminService.getAdminInfo(req),
    environment: env(),
    headers: req.headers,
    env: process.env,
  })
})

router.get('/_ah/warmup', async (req, res) => {
  await warmup()
  res.status(200).end()
})

router.get('/slack', async (req, res) => {
  const { msg = 'test msg' } = req.query
  await slackService.send(msg, req)
  res.json({ ok: 1 })
})
