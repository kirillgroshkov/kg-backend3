import { _assertEquals } from '@naturalcycles/js-lib'
import { SEFirebaseUser } from '@src/se/seAuth'
import { SEBackendResponseTM } from '@src/se/seBackendResponse.model'
import { seStorageBucket } from '@src/se/seFirebase.service'
import { seServiceDao } from '@src/se/seService.model'
import { sentryService } from '@src/srv/sentry.service'

export async function seServiceDeleteImage(
  user: SEFirebaseUser,
  serviceId: string,
  imageId: string,
): Promise<SEBackendResponseTM> {
  const service = await seServiceDao.requireById(serviceId)
  _assertEquals(service.accountId, user.uid, 'Forbidden', { httpStatusCode: 403 })

  const filePath = `public/${user.uid}/services/${serviceId}/${imageId}.jpg`

  await seStorageBucket.deleteFile(filePath).catch(err => {
    console.log(`Failed to delete previous image at: ${filePath}`)
    sentryService.captureException(err)
  })

  service.imageIds = service.imageIds.filter(id => id !== imageId)

  await seServiceDao.save(service)

  return {
    changedServices: {
      [service.id]: service,
    },
  }
}
