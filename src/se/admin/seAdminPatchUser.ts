import { seAccountDao, SEAccountPatch } from '@src/se/seAccount.model'
import { SEFirebaseUser } from '@src/se/seAuth'
import { SEBackendResponseTM } from '@src/se/seBackendResponse.model'

export async function seAdminPatchUser(
  user: SEFirebaseUser,
  accountId: string,
  input: SEAccountPatch,
): Promise<SEBackendResponseTM> {
  const account = await seAccountDao.requireById(user.uid)

  Object.assign(account, input)

  await seAccountDao.save(account)

  return {
    state: { account },
  }
}
