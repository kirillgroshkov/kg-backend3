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
  starredRepos: stringSchema
    .allow('')
    .default('')
    .optional(),
}).concat(unsavedDBEntitySchema)

class ReleasesUserDataDao extends CommonDao<ReleasesUserData> {
  // beforeCreate (bm: Unsaved<ReleasesUserData>): Unsaved<ReleasesUserData> {
  //   return {
  //     ...bm,
  //     starredRepos: '',
  //   }
  // }
}

export const releasesUserDataDao = new ReleasesUserDataDao({
  ...defaultDaoCfg,
  table: 'ReleasesUserData',
  bmUnsavedSchema: releasesUserDataUnsavedSchema,
  dbmUnsavedSchema: releasesUserDataUnsavedSchema,
  logLevel: CommonDaoLogLevel.OPERATIONS,
})
