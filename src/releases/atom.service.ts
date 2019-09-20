import { createdUpdatedFields } from '@naturalcycles/db-lib'
import { dayjs } from '@naturalcycles/time-lib'
import { Release, ReleaseType } from '@src/releases/release.model'
import * as semver from 'semver'
import { promisify } from 'util'
import { OptionsV2, parseString as _parseString, processors } from 'xml2js'

const parseString = promisify<string, OptionsV2, any>(_parseString)

// explicitArray: true
interface GithubReleasesAtom {
  feed: {
    updated: string[] // '2018-08-07T21:05:32+02:00'
    entry?: GithubReleasesAtomEntry[]
  }
}

interface GithubReleasesAtomEntry {
  id: string[] // 'tag:github.com,2008:Repository/136649588/0.1.0'
  updated: string[] // '2018-08-07T21:05:32+02:00'
  title: string[]
  content: {
    _: string
  }[]
  author: {
    name: string[]
  }[]
  'media:thumbnail'?: {
    url: string[]
  }[]
}

export interface AtomRelease {
  updated: number
  title: string
  descrHtml: string
  author: string
  authorThumb: string
  v: string
  tagName: string
}

class AtomService {
  async parseAsReleases(
    atom: string,
    repoFullName: string,
    type: ReleaseType = ReleaseType.RELEASE,
  ): Promise<Release[]> {
    const atomReleases = await this.parse(atom)
    return atomReleases.map(a => this.mapToRelease(a, repoFullName, type))
  }

  mapToRelease(a: AtomRelease, repoFullName: string, type: ReleaseType): Release {
    return {
      published: a.updated,
      repoFullName,
      descrHtml: a.descrHtml,
      author: a.author,
      authorThumb: a.authorThumb,
      v: a.v.toLowerCase(),
      tagName: a.tagName.toLowerCase(),
      type,
      id: [repoFullName, a.tagName].join('_').toLowerCase(),
      ...createdUpdatedFields(),
    }
  }

  async parse(atom: string): Promise<AtomRelease[]> {
    const res: GithubReleasesAtom = await parseString(atom, {
      trim: true,
      explicitArray: true,
      // explicitArray: false,
      mergeAttrs: true,
      attrValueProcessors: [processors.parseNumbers, processors.parseBooleans],
    })

    // console.log(res)
    // console.log(res.feed!.entry![0])

    return (res.feed.entry || []).map(entry => {
      const tagName = entry.id[0]
        .split('/')
        .reverse()[0]
        .toLowerCase()
      // const v = tagName.replace(/^\D/g,'') // remove leading non-digits
      const v = semver.clean(tagName, { loose: true }) || tagName
      const mediaThumbnail = (entry['media:thumbnail'] || [])[0]

      return {
        updated: dayjs(entry.updated[0]).unix(),
        title: entry.title[0],
        descrHtml: entry.content[0]._,
        author: entry.author[0].name[0],
        authorThumb: mediaThumbnail && mediaThumbnail.url[0],
        tagName,
        v,
      }
    })
  }
}

export const atomService = new AtomService()
