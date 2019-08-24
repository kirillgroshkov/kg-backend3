import { BaseDBEntity, CommonDao, Unsaved, unsavedDBEntitySchema } from '@naturalcycles/db-lib'
import { booleanSchema, emailSchema, objectSchema, stringSchema } from '@naturalcycles/nodejs-lib'
import { defaultDaoCfg } from '@src/releases/dao'

export interface ReleasesUser extends BaseDBEntity {
  username: string
  displayName: string
  lastStarredRepo?: string

  notificationEmail?: string
  notifyEmailDaily?: boolean
  notifyEmailRealtime?: boolean

  /**
   * Empty accessToken means it was revoked.
   */
  accessToken?: string
}

export const releasesUserUnsavedSchema = objectSchema<Unsaved<ReleasesUser>>({
  username: stringSchema,
  displayName: stringSchema,
  lastStarredRepo: stringSchema.optional(),
  notificationEmail: emailSchema.optional(),
  notifyEmailDaily: booleanSchema.optional(),
  notifyEmailRealtime: booleanSchema.optional(),
  accessToken: stringSchema.optional(),
}).concat(unsavedDBEntitySchema)

export const releasesUserDao = new CommonDao<ReleasesUser>({
  ...defaultDaoCfg,
  table: 'ReleasesUser',
  bmUnsavedSchema: releasesUserUnsavedSchema,
  dbmUnsavedSchema: releasesUserUnsavedSchema,
})
