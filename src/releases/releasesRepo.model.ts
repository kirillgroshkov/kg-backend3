import { BaseDBEntity, baseDBEntitySchema, CommonDao, ObjectWithId } from '@naturalcycles/db-lib'
import {
  integerSchema,
  objectSchema,
  stringSchema,
  unixTimestampSchema,
  urlSchema,
} from '@naturalcycles/nodejs-lib'
import { defaultDaoCfg } from '@src/releases/dao'

export interface ReleasesRepo extends BaseDBEntity {
  // id == fullName, e.g `facebook/react`

  /**
   * Left part of fullName, e.g `facebook`
   */
  author: string

  /**
   * Right part of fullName, e.g `react`
   */
  name: string

  githubId: number

  descr?: string

  avatarUrl: string

  homepage?: string

  stargazersCount?: number

  /**
   * Unixtime. Exists only in memory, not persisted to DB.
   */
  // starredAt?: number

  // lastReleaseTag?: string // will be queried from Release.tag
  /**
   * @default to 0 when repo is just added
   */
  releasesChecked: number
}

export const releasesRepoSchema = objectSchema<ReleasesRepo>({
  id: stringSchema.lowercase().optional(),
  author: stringSchema.lowercase(),
  name: stringSchema.lowercase(),
  githubId: integerSchema,
  descr: stringSchema.optional(),
  avatarUrl: urlSchema(),
  homepage: stringSchema.optional(),
  stargazersCount: integerSchema.optional(),
  // lastReleaseTag: stringSchema.optional(),
  releasesChecked: unixTimestampSchema.default(0).optional(),
}).concat(baseDBEntitySchema)

class ReleasesRepoDao extends CommonDao<ReleasesRepo> {
  /*
  createId (dbm: ReleasesRepo): string {
    return dbm.fullName
      .split('/')
      .join('_')
      .toLowerCase()
  }

  naturalId (fullName: string): string {
    return fullName
      .split('/')
      .join('_')
      .toLowerCase()
  }*/

  async getAllIds(): Promise<string[]> {
    const items: ObjectWithId[] = await this.runQuery(this.createQuery().select([]))
    return items.map(i => i.id)
  }
}

export const releasesRepoDao = new ReleasesRepoDao({
  ...defaultDaoCfg,
  table: 'ReleasesRepo',
  bmSchema: releasesRepoSchema,
  dbmSchema: releasesRepoSchema,
})
