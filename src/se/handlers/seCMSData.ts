import { pProps } from '@naturalcycles/js-lib'
import { seAccountDao } from '@src/se/seAccount.model'
import { seServiceDao } from '@src/se/seService.model'

export async function seCMSData(): Promise<any> {
  const { accounts, services } = await pProps({
    accounts: seAccountDao.query().runQueryAsTM(),
    services: seServiceDao.query().runQueryAsTM(),
  })

  return {
    accounts,
    services,
  }
}
