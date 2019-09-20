import { SentrySharedService } from '@naturalcycles/backend-lib'
import { secret } from '@naturalcycles/nodejs-lib'
import { RewriteFrames } from '@sentry/integrations'
import * as Sentry from '@sentry/node'
import { srcDir } from '@src/cnst/paths.cnst'
import { env } from '@src/srv/env.service'

const { sentryServiceCfg, sentryEnabled } = env()
const { APP_ENV } = process.env

export const sentryService = new SentrySharedService({
  ...sentryServiceCfg,
  environment: APP_ENV,
  dsn: sentryEnabled ? secret('SECRET_SENTRY_DSN') : undefined,
  integrations: [
    new RewriteFrames({
      root: srcDir,
    }),
    new Sentry.Integrations.OnUncaughtException({
      onFatalError(err: Error, secondError?: Error): void {
        console.error(`onFatalError`, err, secondError)
      },
    }),
  ],
})
