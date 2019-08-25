import { SlackSharedService } from '@naturalcycles/backend-lib'
import { secret } from '@naturalcycles/nodejs-lib'
import { env } from '@src/srv/env.service'

const { slackServiceCfg, slackEnabled } = env()

export const slackService = new SlackSharedService({
  ...slackServiceCfg,
  webhookUrl: slackEnabled ? secret('SECRET_SLACK_HOOK_URL') : undefined,
})
