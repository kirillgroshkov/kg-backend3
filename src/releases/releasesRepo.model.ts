import { BaseDBEntity, CommonDao, Unsaved } from '@naturalcycles/db-lib'
import {
  integerSchema,
  objectSchema,
  stringSchema,
  unixTimestampSchema,
  urlSchema,
} from '@naturalcycles/nodejs-lib'
import { defaultDaoCfg } from '@src/releases/dao'

export interface ReleasesRepo extends BaseDBEntity {
  githubId: number

  /**
   * @example facebook/react
   */
  fullName: string

  descr?: string

  avatarUrl: string

  homepage?: string

  stargazersCount: number

  /**
   * Unixtime. Exists only in memory, not persisted to DB.
   */
  // starredAt?: number

  lastReleaseTag?: string
}

export const releasesRepoUnsavedSchema = objectSchema<Unsaved<ReleasesRepo>>({
  id: stringSchema.optional(),
  created: unixTimestampSchema.optional(),
  updated: unixTimestampSchema.optional(),
  githubId: integerSchema,
  fullName: stringSchema,
  descr: stringSchema.optional(),
  avatarUrl: urlSchema(),
  homepage: stringSchema.optional(),
  stargazersCount: integerSchema,
  lastReleaseTag: stringSchema.optional(),
})
// .concat(unsavedDBEntitySchema)

class ReleasesRepoDao extends CommonDao<ReleasesRepo> {
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
  }
}

export const releasesRepoDao = new ReleasesRepoDao({
  ...defaultDaoCfg,
  table: 'ReleasesRepo',
  bmUnsavedSchema: releasesRepoUnsavedSchema,
  dbmUnsavedSchema: releasesRepoUnsavedSchema,
  idSchema: stringSchema.lowercase(),
})
