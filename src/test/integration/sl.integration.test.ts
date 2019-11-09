import { slApiService } from '@src/sl/slApi.service'

test('sl departures', async () => {
  const r = await slApiService.getDepartures('9309')
  console.log(r)
})
