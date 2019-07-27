import { SlackSharedService } from '@naturalcycles/backend-lib'
import { env } from '@src/srv/env.service'

const { slackServiceCfg } = env()
export const slackService = new SlackSharedService(slackServiceCfg)
