import { _assertEquals } from '@naturalcycles/js-lib'
import { SEFirebaseUser } from '@src/se/seAuth'
import { SEBackendResponseTM } from '@src/se/seBackendResponse.model'
import { seServiceDao } from '@src/se/seService.model'

export async function seServiceDelete(
  user: SEFirebaseUser,
  serviceId: string,
): Promise<SEBackendResponseTM> {
  const service = await seServiceDao.requireById(serviceId)
  _assertEquals(service.accountId, user.uid, 'Forbidden', { httpStatusCode: 403 })

  await seServiceDao.deleteById(serviceId)

  const services = await seServiceDao.getBy('accountId', user.uid)

  return {
    state: {
      services,
    },
  }
}
