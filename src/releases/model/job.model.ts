import { BaseDBEntity, baseDBEntitySchema, CommonDao } from '@naturalcycles/db-lib'
import {
  anyObjectSchema,
  objectSchema,
  stringSchema,
  unixTimestampSchema,
} from '@naturalcycles/nodejs-lib'
import { defaultDaoCfg } from '@src/srv/db'

export interface Job extends BaseDBEntity {
  type: string
  started: number
  finished?: number
  result?: any
  status: string
}

export const jobSchema = objectSchema<Job>({
  type: stringSchema,
  started: unixTimestampSchema,
  finished: unixTimestampSchema.optional(),
  result: anyObjectSchema.optional(),
  status: stringSchema,
}).concat(baseDBEntitySchema)

class JobDao extends CommonDao<Job> {}

export const jobDao = new JobDao({
  ...defaultDaoCfg,
  table: 'Job',
  bmSchema: jobSchema,
  dbmSchema: jobSchema,
})
