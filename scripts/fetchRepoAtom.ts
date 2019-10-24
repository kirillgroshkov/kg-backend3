/*

APP_ENV=dev DEBUG=app*,kg:*,nc:* yarn tsn ./scripts/fetchRepoAtom.ts

 */

/* tslint:disable:ordered-imports */
import '@src/bootstrap'
import { _omit } from '@naturalcycles/js-lib'
import { runScript } from '@naturalcycles/nodejs-lib'
import { atomService } from '@src/releases/atom.service'
import { releasesRepoDao } from '@src/releases/model/releasesRepo.model'
import * as got from 'got'

runScript(async () => {
  const repoFullName = 'deanoemcke/thegreatsuspender'
  const repo = await releasesRepoDao.requireById(repoFullName)
  const after = ''

  const releasesUrl = `https://github.com/${repo.id}/releases.atom`
  const url = `${releasesUrl}?after=${after}`
  const { body } = await got(url)
  const atoms = await atomService.parseAsReleases(body, repo.id)
  console.table(atoms.map(a => _omit(a, ['descrHtml'])))
  // console.log(Object.keys(atoms[0]))
  // console.log({newReleases: newReleases.map(r => r.id)}, newReleases.length)
  // await pDelay(1000)
})
