import { BaseDBEntity, baseDBEntitySchema, CommonDao } from '@naturalcycles/db-lib'
import { objectSchema, stringSchema } from '@naturalcycles/nodejs-lib'
import { defaultDaoCfg } from '@src/releases/dao'
import { mongoMemoryCachedDB } from '@src/srv/db'

export interface Etag extends BaseDBEntity {
  etag: string
}

export const etagSchema = objectSchema<Etag>({
  id: stringSchema.lowercase().optional(),
  etag: stringSchema,
}).concat(baseDBEntitySchema)

export const etagDao = new CommonDao<Etag>({
  ...defaultDaoCfg,
  db: mongoMemoryCachedDB,
  table: 'Etag',
  bmSchema: etagSchema,
  dbmSchema: etagSchema,
})
