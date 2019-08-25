import { BaseDBEntity, CommonDao, Unsaved } from '@naturalcycles/db-lib'
import { objectSchema, stringSchema, unixTimestampSchema } from '@naturalcycles/nodejs-lib'
import { defaultDaoCfg } from '@src/releases/dao'
import { mongoMemoryCachedDB } from '@src/srv/db'

export interface Etag extends BaseDBEntity {
  etag: string
}

export const etagUnsavedSchema = objectSchema<Unsaved<Etag>>({
  id: stringSchema.lowercase().optional(),
  updated: unixTimestampSchema.optional(),
  created: unixTimestampSchema.optional(),
  etag: stringSchema,
})

export const etagDao = new CommonDao<Etag>({
  ...defaultDaoCfg,
  db: mongoMemoryCachedDB,
  table: 'Etag',
  bmUnsavedSchema: etagUnsavedSchema,
  dbmUnsavedSchema: etagUnsavedSchema,
  idSchema: stringSchema.lowercase(),
})
