import {
  BaseDBEntity,
  CommonDao,
  createdUpdatedFields,
  Unsaved,
} from '@naturalcycles/db-lib'
import { objectSchema, stringSchema, unixTimestampSchema } from '@naturalcycles/nodejs-lib'
import { defaultDaoCfg } from '@src/releases/dao'

/**
 * id = key
 */
export interface KV extends BaseDBEntity {
  v?: string
}

export enum KV_ID {
  ETAG_MAP = 'ETAG_MAP',
  RELEASES_STATE = 'RELEASES_STATE',
}

export const kvUnsavedSchema = objectSchema<Unsaved<KV>>({
  id: stringSchema.optional(),
  created: unixTimestampSchema.optional(),
  updated: unixTimestampSchema.optional(),
  v: stringSchema.optional(),
})
// .concat(unsavedDBEntitySchema)

class KVDao extends CommonDao<KV> {
  async getJson<T = any> (id: string): Promise<T> {
    const kv = await this.getByIdOrEmpty(id)
    return JSON.parse(kv.v || '{}')
  }

  async saveJson (id: string, v: any = {}): Promise<void> {
    await this.save({
      id,
      v: JSON.stringify(v),
      ...createdUpdatedFields(),
    })
  }
}

export const kvDao = new KVDao({
  ...defaultDaoCfg,
  table: 'KV',
  bmUnsavedSchema: kvUnsavedSchema,
  dbmUnsavedSchema: kvUnsavedSchema,
  idSchema: stringSchema,
})
