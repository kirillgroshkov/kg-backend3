import { getDefaultRouter } from '@naturalcycles/backend-lib'
import { slApiService } from './slApi.service'

const router = getDefaultRouter()
export const slResource = router

router.get('/departures', async (req, res) => {
  res.json(await slApiService.getDepartures('9309'))
})
