import { getDefaultRouter, reqValidation } from '@naturalcycles/backend-lib'
import { filterUndefinedValues, StringMap } from '@naturalcycles/js-lib'
import {
  anyObjectSchema,
  numberSchema,
  objectSchema,
  stringSchema,
  unixTimestampSchema,
} from '@naturalcycles/nodejs-lib'
import { slugSchema } from '@naturalcycles/nodejs-lib/dist/validation/joi/joi.shared.schemas'
import { dayjs } from '@naturalcycles/time-lib'
import { metrikiMetricDao, metrikiRecordDao } from '@src/metriki/metriki.model'
import { metrikiService } from '@src/metriki/metriki.service'

const router = getDefaultRouter()
export const metrikiResource = router

router.get('/', async (req, res) => {
  res.json('hello')
})

interface MetrikiParams {
  accountId: string
  metricCode: string
  metricValue: number
}
const metrikiParamsSchema = objectSchema<MetrikiParams>({
  accountId: stringSchema,
  metricCode: slugSchema,
  metricValue: numberSchema, // will convert to number
})

interface MetrikiBody {
  meta?: object
}
const metrikiBodySchema = objectSchema<MetrikiBody>({
  meta: anyObjectSchema.optional(),
})

interface MetrikiQuery {
  ts?: number
}
const metrikiQuerySchema = objectSchema<MetrikiQuery>({
  ts: unixTimestampSchema.optional(),
})

router.put(
  '/:accountId/metrics/:metricCode/:metricValue',
  reqValidation('params', metrikiParamsSchema),
  reqValidation('query', metrikiQuerySchema),
  reqValidation('body', metrikiBodySchema),
  async (req, res) => {
    const { accountId, metricCode, metricValue } = (req.params as any) as MetrikiParams
    await metrikiService.auth(req.header('authorization'), accountId, 'w')

    const now = dayjs()
    const { ts = now.unix() } = req.query as MetrikiQuery
    const { meta } = req.body as MetrikiBody
    const metricId = [accountId, metricCode].join('_')

    await metrikiRecordDao.save(
      filterUndefinedValues({
        metricId,
        ts,
        v: metricValue,
        meta,
      }),
    )

    // We can add some caching later
    const metric = await metrikiMetricDao.getById(metricId)
    if (!metric || now.diff(dayjs.unix(metric.updated), 'minute') >= 30) {
      await metrikiMetricDao.save({
        ...metric,
        accountId,
        code: metricCode,
      })
    }

    res.end() // 200
  },
)

router.get('/:accountId/metrics', async (req, res) => {
  const { accountId } = req.params
  await metrikiService.auth(req.header('authorization'), accountId, 'r')

  const metrics = await metrikiMetricDao
    .query()
    .filterEq('accountId', accountId)
    .select(['updated', 'name'])
    .runQuery()

  res.json({
    metrics,
  })
})

// todo: minTsIncl, maxTsExcl
interface RecordsQuery {
  minTsIncl?: number
  maxTsExcl?: number
}
const recordsQuerySchema = objectSchema<RecordsQuery>({
  minTsIncl: unixTimestampSchema.optional(),
  maxTsExcl: unixTimestampSchema.optional(),
})

const MAX_UNIX_TS = dayjs('2050-01-01').unix()

router.get(
  '/:accountId/metrics/:metricCode',
  reqValidation('query', recordsQuerySchema),
  async (req, res) => {
    const { accountId, metricCode } = req.params
    await metrikiService.auth(req.header('authorization'), accountId, 'r')

    const {
      minTsIncl = 0, // since 1970
      maxTsExcl = MAX_UNIX_TS, // end of time:)
    } = req.query as RecordsQuery

    const metricId = [accountId, metricCode].join('_')

    const records = await metrikiRecordDao
      .query()
      .filterEq('metricId', metricId)
      .filter('ts', '>=', minTsIncl)
      .filter('ts', '<', maxTsExcl)
      .order('ts')
      .select(['v', 'ts']) // not even meta (in this version)
      .runQuery()

    const recordsMap: StringMap<number> = {}
    records.forEach(r => {
      recordsMap[r.ts] = r.v
    })

    res.json({
      recordsMap,
    })
  },
)

router.delete('/:accountId/metrics/:metricCode/:ts?', async (req, res) => {
  const { accountId, metricCode, ts } = req.params
  await metrikiService.auth(req.header('authorization'), accountId, 'w')

  if (ts) {
    // delete one record

    const recordId = [accountId, metricCode, ts].join('_')

    const deleted = await metrikiRecordDao.deleteById(recordId)

    res.json({ deleted })
  } else {
    // delete ALL records!

    const metricId = [accountId, metricCode].join('_')

    const deleted = await metrikiRecordDao.query().filterEq('metricId', metricId).deleteByQuery()

    await metrikiMetricDao.deleteById(metricId)

    res.json({ deleted })
  }
})
