import { seAccountDao } from '@src/se/seAccount.model'

export async function seAdminGetUsers(): Promise<any> {
// user: SEFirebaseUser,
  const users = await seAccountDao.query().runQueryAsTM()

  return {
    users,
  }
}
