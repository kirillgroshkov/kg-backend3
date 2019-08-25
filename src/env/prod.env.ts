import { SentrySharedServiceCfg, SlackSharedServiceCfg } from '@naturalcycles/backend-lib'

export class EnvProd {
  name = 'prod'
  prod = true
  dev = false

  swaggerStatsEnabled = true

  sentryServiceCfg: SentrySharedServiceCfg = {
    // dsn is secret
  }

  sentryEnabled = true

  authEnabled = true

  slackServiceCfg: SlackSharedServiceCfg = {
    // webhookUrl is secret
    defaults: {
      channel: '#kg-backend3',
      username: 'bot',
      icon_emoji: ':spider_web:',
      text: 'no text',
    },
  }

  slackEnabled = true
}

export type Env = EnvProd

const envProd = new EnvProd()

export default envProd
