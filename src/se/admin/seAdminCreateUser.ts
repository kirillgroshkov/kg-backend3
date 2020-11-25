import { _assert } from '@naturalcycles/js-lib'
import { objectSchema } from '@naturalcycles/nodejs-lib'
import { mobilePhoneNumberSchema, seAccountDao } from '@src/se/seAccount.model'
import { SEFirebaseUser } from '@src/se/seAuth'
import { seFirebaseService } from '@src/se/seFirebase.service'
import { seSlack } from '@src/se/seSlack'

export interface SEAdminCreateUserInput {
  phoneNumber: string
}

export const seAdminCreateUserInput = objectSchema<SEAdminCreateUserInput>({
  phoneNumber: mobilePhoneNumberSchema,
})

export async function seAdminCreateUser(
  user: SEFirebaseUser,
  input: SEAdminCreateUserInput,
): Promise<void> {
  const { phoneNumber } = input

  // Check for existing account with same phoneNumber
  const [existingAccount] = await seAccountDao
    .query()
    .filterEq('phoneNumber', phoneNumber)
    .runQuery()

  _assert(!existingAccount, `${phoneNumber} Account exists`, {
    httpStatusCode: 409,
  })

  const { uid } = await seFirebaseService.auth().createUser({
    phoneNumber,
  })

  await seAccountDao.save({
    id: uid,
    phoneNumber,
    languages: [],
  })

  void seSlack.log(`Account ${uid} created for ${phoneNumber} by ${user.uid}`)
}
