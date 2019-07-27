import {
  BaseDBEntity,
  CommonDao,
  CommonDaoLogLevel,
  Unsaved,
  unsavedDBEntitySchema,
} from '@naturalcycles/db-lib'
import { objectSchema, stringSchema } from '@naturalcycles/nodejs-lib'
import { defaultDaoCfg } from '@src/releases/dao'

/**
 * id = ReleasesUser.id
 */
export interface ReleasesUserData extends BaseDBEntity {
  /**
   * comma-separated fullRepos
   */
  starredRepos: string
}

export const releasesUserDataUnsavedSchema = objectSchema<Unsaved<ReleasesUserData>>({
  starredRepos: stringSchema.allow(''),
}).concat(unsavedDBEntitySchema)

export const releasesUserDataDao = new CommonDao({
  ...defaultDaoCfg,
  table: 'ReleasesUserData',
  bmUnsavedSchema: releasesUserDataUnsavedSchema,
  dbmUnsavedSchema: releasesUserDataUnsavedSchema,
  logLevel: CommonDaoLogLevel.OPERATIONS,
})
