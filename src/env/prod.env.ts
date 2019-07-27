import { SentrySharedServiceCfg, SlackSharedServiceCfg } from '@naturalcycles/backend-lib'

export class EnvProd {
  name = 'prod'
  prod = true
  dev = false

  swaggerStatsEnabled = true

  sentryServiceCfg: SentrySharedServiceCfg = {
    environment: 'prod',
    // dsn: '',
  }

  authEnabled = true

  slackServiceCfg: SlackSharedServiceCfg = {
    // webhookUrl: 'https://hooks.slack.com/services/...',
  }
}

export type Env = EnvProd

const envProd = new EnvProd()

export default envProd
