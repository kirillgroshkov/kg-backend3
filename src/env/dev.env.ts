import { SlackSharedServiceCfg } from '@naturalcycles/backend-lib'
import { EnvProd } from './prod.env'

export class EnvDev extends EnvProd {
  name = 'dev'
  prod = false
  dev = true

  swaggerStatsEnabled = false

  sentryServiceCfg = {
    // dsn: undefined,
  }

  authEnabled = false

  slackServiceCfg: SlackSharedServiceCfg = {
    // webhookUrl: undefined
  }
}

const envDev = new EnvDev()
export default envDev
