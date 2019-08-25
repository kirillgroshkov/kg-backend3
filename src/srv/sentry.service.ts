import { SentrySharedService } from '@naturalcycles/backend-lib'
import { secret } from '@naturalcycles/nodejs-lib'
import { env } from '@src/srv/env.service'

const { sentryServiceCfg, sentryEnabled } = env()
const { APP_ENV } = process.env

export const sentryService = new SentrySharedService({
  ...sentryServiceCfg,
  environment: APP_ENV,
  dsn: sentryEnabled ? secret('SECRET_SENTRY_DSN') : undefined,
})
