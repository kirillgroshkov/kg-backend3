import { stringId } from '@naturalcycles/nodejs-lib'
import { seAccountDao } from '@src/se/seAccount.model'
import { SEFirebaseUser } from '@src/se/seAuth'
import { SEBackendResponseTM } from '@src/se/seBackendResponse.model'
import { seStorageBucket } from '@src/se/seFirebase.service'
import { sentryService } from '@src/srv/sentry.service'
import type { UploadedFile } from 'express-fileupload'

export async function seAvatarUpload(
  user: SEFirebaseUser,
  file: UploadedFile,
): Promise<SEBackendResponseTM> {
  const account = await seAccountDao.requireById(user.uid)

  // Delete previous avatar, if exists
  if (account.avatarId) {
    const oldAvatarPath = `public/${account.id}/${account.avatarId}.jpg`
    await seStorageBucket.deleteFile(oldAvatarPath).catch(err => {
      console.log(`Failed to delete previous avatar at: ${oldAvatarPath}`)
      sentryService.captureException(err)
    })
  }

  account.avatarId = stringId(8)
  const newAvatarPath = `public/${account.id}/${account.avatarId}.jpg`

  await seStorageBucket.savePublicFile(newAvatarPath, file.data)

  await seAccountDao.save(account)

  return {
    state: { account },
  }
}
