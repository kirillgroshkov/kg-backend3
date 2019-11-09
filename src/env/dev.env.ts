import { EnvProd } from './prod.env'

export class EnvDev extends EnvProd {
  name = 'dev'
  prod = false
  dev = true

  // sentryServiceCfg: SentrySharedServiceCfg = {
  //   // dsn: undefined,
  // }

  sentryEnabled = false

  authEnabled = false

  slackEnabled = true
}

const envDev = new EnvDev()
export default envDev
