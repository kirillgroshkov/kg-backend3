import { EnvSharedService } from '@naturalcycles/backend-lib'
import { envDir } from '@src/cnst/paths.cnst'
import { Env } from '@src/env/prod.env'

export const envService = new EnvSharedService({ envDir })

export const env: Env = envService.getEnv()
