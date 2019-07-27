import { SentrySharedService } from '@naturalcycles/backend-lib'
import { env } from '@src/srv/env.service'

const { sentryServiceCfg } = env()
export const sentryService = new SentrySharedService(sentryServiceCfg)
