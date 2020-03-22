import { Release, releaseDao } from '@src/releases/model/release.model'
import { ReleasesQuery } from '@src/releases/model/releases.model'

export async function getGlobalReleases(query: ReleasesQuery = {}): Promise<Release[]> {
  const {
    // maxDaysOld = 90,
    // maxReleasesPerRepo = 10,
    maxReleasesTotal = 100,
  } = query

  return await releaseDao.query().order('published', true).limit(maxReleasesTotal).runQuery()
}
