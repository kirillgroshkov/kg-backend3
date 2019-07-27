import { Unsaved } from '@naturalcycles/db-lib'
import { StringMap } from '@naturalcycles/js-lib'
import { Debug } from '@naturalcycles/nodejs-lib'
import { since } from '@naturalcycles/time-lib'
import { ReleasesRepo } from '@src/releases/releasesRepo.model'
import { ReleasesUser } from '@src/releases/releasesUser.model'
import { GotJSONOptions } from 'got'
import * as got from 'got'

const API = 'https://api.github.com'

const log = Debug('kg:backend:gh')

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
    etagMap: StringMap = {},
    maxPages = 999,
  ): Promise<Unsaved<ReleasesRepo>[] | undefined> {
    // tslint:disable-next-line:variable-name
    const per_page = 100
    const allRepos: Unsaved<ReleasesRepo>[] = []
    let repos: Unsaved<ReleasesRepo>[] | undefined
    let page = 0

    do {
      page++
      repos = await this.getUserStarredReposPage(page, u, etagMap)
      if (!repos) return undefined // not changed

      if (page === 1 && repos[0].fullName === u.lastStarredRepo) return undefined // not changed
      log(`page ${page} repos: ${repos.length}`)
      allRepos.push(...repos)
    } while (repos.length === per_page && page < maxPages)

    return allRepos
  }

  async getUserStarredReposPage (
    page = 0,
    u: ReleasesUser,
    etagMap: StringMap,
  ): Promise<Unsaved<ReleasesRepo>[] | undefined> {
    // tslint:disable-next-line:variable-name
    const per_page = 100

    const url = `${API}/users/${u.username}/starred?per_page=${per_page}&page=${page}`
    const etag = etagMap[url]
    const opt: GotJSONOptions = {
      json: true,
      headers: {
        ...this.headers(u.accessToken!),
        Accept: 'application/vnd.github.v3.star+json', // will include "star creation timestamps" starred_at
        'If-None-Match': etag,
      },
      timeout: 10000,
    }

    const started = Date.now()
    log(`>> GET ${url} ${etag || ''}`)

    const resp = await got.get(url, opt)
    const etagReturned = resp.headers.etag as string

    log(`<< ${resp.statusCode} GET ${url} ${etagReturned || ''} in ${since(started)}`)

    if (etagReturned) {
      etagMap[url] = this.stripW(etagReturned)
    }

    if (resp.statusCode === 304) return undefined // not changed

    return ((resp.body as any) as any[]).map(r => this.mapRepo(r))
  }

  stripW (etag: string): string {
    if (etag.startsWith('W/')) {
      return etag.substr(2)
    }
    return etag
  }

  private mapRepo (r: any): Unsaved<ReleasesRepo> {
    // console.log('mapRepo', r, r.repo.full_name)
    return {
      githubId: r.repo.id,
      fullName: r.repo.full_name,
      // owner: r.repo.owner.login,
      // name: r.repo.name,
      descr: r.repo.description,
      homepage: r.repo.homepage,
      stargazersCount: r.repo.stargazers_count,
      avatarUrl: r.repo.owner.avatar_url,
      // starredAt: dayjs(r.starred_at).unix(),
    }
  }
}

export const githubService = new GithubService()
