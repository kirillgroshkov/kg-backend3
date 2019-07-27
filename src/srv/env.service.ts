import { EnvSharedService } from '@naturalcycles/backend-lib'
import { envDir } from '@src/cnst/paths.cnst'
import { Env } from '@src/env/prod.env'

export const envService = new EnvSharedService({ envDir })

// shortcut
export function env (): Env {
  return envService.getEnv()
}
