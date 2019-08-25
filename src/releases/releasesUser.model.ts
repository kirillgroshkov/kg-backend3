import { BaseDBEntity, CommonDao, Unsaved, unsavedDBEntitySchema } from '@naturalcycles/db-lib'
import {
  arraySchema,
  booleanSchema,
  emailSchema,
  objectSchema,
  stringSchema,
} from '@naturalcycles/nodejs-lib'
import { defaultDaoCfg } from '@src/releases/dao'

export interface ReleasesUser extends BaseDBEntity {
  username: string
  displayName: string
  notificationEmail?: string
  notifyEmailDaily?: boolean
  notifyEmailRealtime?: boolean

  /**
   * Empty accessToken means it was revoked.
   */
  accessToken?: string

  /**
   * Actual array of fullRepoNames
   */
  starredRepos: string[]
}

export const releasesUserUnsavedSchema = objectSchema<Unsaved<ReleasesUser>>({
  username: stringSchema,
  displayName: stringSchema,
  notificationEmail: emailSchema.optional(),
  notifyEmailDaily: booleanSchema.optional(),
  notifyEmailRealtime: booleanSchema.optional(),
  accessToken: stringSchema.optional(),
  starredRepos: arraySchema(stringSchema)
    .default([])
    .optional(),
}).concat(unsavedDBEntitySchema)

export const releasesUserDao = new CommonDao<ReleasesUser>({
  ...defaultDaoCfg,
  table: 'ReleasesUser',
  bmUnsavedSchema: releasesUserUnsavedSchema,
  dbmUnsavedSchema: releasesUserUnsavedSchema,
})
