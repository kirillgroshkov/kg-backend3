import { stringId } from '@naturalcycles/nodejs-lib'
import { seAccountDao } from '@src/se/seAccount.model'
import { SEFirebaseUser } from '@src/se/seAuth'
import { SEBackendResponseTM } from '@src/se/seBackendResponse.model'
import { seFirebaseService } from '@src/se/seFirebase.service'
import { sentryService } from '@src/srv/sentry.service'
import type { UploadedFile } from 'express-fileupload'

const bucket = seFirebaseService.admin().storage().bucket()

export async function seAvatarUpload(
  user: SEFirebaseUser,
  file: UploadedFile,
): Promise<SEBackendResponseTM> {
  const account = await seAccountDao.requireById(user.uid)

  // Delete previous avatar, if exists
  if (account.avatarId) {
    const avatarPath = `public/${account.id}/${account.avatarId}.jpg`
    await bucket
      .file(avatarPath)
      .delete()
      .catch(err => {
        console.log(`Failed to delete previous avatar at: ${avatarPath}`)
        sentryService.captureException(err)
      })
  }

  const avatarId = stringId(8)
  const filePath = `public/${user.uid}/${avatarId}.jpg`
  // const fileUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`

  await bucket.file(filePath).save(file.data)
  await bucket.file(filePath).makePublic()

  account.avatarId = avatarId
  await seAccountDao.save(account)

  return {
    state: { account },
  }
}
