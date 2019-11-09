import { memo } from '@naturalcycles/js-lib'
import { LRUMemoCache, secret } from '@naturalcycles/nodejs-lib'
import { dayjs } from '@naturalcycles/time-lib'
import * as got from 'got'

const key = secret('SECRET_SL_REALTIME_API_KEY')

class SLApiService {
  @memo({
    cacheFactory: () => new LRUMemoCache({ maxAge: 15000 }),
  })
  async getDepartures(siteId: string, timeWindow = 30): Promise<any> {
    const url = `https://api.sl.se/api2/realtimedeparturesV4.json`

    const { body } = await got(url, {
      json: true,
      query: {
        key,
        siteId,
        timeWindow,
        Bus: false,
        Train: false,
        Tram: false,
        Ship: false,
      },
    })

    return {
      fetchedAt: dayjs().toPretty(),
      ...body,
    }
  }
}

export const slApiService = new SLApiService()
