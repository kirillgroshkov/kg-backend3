import { BaseDBEntity, CommonDao, Unsaved } from '@naturalcycles/db-lib'
import {
  anyObjectSchema,
  objectSchema,
  stringSchema,
  unixTimestampSchema,
} from '@naturalcycles/nodejs-lib'
import { defaultDaoCfg } from '@src/releases/dao'

export interface Job extends BaseDBEntity {
  type: string
  started: number
  finished?: number
  result?: any
  status: string
}

export const jobUnsavedSchema = objectSchema<Unsaved<Job>>({
  type: stringSchema,
  started: unixTimestampSchema,
  finished: unixTimestampSchema.optional(),
  result: anyObjectSchema.optional(),
  status: stringSchema,
})

class JobDao extends CommonDao<Job> {}

export const jobDao = new JobDao({
  ...defaultDaoCfg,
  table: 'Job',
  bmUnsavedSchema: jobUnsavedSchema,
  dbmUnsavedSchema: jobUnsavedSchema,
})
