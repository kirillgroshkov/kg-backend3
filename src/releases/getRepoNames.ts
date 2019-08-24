import { _uniq } from '@naturalcycles/js-lib'
import { mongoDB } from '@src/srv/db'

export async function getRepoNames (): Promise<string[]> {
  const client = await mongoDB.client()
  const r: string[] = await client
    .db(mongoDB.cfg.db)
    .collection('Release')
    .distinct('repoFullName', {})

  return r.map(r => r.toLowerCase()).sort()
}

export async function getRepoOrgs (): Promise<string[]> {
  const names = await getRepoNames()
  return _uniq(names.map(n => n.split('/')[0]))
}
