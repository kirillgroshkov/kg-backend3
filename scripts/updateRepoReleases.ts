/*

APP_ENV=dev DEBUG=app*,kg:*,nc:* yarn tsn-script ./scripts/updateRepoReleases.ts

 */

/* tslint:disable:ordered-imports */
import '@src/bootstrap'
import { pDelay } from '@naturalcycles/js-lib'
import { runScript } from '@naturalcycles/nodejs-lib'
import { releasesUpdater } from '@src/releases/releasesUpdater'

runScript(async () => {
  // const repoFullName = 'NaturalCycles/dev-lib'.toLowerCase()
  // const repoFullName = 'google/incremental-dom'
  // const repoFullName = 'compodoc/compodoc'
  // const repoFullName = 'nodejs/nan'
  // const repoFullName = 'nushell/nushell'
  // const repoFullName = 'deanoemcke/thegreatsuspender'
  const repoFullName = 'Daplie/node-greenlock' // http 451
  // const repoFullName = 'fluent-ffmpeg/node-fluent-ffmpe'
  // const repoFullName = 'shopify/dashing'
  const newReleases = await releasesUpdater.fetchReleases(repoFullName)
  // const repo = await releasesRepoDao.requireById(repoFullName)
  // const newReleases = await releasesUpdater.checkRepo(repo)
  console.log({ newReleases: newReleases.map(r => r.id) }, newReleases.length)
  await pDelay(1000)
})
