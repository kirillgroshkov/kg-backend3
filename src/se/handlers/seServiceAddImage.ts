import { _assertEquals } from '@naturalcycles/js-lib'
import { stringId } from '@naturalcycles/nodejs-lib'
import { SEFirebaseUser } from '@src/se/seAuth'
import { SEBackendResponseTM } from '@src/se/seBackendResponse.model'
import { seStorageBucket } from '@src/se/seFirebase.service'
import { seServiceDao } from '@src/se/seService.model'
import { UploadedFile } from 'express-fileupload'

export async function seServiceAddImage(
  user: SEFirebaseUser,
  file: UploadedFile,
  serviceId: string,
): Promise<SEBackendResponseTM> {
  const service = await seServiceDao.requireById(serviceId)
  _assertEquals(service.accountId, user.uid, 'Forbidden', { httpStatusCode: 403 })

  const imageId = stringId(8)
  const filePath = `public/${user.uid}/services/${serviceId}/${imageId}.jpg`
  // const fileUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`

  await seStorageBucket.savePublicFile(filePath, file.data)

  service.imageIds = [...service.imageIds, imageId]

  await seServiceDao.save(service)

  return {
    changedServices: {
      [service.id]: service,
    },
  }
}
