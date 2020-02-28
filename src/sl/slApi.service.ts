import { memo } from '@naturalcycles/js-lib'
import { LRUMemoCache, secret } from '@naturalcycles/nodejs-lib'
import { dayjs } from '@naturalcycles/time-lib'
import got from 'got'

const key = secret('SECRET_SL_REALTIME_API_KEY')
const url = `https://api.sl.se/api2/realtimedeparturesV4.json`

class SLApiService {
  @memo({
    cacheFactory: () => new LRUMemoCache({ maxAge: 15000 }),
  })
  async getDepartures(siteId: string, timeWindow = 30): Promise<any> {
    const body = await got(url, {
      responseType: 'json',
      searchParams: {
        key,
        siteId,
        timeWindow,
        Bus: false,
        Train: false,
        Tram: false,
        Ship: false,
      },
    }).json<any>()

    return {
      fetchedAt: dayjs().toPretty(),
      ...body,
    }
  }
}

export const slApiService = new SLApiService()
