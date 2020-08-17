import { DebugLogLevel, secret, SlackService } from '@naturalcycles/nodejs-lib'
import { env } from '@src/srv/env.service'

const defaults = {
  channel: '#kg-backend3',
  username: 'bot',
  icon_emoji: ':spider_web:',
  text: 'no text',
}

const { slackEnabled } = env()
const webhookUrl = slackEnabled ? secret('SECRET_SLACK_HOOK_URL') : undefined

export const slackService = new SlackService({
  webhookUrl,
  defaults,
})

export const slackReleases = new SlackService({
  webhookUrl,
  defaults: {
    ...defaults,
    channel: '#releases',
  },
  channelByLevel: {
    [DebugLogLevel.debug]: '#releases-debug',
    [DebugLogLevel.error]: '#releases-error',
  },
})
