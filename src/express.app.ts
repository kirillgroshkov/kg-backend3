import { createDefaultApp } from '@naturalcycles/backend-lib'
import { airtableResource } from '@src/airtable/airtable.resource'
import { grafanaResource } from '@src/grafana/grafana.resource'
import { metrikiResource } from '@src/metriki/metriki.resource'
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
      {
        path: '/metriki',
        handler: metrikiResource,
      },
      {
        path: '/grafana',
        handler: grafanaResource,
      },
      {
        path: '/airtable',
        handler: airtableResource,
      },
      // {
      //   path: '/spotify',
      //   handler: spotifyResource,
      // },
    ],
  },
  sentryService,
)
