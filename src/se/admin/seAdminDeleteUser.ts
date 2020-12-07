import { seAccountDao } from '@src/se/seAccount.model'
import { SEFirebaseUser } from '@src/se/seAuth'
import { seFirebaseService, seStorageBucket } from '@src/se/seFirebase.service'
import { seServiceDao } from '@src/se/seService.model'
import { seSlack } from '@src/se/seSlack'

export async function seAdminDeleteUser(user: SEFirebaseUser, id: string): Promise<void> {
  const acc = await seAccountDao.requireById(id)

  // Delete Storage folder
  await seStorageBucket.deleteFolder(`public/${id}`)

  // Delete Firebase user by phone number
  await seFirebaseService
    .auth()
    .deleteUser(id)
    .catch(err => {
      console.error(err) // log and proceed
    })

  // Delete services
  await seServiceDao.query().filterEq('accountId', id).deleteByQuery()

  // Delete Account
  await seAccountDao.deleteById(id)

  void seSlack.log(`Account ${id} ${acc.phoneNumber} deleted by ${user.uid}`)
}
