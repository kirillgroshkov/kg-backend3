import { FileDB } from '@naturalcycles/db-lib/dist/adapter/file'
import { GithubPersistencePlugin } from '@naturalcycles/github-db'
import { createGrafanaJsonDatasourceHandler } from '@naturalcycles/grafana-lib'

const githubDB = new FileDB({
  plugin: new GithubPersistencePlugin({
    // token: GITHUB_TOKEN,
    repo: 'NaturalCycles/github-db',
  }),
})

export const grafanaResource = createGrafanaJsonDatasourceHandler({
  db: githubDB,
})
