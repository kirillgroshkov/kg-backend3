import { createDefaultApp } from '@naturalcycles/backend-lib'
import { releasesResource } from '@src/releases/releases.resource'
import { rootResource } from '@src/server/root.resource'
import { slResource } from '@src/sl/sl.resource'
import { sentryService } from '@src/srv/sentry.service'

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
      {
        path: '/sl',
        handler: slResource,
      },
    ],
  },
  sentryService,
)
