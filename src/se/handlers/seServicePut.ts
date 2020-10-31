import { _assertEquals } from '@naturalcycles/js-lib'
import { dayjs } from '@naturalcycles/time-lib'
import { SEFirebaseUser } from '@src/se/seAuth'
import { SEBackendResponseTM } from '@src/se/seBackendResponse.model'
import {
  SEServiceBM,
  seServiceDao,
  SEServicePatch,
  SE_SERVICE_REQ_FIELDS,
} from '@src/se/seService.model'

export async function seServicePut(
  user: SEFirebaseUser,
  patch: SEServicePatch,
  id?: string,
): Promise<SEBackendResponseTM> {
  let service = {} as SEServiceBM

  if (id) {
    service = await seServiceDao.requireById(id)
    _assertEquals(service.accountId, user.uid, 'Forbidden', { httpStatusCode: 403 })
  }

  Object.assign(service, patch, {
    accountId: user.uid,
  })

  // Completeness check
  const shouldBeCompleted = SE_SERVICE_REQ_FIELDS.every(f => service[f]) && service.photoIds?.length

  if (!service.completed && shouldBeCompleted) {
    service.completed = dayjs().unix()
  } else if (service.completed && !shouldBeCompleted) {
    delete service.completed
  }

  await seServiceDao.save(service)

  // return all services
  // Because of strong consistency guarantees - we expect the just-saved Service to be included in the results
  const services = await seServiceDao.getBy('accountId', user.uid)

  return {
    state: {
      services,
    },
    createdObjectId: id ? undefined : service.id,
  }
}
