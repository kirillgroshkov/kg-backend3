import { BaseDBEntity, baseDBEntitySchema, CommonDao } from '@naturalcycles/db-lib'
import {
  arraySchema,
  booleanSchema,
  emailSchema,
  integerSchema,
  objectSchema,
  stringSchema,
  validate,
} from '@naturalcycles/nodejs-lib'
import { defaultDaoCfg } from '@src/releases/dao'

export interface UserSettings {
  notificationEmail?: string
  notifyEmailRealtime?: boolean
  notifyEmailDaily?: boolean
}

export const userSettingsSchema = objectSchema<UserSettings>({
  notificationEmail: emailSchema.optional(),
  notifyEmailRealtime: booleanSchema.optional(),
  notifyEmailDaily: booleanSchema.optional(),
})

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

  settings: UserSettings
}

export interface ReleasesUserTM {
  id: string
  username: string
  starredReposCount: number
  displayName?: string
  settings: UserSettings
}

export const releasesUserTMSchema = objectSchema<ReleasesUserTM>({
  id: stringSchema,
  username: stringSchema,
  starredReposCount: integerSchema,
  displayName: stringSchema.optional(),
  settings: userSettingsSchema,
})

export const releasesUserSchema = objectSchema<ReleasesUser>({
  username: stringSchema,
  displayName: stringSchema,
  notificationEmail: emailSchema.optional(),
  notifyEmailDaily: booleanSchema.optional(),
  notifyEmailRealtime: booleanSchema.optional(),
  accessToken: stringSchema.optional(),
  starredRepos: arraySchema(stringSchema.lowercase())
    .default([])
    .optional(),
  settings: userSettingsSchema,
}).concat(baseDBEntitySchema)

class ReleasesUserDao extends CommonDao<ReleasesUser> {
  bmToFM(bm: ReleasesUser): ReleasesUserTM {
    return validate(
      {
        ...bm,
        starredReposCount: bm.starredRepos.length,
      },
      releasesUserTMSchema,
    )
  }
}

export const releasesUserDao = new ReleasesUserDao({
  ...defaultDaoCfg,
  table: 'ReleasesUser',
  bmSchema: releasesUserSchema,
  dbmSchema: releasesUserSchema,
  tmSchema: releasesUserTMSchema,
})
