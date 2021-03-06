import { SentrySharedService } from '@naturalcycles/backend-lib'
import { secret } from '@naturalcycles/nodejs-lib'
import * as Sentry from '@sentry/node'
import { env } from '@src/srv/env.service'

const { sentryServiceCfg, sentryEnabled } = env
const { APP_ENV } = process.env

export const sentryService = new SentrySharedService({
  ...sentryServiceCfg,
  environment: APP_ENV,
  dsn: sentryEnabled ? secret('SECRET_SENTRY_DSN') : undefined,
  integrations: [
    // new RewriteFrames({
    //   root: projectDir,
    // }),
    new Sentry.Integrations.OnUncaughtException({
      onFatalError(err: Error, secondError?: Error): void {
        console.error(`onFatalError`, err, secondError)
      },
    }),
  ],
})
