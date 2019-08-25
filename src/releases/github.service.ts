import { coloredHttpCode } from '@naturalcycles/backend-lib'
import { Unsaved } from '@naturalcycles/db-lib'
import { filterFalsyValues, StringMap } from '@naturalcycles/js-lib'
import { Debug } from '@naturalcycles/nodejs-lib'
import { since } from '@naturalcycles/time-lib'
import { Etag, etagDao } from '@src/releases/etag.model'
import { ReleasesRepo } from '@src/releases/releasesRepo.model'
import { ReleasesUser } from '@src/releases/releasesUser.model'
import c from 'chalk'
import { GotJSONOptions } from 'got'
import * as got from 'got'

const API = 'https://api.github.com'

const log = Debug('app:gh')

class GithubService {
  headers (token: string): StringMap {
    return {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'kirillgroshkov',
      Authorization: `token ${token}`,
    }
  }

  /**
   * Undefined means "not changed".
   */
  async getUserStarredRepos (
    u: ReleasesUser,
    maxPages = 100, // 10.000 stars is a cap now
  ): Promise<Unsaved<ReleasesRepo>[] | undefined> {
    // tslint:disable-next-line:variable-name
    const per_page = 100
    let unchanged = false
    const allRepos: Unsaved<ReleasesRepo>[] = []
    let repos: Unsaved<ReleasesRepo>[] | undefined
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

      if (page === 1 && lastStarredRepo && repos.length && repos[0].id === lastStarredRepo) {
        unchanged = true
        break
      }

      allRepos.push(...repos)
    } while (repos.length === per_page && page < maxPages)

    if (unchanged) {
      return
    }

    return allRepos
  }

  /**
   * Returns undefined if not changed (practically possible only on page1).
   *
   * Manages etag cache internally (via etagDao).
   * Only uses etag cache for page 1 - loads (sync), saves (async) if non-304 (200) is returned.
   */
  private async getUserStarredReposPage (
    page: number,
    u: ReleasesUser,
  ): Promise<Unsaved<ReleasesRepo>[] | undefined> {
    // tslint:disable-next-line:variable-name
    const per_page = 100

    let ifNoneMatch: string | undefined
    let urlEtag: Unsaved<Etag> | undefined

    const url = `${API}/users/${u.username}/starred?per_page=${per_page}&page=${page}`

    if (page === 1) {
      urlEtag = await etagDao.getByIdOrEmpty(url, { skipValidation: true }) // todo: figure out validation here
      ifNoneMatch = urlEtag.etag
    }

    const opt: GotJSONOptions = {
      json: true,
      headers: filterFalsyValues({
        ...this.headers(u.accessToken!),
        Accept: 'application/vnd.github.v3.star+json', // will include "star creation timestamps" starred_at
        'If-None-Match': ifNoneMatch,
      }),
      timeout: 10000,
    }

    const started = Date.now()
    log(`>> GET ${c.dim(url)} ${ifNoneMatch || ''}`)

    const resp = await got.get(url, opt)
    const etagReturned = resp.headers.etag as string | undefined

    log(
      `<< ${coloredHttpCode(resp.statusCode)} GET ${c.dim(url)} ${etagReturned || ''} in ${c.dim(
        since(started),
      )}`,
    )

    if (resp.statusCode === 304) {
      // not changed
      return
    }

    if (etagReturned && urlEtag) {
      urlEtag.etag = this.stripW(etagReturned)
      void etagDao.save(urlEtag)
    }

    return ((resp.body as any) as any[]).map(r => this.mapRepo(r))
  }

  stripW (etag?: string): string {
    if (!etag) return undefined as any
    if (etag.startsWith('W/')) {
      return etag.substr(2)
    }
    return etag
  }

  private mapRepo (r: any): Unsaved<ReleasesRepo> {
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
