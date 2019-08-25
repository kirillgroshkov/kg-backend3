import { _uniq } from '@naturalcycles/js-lib'
import { mongoDB } from '@src/srv/db'

export async function getRepoNames (): Promise<string[]> {
  const repoFullNames: string[] = await mongoDB.distinct('Release', 'repoFullName', {})
  return repoFullNames.map(r => r.toLowerCase()).sort()
}

export async function getRepoOrgs (): Promise<string[]> {
  const names = await getRepoNames()
  return _uniq(names.map(n => n.split('/')[0]))
}
