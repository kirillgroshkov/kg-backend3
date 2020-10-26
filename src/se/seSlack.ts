import { secret, SlackService } from '@naturalcycles/nodejs-lib'
import { env } from '@src/srv/env.service'
import type { Request } from 'express'

const defaults = {
  channel: '#log',
  username: 'bot',
  icon_emoji: ':male-technologist:',
  text: 'no text',
}

const { slackEnabled } = env
const webhookUrl = slackEnabled ? secret('SECRET_SLACK_HOOK_URL_SE') : undefined

export const seSlack = new SlackService<Request>({
  webhookUrl,
  defaults,
})
