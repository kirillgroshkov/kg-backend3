import { BaseDBEntity, baseDBEntitySchema, CommonDao, SavedDBEntity } from '@naturalcycles/db-lib'
import {
  arraySchema,
  numberSchema,
  objectSchema,
  stringSchema,
  unixTimestampSchema,
} from '@naturalcycles/nodejs-lib'
import { seFirestoreDB } from '@src/se/se.db'
import { SECategory, SESchedule, SE_CATEGORY_VALUES, SE_SCHEDULE_VALUES } from '@src/se/se.model'
import { Merge } from 'type-fest'

export interface SEServicePatch {
  title?: string
  descr?: string
  regions?: string
  category?: SECategory
  schedule?: SESchedule[]
}

export interface SEServiceTM extends SEServicePatch {
  id: string
  accountId: string
  updated?: number // ts
  completed?: number // ts
  photoIds?: string[]
}

export const SE_SERVICE_REQ_FIELDS: (keyof SEServiceTM)[] = [
  'title',
  'descr',
  'category',
  'photoIds',
]

export interface SEServiceBM extends Merge<SEServiceTM, BaseDBEntity> {}
export interface SEServiceDBM extends Merge<SEServiceTM, SavedDBEntity> {}

export const seServicePatchSchema = objectSchema<SEServicePatch>({
  title: stringSchema.max(100).optional(),
  descr: stringSchema.max(10_000).optional(),
  regions: stringSchema.max(200).optional(),
  category: stringSchema.valid(...SE_CATEGORY_VALUES).optional(),
  schedule: arraySchema(numberSchema.valid(...SE_SCHEDULE_VALUES)).optional(),
})

const seServiceSchema = objectSchema<SEServiceBM>({
  accountId: stringSchema,
  completed: unixTimestampSchema.optional(),
  photoIds: arraySchema(stringSchema).optional(),
})
  .concat(seServicePatchSchema)
  .concat(baseDBEntitySchema)

export const seServiceDao = new CommonDao<SEServiceBM, SEServiceDBM, SEServiceTM>({
  db: seFirestoreDB,
  table: 'Service',
  dbmSchema: seServiceSchema,
  bmSchema: seServiceSchema,
})
