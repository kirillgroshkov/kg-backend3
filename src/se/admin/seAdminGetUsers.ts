import { seAccountDao } from '@src/se/seAccount.model'

export async function seAdminGetUsers(): Promise<any> {
  const users = await seAccountDao.query().runQuery()

  return {
    users,
  }
}
