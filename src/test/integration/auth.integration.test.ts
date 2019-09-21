import { pDelay } from '@naturalcycles/js-lib'
import { authUser } from '@src/releases/handlers/releasesAuthHandler'
import { etagDao } from '@src/releases/model/etag.model'
import { releasesUserDao } from '@src/releases/model/releasesUser.model'
import { firebaseService } from '@src/srv/firebase.service'

const { GITHUB_TOKEN } = process.env

const uid = 'xlmyalsayaftqgcz'

test('cleanup', async () => {
  await cleanup()
})

test('auth kirill', async () => {
  jest.spyOn(firebaseService, 'verifyIdToken').mockResolvedValue({
    uid,
  } as any)

  jest.spyOn(firebaseService, 'requireUser').mockResolvedValue({
    email: 'ceo@inventix.ru',
    displayName: 'Kirill Groshkov',
  } as any)

  await cleanup()

  const r = await authUser({
    idToken: 'abcd',
    accessToken: GITHUB_TOKEN!,
    username: 'kirillgroshkov',
  })

  console.log(r)

  await pDelay(600000)
}, 999999)

async function cleanup() {
  // delete all etags
  await etagDao.query().deleteByQuery()

  // delete user
  await releasesUserDao.deleteById(uid)
}
