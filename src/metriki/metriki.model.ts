import {
  BaseDBEntity,
  baseDBEntitySchema,
  CommonDao,
  CommonDaoLogLevel,
} from '@naturalcycles/db-lib'
import { _split } from '@naturalcycles/js-lib'
import { MongoDB } from '@naturalcycles/mongo-lib'
import {
  anyObjectSchema,
  numberSchema,
  objectSchema,
  secret,
  stringSchema,
  unixTimestampSchema,
} from '@naturalcycles/nodejs-lib'
import { slugSchema } from '@naturalcycles/nodejs-lib/dist/validation/joi/joi.shared.schemas'
import { dayjs } from '@naturalcycles/time-lib'

export type MetrikiAccount = BaseDBEntity

export interface MetrikiApiKey extends BaseDBEntity {
  // id: string // key itself
  accountId: string

  /**
   * @default rw
   */
  permission: MetrikiPermission
}

export type MetrikiPermission = 'r' | 'w' | 'rw'

export interface MetrikiMetric extends BaseDBEntity {
  // id: string // $accountId_$code
  accountId: string
  code: string // url-slug-safe!
  name?: string // human-name, if needed. Default to $code
}

export interface MetrikiRecord extends BaseDBEntity {
  // id: string // $accountId_$code_$ts
  metricId: string // $accountId_$code
  ts: number
  v: number
  meta?: Record<string, any> // anything, for now
}

export const metrikiAccountSchema = objectSchema<MetrikiAccount>({}).concat(baseDBEntitySchema)

export const metrikiPermissionSchema = stringSchema.valid('r', 'w', 'rw')

export const metrikiApiKeySchema = objectSchema<MetrikiApiKey>({
  accountId: stringSchema,
  permission: metrikiPermissionSchema.default('rw'),
}).concat(baseDBEntitySchema)

export const metrikiMetricSchema = objectSchema<MetrikiMetric>({
  accountId: stringSchema,
  code: slugSchema,
  name: stringSchema.optional(),
}).concat(baseDBEntitySchema)

export const metrikiRecordSchema = objectSchema<MetrikiRecord>({
  metricId: stringSchema,
  ts: unixTimestampSchema.min(dayjs('2000-01-01').unix()), // max = now will be enforced
  v: numberSchema,
  meta: anyObjectSchema.optional(),
}).concat(baseDBEntitySchema)

export const metrikiMongoDB = new MongoDB({
  uri: secret('SECRET_MONGO_URI'),
  db: 'metriki',
})

export const defaultMetrikiDaoCfg = {
  db: metrikiMongoDB,
  throwOnDaoCreateObject: true,
  throwOnEntityValidationError: true,
  // logStarted: true,
  logLevel: CommonDaoLogLevel.OPERATIONS,
}

export const metrikiAccountDao = new CommonDao<MetrikiAccount>({
  ...defaultMetrikiDaoCfg,
  table: 'MetrikiAccount',
  bmSchema: metrikiAccountSchema,
  dbmSchema: metrikiAccountSchema,
})

export const metrikiApiKeyDao = new CommonDao<MetrikiApiKey>({
  ...defaultMetrikiDaoCfg,
  table: 'MetrikiApiKey',
  bmSchema: metrikiApiKeySchema,
  dbmSchema: metrikiApiKeySchema,
})

class MetrikiMetricDao extends CommonDao<MetrikiMetric> {}

class MetrikiRecordDao extends CommonDao<MetrikiRecord> {}

export const metrikiMetricDao = new MetrikiMetricDao({
  ...defaultMetrikiDaoCfg,
  table: 'MetrikiMetric',
  bmSchema: metrikiMetricSchema,
  dbmSchema: metrikiMetricSchema,
  hooks: {
    createId: m => [m.accountId, m.code].join('_'),
    parseNaturalId: id => {
      const [accountId, code] = _split(id, '_', 2)
      return {
        accountId,
        code,
      }
    },
  },
})

export const metrikiRecordDao = new MetrikiRecordDao({
  ...defaultMetrikiDaoCfg,
  table: 'MetrikiRecord',
  bmSchema: metrikiRecordSchema,
  dbmSchema: metrikiRecordSchema,
  hooks: {
    createId: r => [r.metricId, r.ts].join('_'),
    parseNaturalId: id => {
      const [accountId, code, ts] = _split(id, '_', 3)
      const metricId = [accountId, code].join('_')
      return {
        metricId,
        ts: Number.parseInt(ts!),
      }
    },
  },
})
