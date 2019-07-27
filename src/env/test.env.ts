import { EnvDev } from '@src/env/dev.env'

export class EnvTest extends EnvDev {
  name = 'test'
}

export const envTest = new EnvTest()
export default envTest
