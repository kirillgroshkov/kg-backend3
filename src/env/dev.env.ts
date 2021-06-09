import { EnvProd } from './prod.env'

export class EnvDev extends EnvProd {
  override name = 'dev'
  override prod = false
  override dev = true

  // sentryServiceCfg: SentrySharedServiceCfg = {
  //   // dsn: undefined,
  // }

  override sentryEnabled = false

  override authEnabled = false

  override slackEnabled = true
}

const envDev = new EnvDev()
export default envDev
