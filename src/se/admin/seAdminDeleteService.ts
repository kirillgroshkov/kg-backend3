import { seStorageBucket } from '@src/se/seFirebase.service'
import { seServiceDao } from '@src/se/seService.model'
import { sentryService } from '@src/srv/sentry.service'

export async function seAdminDeleteService(id: string): Promise<void> {
  const service = await seServiceDao.requireById(id)

  // Delete images folder
  const filePath = `public/${service.accountId}/services/${id}`

  await seStorageBucket.deleteFolder(filePath).catch(err => {
    console.log(`Failed to delete service images folder at: ${filePath}`)
    sentryService.captureException(err)
  })

  await seServiceDao.deleteById(id)
}
