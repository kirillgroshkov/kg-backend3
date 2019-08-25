import { getDefaultRouter, loginHtml, okHandler, statusHandler } from '@naturalcycles/backend-lib'
import { adminService, reqAdmin } from '@src/admin/admin.service'
import { env } from '@src/srv/env.service'
import { slackService } from '@src/srv/slack.service'
import { warmup } from '@src/warmup'

const router = getDefaultRouter()
export const rootResource = router

router.get('/', okHandler())

router.get('/login.html', loginHtml(adminService))

router.get('/status', reqAdmin(), statusHandler())

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
