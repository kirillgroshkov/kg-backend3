import { _isEmpty } from '@naturalcycles/js-lib'
import { dayjs } from '@naturalcycles/time-lib'
import { seAccountDao, SEAccountPatch, SE_ACCOUNT_REQ_FIELDS } from '@src/se/seAccount.model'
import { SEFirebaseUser } from '@src/se/seAuth'
import { SEBackendResponseTM } from '@src/se/seBackendResponse.model'
import { seSlack } from '@src/se/seSlack'

export async function seAccountPut(
  user: SEFirebaseUser,
  input: SEAccountPatch,
): Promise<SEBackendResponseTM> {
  const account = await seAccountDao.requireById(user.uid)

  Object.assign(account, input)

  const shouldBeCompleted = SE_ACCOUNT_REQ_FIELDS.every(f => !_isEmpty(account[f]))

  // Check for completion
  if (!account.completed && shouldBeCompleted) {
    account.completed = dayjs().unix()

    void seSlack.log(`Account profile completed: ${user.phoneNumber}`, input)
  } else if (account.completed && !shouldBeCompleted) {
    delete account.completed

    void seSlack.log(`Account profile un-completed: ${user.phoneNumber}`, input)
  } else {
    void seSlack.log(`Account profile save: ${user.phoneNumber}`, input)
  }

  await seAccountDao.save(account)

  return {
    state: { account },
  }
}
