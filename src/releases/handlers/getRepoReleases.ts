import { Release, releaseDao } from '@src/releases/model/release.model'
import { ReleasesQuery } from '@src/releases/model/releases.model'
import { releasesUpdater } from '@src/releases/releasesUpdater'

export async function getRepoReleases(
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
    releases = await releaseDao
      .query()
      .filter('repoFullName', '=', repoFullName)
      .order('published', true)
      .limit(maxReleasesTotal)
      .runQuery()
  }

  if (!releases.length) {
    // hit origin!
    const unsavedReleases = await releasesUpdater.fetchReleases(repoFullName, {
      updateExisting: true,
      maxReleasesPerRepo: maxReleasesTotal,
    })
    releases = await releaseDao.saveBatch(unsavedReleases)
  }

  return releases
}
