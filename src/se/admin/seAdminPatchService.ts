import { SEFirebaseUser } from '@src/se/seAuth'
import { SEBackendResponseTM } from '@src/se/seBackendResponse.model'
import { SEServiceBM, seServiceDao } from '@src/se/seService.model'

export async function seAdminPatchService(
  adminUser: SEFirebaseUser,
  serviceId: string,
  input: SEServiceBM,
): Promise<SEBackendResponseTM> {
  const service = await seServiceDao.requireById(serviceId)

  Object.assign(service, input)

  await seServiceDao.save(service)

  if (adminUser.uid !== service.accountId) {
    return {}
  }

  return {
    changedServices: {
      [serviceId]: service,
    },
  }
}
