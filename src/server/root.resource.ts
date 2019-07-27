import { getDefaultRouter, rootHandler } from '@naturalcycles/backend-lib'
import { env } from '@src/srv/env.service'

const router = getDefaultRouter()
export const rootResource = router

router.get('/', rootHandler())

router.get('/debug', async (req, res) => {
  res.json({
    environment: env(),
    // env: process.env,
    headers: req.headers,
  })
})

router.get('/_ah/warmup', async (req, res) => {
  res.status(200).end()
})
