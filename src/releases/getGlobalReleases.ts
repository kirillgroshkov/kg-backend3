import { Release, releaseDao } from '@src/releases/release.model'
import { ReleasesQuery } from '@src/releases/releases.model'

export async function getGlobalReleases(query: ReleasesQuery = {}): Promise<Release[]> {
  const {
    // maxDaysOld = 90,
    // maxReleasesPerRepo = 10,
    maxReleasesTotal = 100,
  } = query

  const q = releaseDao
    .createQuery()
    .order('published', true)
    .limit(maxReleasesTotal)
  return releaseDao.runQuery(q)
}
