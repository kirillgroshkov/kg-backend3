import { BaseDBEntity, baseDBEntitySchema, CommonDao, SavedDBEntity } from '@naturalcycles/db-lib'
import { _isEmpty } from '@naturalcycles/js-lib'
import {
  arraySchema,
  numberSchema,
  objectSchema,
  stringSchema,
  unixTimestampSchema,
} from '@naturalcycles/nodejs-lib'
import { seFirestoreDB } from '@src/se/se.db'
import { SECategory, SESchedule, SE_CATEGORY_VALUES, SE_SCHEDULE_VALUES } from '@src/se/se.model'
import { SE_REGION_VALUES } from '@src/se/se.regions'
import { Merge } from 'type-fest'

export interface SEServicePatch {
  title?: string
  descr?: string
  regions?: number[]
  category?: SECategory
  schedule?: SESchedule[]
  imageIds?: string[]
}

export interface SEServiceTM extends SEServicePatch {
  id: string
  accountId: string
  updated?: number // ts
  completed?: number // ts
  imageIds: string[]
  regions: number[]
}

export const SE_SERVICE_REQ_FIELDS: (keyof SEServiceTM)[] = [
  'title',
  'descr',
  'category',
  'imageIds',
  'regions',
]

export function isServiceCompleted(service: SEServiceBM): boolean {
  return SE_SERVICE_REQ_FIELDS.every(f => !_isEmpty(service[f]))
}

export interface SEServiceBM extends Merge<SEServiceTM, BaseDBEntity> {}
export interface SEServiceDBM extends Merge<SEServiceTM, SavedDBEntity> {}

export const seServicePatchSchema = objectSchema<SEServicePatch>({
  title: stringSchema.max(100).optional(),
  descr: stringSchema.max(10_000).optional(),
  category: stringSchema.valid(...SE_CATEGORY_VALUES).optional(),
  schedule: arraySchema(numberSchema.valid(...SE_SCHEDULE_VALUES)).optional(),
  imageIds: arraySchema(stringSchema).optional(),
  regions: arraySchema(numberSchema.valid(...SE_REGION_VALUES)).optional(),
}).min(1)

const seServiceSchema = objectSchema<SEServiceBM>({
  accountId: stringSchema,
  completed: unixTimestampSchema.optional(),
  imageIds: arraySchema(stringSchema).optional().default([]),
  regions: arraySchema(numberSchema.valid(...SE_REGION_VALUES))
    .optional()
    .default([]),
})
  .concat(seServicePatchSchema)
  .concat(baseDBEntitySchema)

export const seServiceDao = new CommonDao<SEServiceBM, SEServiceDBM, SEServiceTM>({
  db: seFirestoreDB,
  table: 'Service',
  dbmSchema: seServiceSchema,
  bmSchema: seServiceSchema,
})
