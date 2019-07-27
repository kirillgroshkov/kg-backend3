/*

DEBUG=kg:*,nc:* yarn tsn-script ./scripts/updateRepoReleases.ts

 */

require('dotenv').config()
import { releasesService } from '@src/releases/releases.service'

void main()

async function main () {
  // const repoFullName = 'NaturalCycles/dev-lib'
  // const repoFullName = 'google/incremental-dom'
  const repoFullName = 'compodoc/compodoc'
  await releasesService.updateRepoReleases(repoFullName)
}
