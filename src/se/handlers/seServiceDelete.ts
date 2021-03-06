import { _assertEquals } from '@naturalcycles/js-lib'
import { SEFirebaseUser } from '@src/se/seAuth'
import { SEBackendResponseTM } from '@src/se/seBackendResponse.model'
import { seStorageBucket } from '@src/se/seFirebase.service'
import { seServiceDao } from '@src/se/seService.model'
import { sentryService } from '@src/srv/sentry.service'

export async function seServiceDelete(
  user: SEFirebaseUser,
  serviceId: string,
): Promise<SEBackendResponseTM> {
  const service = await seServiceDao.requireById(serviceId)
  _assertEquals(service.accountId, user.uid, 'Forbidden', { httpStatusCode: 403 })

  // Delete images folder
  const filePath = `public/${user.uid}/services/${serviceId}`

  await seStorageBucket.deleteFolder(filePath).catch(err => {
    console.log(`Failed to delete service images folder at: ${filePath}`)
    sentryService.captureException(err)
  })

  await seServiceDao.deleteById(serviceId)

  return {
    changedServices: {
      [serviceId]: null,
    },
  }
}
