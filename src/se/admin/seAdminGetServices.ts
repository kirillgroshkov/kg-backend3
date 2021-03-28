import { seServiceDao } from '@src/se/seService.model'

export async function seAdminGetServices(): Promise<any> {
  const services = await seServiceDao.query().runQuery()

  return {
    services,
  }
}
