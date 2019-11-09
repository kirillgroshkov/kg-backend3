import { SentrySharedServiceCfg } from '@naturalcycles/backend-lib'

export class EnvProd {
  name = 'prod'
  prod = true
  dev = false

  sentryServiceCfg: SentrySharedServiceCfg = {
    // dsn is secret
  }

  sentryEnabled = true

  authEnabled = true

  slackEnabled = true
}

export type Env = EnvProd

const envProd = new EnvProd()

export default envProd
