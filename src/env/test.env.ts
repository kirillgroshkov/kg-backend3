import { EnvDev } from '@src/env/dev.env'

export class EnvTest extends EnvDev {
  name = 'test'

  slackEnabled = false
}

export const envTest = new EnvTest()
export default envTest
