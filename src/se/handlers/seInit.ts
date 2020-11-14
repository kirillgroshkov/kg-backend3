import { seAccountDao } from '@src/se/seAccount.model'
import { SEFirebaseUser } from '@src/se/seAuth'
import { SEBackendResponseTM } from '@src/se/seBackendResponse.model'
import { seServiceDao } from '@src/se/seService.model'
import { seSlack } from '@src/se/seSlack'

export async function seInit(user: SEFirebaseUser): Promise<SEBackendResponseTM> {
  let account = await seAccountDao.getById(user.uid)

  if (!account) {
    // Account not found, which means we're going to register the Account now!
    account = await seAccountDao.save({
      id: user.uid,
      phoneNumber: user.phoneNumber,
      languages: [],
    })

    void seSlack.send(`Account registration: ${user.phoneNumber} ${user.uid}`)
  }

  const services = await seServiceDao.query().filterEq('accountId', account.id).runQuery()

  return {
    state: {
      account,
      services,
    },
  }
}
