import { EnvDev } from '@src/env/dev.env'

export class EnvTest extends EnvDev {
  override name = 'test'

  override slackEnabled = false
}

export const envTest = new EnvTest()
export default envTest
