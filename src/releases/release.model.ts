import {
  BaseDBEntity,
  CommonDao,
  Unsaved,
  unsavedDBEntitySchema,
} from '@naturalcycles/db-lib'
import {
  objectSchema,
  stringSchema,
  unixTimestampSchema,
  urlSchema,
} from '@naturalcycles/nodejs-lib'
import { defaultDaoCfg } from '@src/releases/dao'

export enum ReleaseType {
  RELEASE = 'RELEASE',
  TAG = 'TAG',
}

export const RELEASE_TYPE_VALUES = [ReleaseType.RELEASE, ReleaseType.TAG]

export interface Release extends BaseDBEntity {
  published: number
  repoFullName: string
  descrHtml?: string
  author: string
  authorThumb: string

  /**
   * @example 0.3.6
   */
  v: string

  /**
   * @example v0.3.6b
   */
  tagName: string

  type: ReleaseType
}

export const releaseUnsavedSchema = objectSchema<Unsaved<Release>>({
  published: unixTimestampSchema,
  repoFullName: stringSchema,
  descrHtml: stringSchema.optional(),
  author: stringSchema,
  authorThumb: urlSchema(),
  v: stringSchema,
  tagName: stringSchema,
  type: stringSchema.valid(RELEASE_TYPE_VALUES),
}).concat(unsavedDBEntitySchema)

class ReleaseDao extends CommonDao<Release> {
  createId (dbm: Release): string {
    return [...dbm.repoFullName.split('/'), dbm.v].join('_').toLowerCase()
  }
}

export const releaseDao = new ReleaseDao({
  ...defaultDaoCfg,
  table: 'Release',
  bmUnsavedSchema: releaseUnsavedSchema,
  dbmUnsavedSchema: releaseUnsavedSchema,
  idSchema: stringSchema.lowercase(),
})
