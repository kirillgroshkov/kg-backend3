import { coloredHttpCode } from '@naturalcycles/backend-lib'
import { _filterFalsyValues, _since } from '@naturalcycles/js-lib'
import { Debug, getGot } from '@naturalcycles/nodejs-lib'
import { dimGrey } from '@naturalcycles/nodejs-lib/dist/colors'
import { Etag, etagDao } from '@src/releases/model/etag.model'
import { ReleasesRepo } from '@src/releases/model/releasesRepo.model'
import { ReleasesUser } from '@src/releases/model/releasesUser.model'

const API = 'https://api.github.com'

const log = Debug('app:gh')

const githubGot = getGot().extend({
  headers: {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'kirillgroshkov',
    // Authorization: `token ${token}`, // will be set
  },
})

class GithubService {
  /**
   * Null means "not changed".
   */
  async getUserStarredRepos(
    u: ReleasesUser,
    maxPages = 100, // 10.000 stars is a cap now
  ): Promise<ReleasesRepo[] | null> {
    // tslint:disable-next-line:variable-name
    const per_page = 100
    let unchanged = false
    const allRepos: ReleasesRepo[] = []
    let repos: ReleasesRepo[] | null
    let page = 0
    const [lastStarredRepo] = u.starredRepos

    do {
      page++
      repos = await this.getUserStarredReposPage(page, u)
      if (!repos) {
        unchanged = true
        break
      }

      log(`page ${page} repos: ${repos.length}`)

      if (page === 1 && lastStarredRepo && repos.length && repos[0]!.id === lastStarredRepo) {
        unchanged = true
        break
      }

      allRepos.push(...repos)
    } while (repos.length === per_page && page < maxPages)

    if (unchanged) {
      return null
    }

    return allRepos
  }

  /**
   * Returns null if not changed (practically possible only on page1).
   *
   * Manages etag cache internally (via etagDao).
   * Only uses etag cache for page 1 - loads (sync), saves (async) if non-304 (200) is returned.
   */
  private async getUserStarredReposPage(
    page: number,
    u: ReleasesUser,
  ): Promise<ReleasesRepo[] | null> {
    // tslint:disable-next-line:variable-name
    const per_page = 100

    let ifNoneMatch: string | undefined
    let urlEtag: Etag | undefined

    const url = `${API}/users/${u.username}/starred?per_page=${per_page}&page=${page}`

    if (page === 1) {
      urlEtag = await etagDao.getByIdOrEmpty(url, { skipValidation: true }) // todo: figure out validation here
      ifNoneMatch = urlEtag!.etag
    }

    const started = Date.now()
    log(`>> GET ${dimGrey(url)} ${ifNoneMatch || ''}`)

    const resp = await githubGot(url, {
      responseType: 'json',
      headers: _filterFalsyValues({
        Authorization: `token ${u.accessToken}`,
        Accept: 'application/vnd.github.v3.star+json', // will include "star creation timestamps" starred_at
        'If-None-Match': ifNoneMatch,
      }),
      timeout: 10_000,
    })
    const etagReturned = resp.headers['etag'] as string | undefined

    log(
      `<< ${coloredHttpCode(resp.statusCode)} GET ${dimGrey(url)} ${
        etagReturned || ''
      } in ${dimGrey(_since(started))}`,
    )

    if (resp.statusCode === 304) {
      // not changed
      return null
    }

    if (etagReturned && urlEtag) {
      urlEtag.etag = this.stripW(etagReturned)
      void etagDao.save(urlEtag)
    }

    return ((resp.body as any) as any[]).map(r => this.mapRepo(r))
  }

  stripW(etag?: string): string {
    if (!etag) return undefined as any
    if (etag.startsWith('W/')) {
      return etag.substr(2)
    }
    return etag
  }

  private mapRepo(r: any): ReleasesRepo {
    // console.log('mapRepo', r, r.repo.full_name)
    const [author, name] = r.repo.full_name.toLowerCase().split('/')

    return {
      id: r.repo.full_name.toLowerCase(),
      author,
      name,
      githubId: r.repo.id,
      // owner: r.repo.owner.login,
      // name: r.repo.name,
      descr: r.repo.description,
      homepage: r.repo.homepage,
      stargazersCount: r.repo.stargazers_count,
      avatarUrl: r.repo.owner.avatar_url,
      // starredAt: dayjs(r.starred_at).unix(),
      releasesChecked: 0,
    }
  }
}

export const githubService = new GithubService()
