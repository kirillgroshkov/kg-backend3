/*

DEBUG=app*,kg:*,nc:* yarn tsn-script ./scripts/updateRepoReleases.ts

 */

/* tslint:disable:ordered-imports */
import '@src/bootstrap'
import { runScript } from '@naturalcycles/nodejs-lib'
import { releasesService } from '@src/releases/releases.service'

runScript(async () => {
  // const repoFullName = 'NaturalCycles/dev-lib'
  // const repoFullName = 'google/incremental-dom'
  // const repoFullName = 'compodoc/compodoc'
  const repoFullName = 'Daplie/node-greenlock' // http 451
  await releasesService.updateRepoReleases(repoFullName)
})
