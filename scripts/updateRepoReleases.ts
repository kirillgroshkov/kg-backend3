/*

DEBUG=kg:*,nc:* yarn tsn-script ./scripts/updateRepoReleases.ts

 */

require('dotenv').config()
import { releasesService } from '@src/releases/releases.service'

void main()
  .then(async () => {
    process.exit(0)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

async function main () {
  // const repoFullName = 'NaturalCycles/dev-lib'
  // const repoFullName = 'google/incremental-dom'
  // const repoFullName = 'compodoc/compodoc'
  const repoFullName = 'Daplie/node-greenlock' // http 451
  await releasesService.updateRepoReleases(repoFullName)
}
