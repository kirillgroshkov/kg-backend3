import { createDefaultApp } from '@naturalcycles/backend-lib'
import { rootResource } from '@src/server/root.resource'
import { env } from '@src/srv/env.service'
import { sentryService } from '@src/srv/sentry.service'

const { swaggerStatsEnabled } = env()

export const expressApp = createDefaultApp(
  {
    resources: {
      '/': rootResource,
    },
    swaggerStatsEnabled,
  },
  sentryService,
)
