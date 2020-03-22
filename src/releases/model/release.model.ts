import { BaseDBEntity, baseDBEntitySchema, CommonDao } from '@naturalcycles/db-lib'
import {
  objectSchema,
  stringSchema,
  unixTimestampSchema,
  urlSchema,
} from '@naturalcycles/nodejs-lib'
import { defaultDaoCfg } from '@src/srv/db'

export enum ReleaseType {
  RELEASE = 'RELEASE',
  TAG = 'TAG',
}

export const RELEASE_TYPE_VALUES = [ReleaseType.RELEASE, ReleaseType.TAG]

export interface Release extends BaseDBEntity {
  // id = ${repoFullName}_${tagName}

  published: number
  repoFullName: string
  descrHtml?: string
  author: string
  authorThumb?: string

  avatarUrl?: string

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

export const releaseSchema = objectSchema<Release>({
  id: stringSchema.lowercase().optional(),
  published: unixTimestampSchema,
  repoFullName: stringSchema.lowercase(),
  descrHtml: stringSchema.optional(),
  author: stringSchema,
  authorThumb: urlSchema().optional(),
  avatarUrl: urlSchema().optional(),
  v: stringSchema.lowercase(),
  tagName: stringSchema.lowercase(),
  type: stringSchema.valid(...RELEASE_TYPE_VALUES),
}).concat(baseDBEntitySchema)

class ReleaseDao extends CommonDao<Release> {
  // createId (dbm: Release): string {
  //   return [...dbm.repoFullName.split('/'), dbm.v].join('_').toLowerCase()
  // }
}

export const releaseDao = new ReleaseDao({
  ...defaultDaoCfg,
  table: 'Release',
  bmSchema: releaseSchema,
  dbmSchema: releaseSchema,
})
