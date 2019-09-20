import { Release, releaseDao } from '@src/releases/release.model'

class ReleasesService {
  /*
  async updateUserReleases (
    u: ReleasesUser,
    limitRepos = 99999,
    limitReleasedPerRepo = 100,
    concurrency = 1,
  ): Promise<void> {
    const repoNames = u.starredRepos
    // console.log({repoNames})

    await pMap(
      repoNames.slice(0, limitRepos),
      async repoName => {
        await this.updateRepoReleases(repoName)
      },
      { concurrency },
    )
  }


  async updateRepoReleases (repoFullName: string, limitReleasedPerRepo = 100): Promise<void> {
    log(`updateRepoReleases ${repoFullName}`)

    const repo = await releasesRepoDao.getById(releasesRepoDao.naturalId(repoFullName))
    const lastReleaseTag = repo && repo.lastReleaseTag

    const releases = await this.fetchReleases(
      repoFullName,
      lastReleaseTag,
      limitReleasedPerRepo,
    ).catch(err => {
      console.error(err)
      // todo: collect errors
      return []
    })
    // console.log(releases)

    if (releases.length) {
      await releaseDao.saveBatch(releases)

      const [lastRelease] = releases
      if (repo && repo.lastReleaseTag !== lastRelease.tagName) {
        await releasesRepoDao.save({
          ...repo,
          lastReleaseTag: lastRelease.tagName,
        })
      }
    }
  }*/

  async getLastReleases(): Promise<Release[]> {
    const q = releaseDao
      .createQuery()
      .order('published', true)
      .limit(200)
    return releaseDao.runQuery(q, { onlyCache: true })
  }
}

export const releasesService = new ReleasesService()
