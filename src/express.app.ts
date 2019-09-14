import { createDefaultApp } from '@naturalcycles/backend-lib'
import { releasesResource } from '@src/releases/releases.resource'
import { rootResource } from '@src/server/root.resource'
import { env } from '@src/srv/env.service'
import { sentryService } from '@src/srv/sentry.service'

const { swaggerStatsEnabled } = env()

export const expressApp = createDefaultApp(
  {
    resources: [
      {
        path: '/',
        handler: rootResource,
      },
      {
        path: '/releases',
        handler: releasesResource,
      },
    ],
    swaggerStatsEnabled,
  },
  sentryService,
)
