import {
  BaseDBEntity,
  baseDBEntitySchema,
  CommonDao,
  createdUpdatedFields,
} from '@naturalcycles/db-lib'
import { objectSchema, stringSchema } from '@naturalcycles/nodejs-lib'
import { defaultDaoCfg } from '@src/srv/db'

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

export const kvSchema = objectSchema<KV>({
  v: stringSchema.optional(),
}).concat(baseDBEntitySchema)

class KVDao extends CommonDao<KV> {
  async getJson<T = any>(id: string): Promise<T> {
    const kv = await this.getByIdOrEmpty(id)
    return JSON.parse(kv.v || '{}')
  }

  async saveJson(id: string, v: any = {}): Promise<void> {
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
  bmSchema: kvSchema,
  dbmSchema: kvSchema,
})
