import { Release, releaseDao } from '@src/releases/release.model'
import { ReleasesQuery } from '@src/releases/releases.model'
import { releasesService } from '@src/releases/releases.service'

export async function getRepoReleases (
  repoFullName: string,
  query: ReleasesQuery = {},
): Promise<Release[]> {
  const {
    // maxDaysOld = 90,
    // maxReleasesPerRepo = 10,
    maxReleasesTotal = 100,
    skipCache,
  } = query

  let releases: Release[] = []

  if (!skipCache) {
    const q = releaseDao
      .createQuery()
      .filter('repoFullName', '=', repoFullName)
      .order('published', true)
      .limit(maxReleasesTotal)
    releases = await releaseDao.runQuery(q)
  }

  if (!releases.length) {
    // hit origin!
    const unsavedReleases = await releasesService.fetchReleases(
      repoFullName,
      undefined,
      maxReleasesTotal,
    )
    releases = await releaseDao.saveBatch(unsavedReleases)
  }

  return releases
}
