import { dayjs } from '@naturalcycles/time-lib'
import { releaseDao } from '@src/releases/model/release.model'
import { BackendResponse, DateRange } from '@src/releases/model/releases.model'
import { ReleasesUser } from '@src/releases/model/releasesUser.model'

export interface GetFeedOpt extends DateRange {}

export async function getFeed(user: ReleasesUser, opt: GetFeedOpt = {}): Promise<BackendResponse> {
  const {
    minIncl = dayjs()
      .subtract(3, 'day')
      .toISODate(),
    maxExcl = '2999-01-01',
  } = opt

  const publishedMinIncl = dayjs(minIncl).unix()
  const publishedMaxExcl = dayjs(maxExcl).unix()

  const { starredRepos } = user

  const releases = await releaseDao
    .query()
    .filter('repoFullName', 'in', starredRepos)
    .filter('published', '>=', publishedMinIncl)
    .filter('published', '<', publishedMaxExcl)
    .order('published', true)
    .limit(100)
    .runQuery()

  return {
    releases,
  }
}
