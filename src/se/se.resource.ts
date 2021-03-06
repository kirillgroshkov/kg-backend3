import { getDefaultRouter, reqValidation } from '@naturalcycles/backend-lib'
import { _assert } from '@naturalcycles/js-lib'
import { seAdminCreateUser, seAdminCreateUserInput } from '@src/se/admin/seAdminCreateUser'
import { seAdminDeleteService } from '@src/se/admin/seAdminDeleteService'
import { seAdminDeleteUser } from '@src/se/admin/seAdminDeleteUser'
import { seAdminGetServices } from '@src/se/admin/seAdminGetServices'
import { seAdminGetUsers } from '@src/se/admin/seAdminGetUsers'
import { seAdminPatchService } from '@src/se/admin/seAdminPatchService'
import { seAdminPatchUser } from '@src/se/admin/seAdminPatchUser'
import { seAccountPut } from '@src/se/handlers/seAccountPut'
import { seAvatarUpload } from '@src/se/handlers/seAvatarUpload'
import { seCMSData } from '@src/se/handlers/seCMSData'
import { seInit } from '@src/se/handlers/seInit'
import { seRequestCreate } from '@src/se/handlers/seRequestCreate'
import { seServiceAddImage } from '@src/se/handlers/seServiceAddImage'
import { seServiceDelete } from '@src/se/handlers/seServiceDelete'
import { seServiceDeleteImage } from '@src/se/handlers/seServiceDeleteImage'
import { seServicePut } from '@src/se/handlers/seServicePut'
import { seAccountPatchSchema } from '@src/se/seAccount.model'
import { seRequireAdmin, seRequireUser } from '@src/se/seAuth'
import { sePageDao } from '@src/se/sePage.model'
import { seRequestInputSchema } from '@src/se/seRequest.model'
import { seServicePatchSchema } from '@src/se/seService.model'
import { fileUploadHandler } from '@src/server/upload.util'
import { UploadedFile } from 'express-fileupload'

const router = getDefaultRouter()
export const seResource = router

router.get('/cms/pages/:pageId?', async (req, res) => {
  const { pageId } = req.params as { pageId?: string }

  if (pageId) {
    res.json({ data: await sePageDao.getById(pageId) })
  } else {
    res.json({ data: await sePageDao.query().runQuery() })
  }
})

// router.get('/cms/accounts/:accountId', async (req, res) => {
//   const { accountId } = req.params
//
//   // todo: TM to have fields shaded
//   res.json(await seAccountDao.getByIdAsTM(accountId))
// })

router.get('/cms/data', async (req, res) => {
  res.json(await seCMSData())
})

router.get('/init', async (req, res) => {
  const user = await seRequireUser(req)
  res.json(await seInit(user))
})

router.put('/accounts', reqValidation('body', seAccountPatchSchema), async (req, res) => {
  const user = await seRequireUser(req)
  res.json(await seAccountPut(user, req.body))
})

router.put('/accounts/avatar', fileUploadHandler, async (req, res) => {
  const user = await seRequireUser(req)
  _assert(req.files?.['file']) // todo: reqValidationFile('file')

  res.json(await seAvatarUpload(user, req.files['file'] as UploadedFile))
})

router.put(`/services/:id?`, reqValidation('body', seServicePatchSchema), async (req, res) => {
  const user = await seRequireUser(req)

  res.json(await seServicePut(user, req.body, req.params['id']))
})

router.delete(`/services/:id`, async (req, res) => {
  const user = await seRequireUser(req)
  res.json(await seServiceDelete(user, req.params['id']!))
})

router.post(`/services/:id/images`, fileUploadHandler, async (req, res) => {
  const user = await seRequireUser(req)
  _assert(req.files?.['file']) // todo: reqValidationFile('file')

  res.json(await seServiceAddImage(user, req.files['file'] as UploadedFile, req.params['id']!))
})

router.delete(`/services/:serviceId/images/:imageId`, async (req, res) => {
  const user = await seRequireUser(req)

  res.json(await seServiceDeleteImage(user, req.params['serviceId']!, req.params['imageId']!))
})

router.post(`/requests`, reqValidation('body', seRequestInputSchema), async (req, res) => {
  await seRequestCreate(req.body)
  res.json({}) // ok
})

router.get('/admin/services', async (req, res) => {
  await seRequireAdmin(req)
  res.json(await seAdminGetServices())
})

router.delete('/admin/services/:id', async (req, res) => {
  await seRequireAdmin(req)
  await seAdminDeleteService(req.params['id']!)
  res.json({})
})

router.get('/admin/users', async (req, res) => {
  await seRequireAdmin(req)
  res.json(await seAdminGetUsers())
})

router.post('/admin/users', reqValidation('body', seAdminCreateUserInput), async (req, res) => {
  const user = await seRequireAdmin(req)
  await seAdminCreateUser(user, req.body)
  res.json({})
})

router.delete('/admin/users/:id', async (req, res) => {
  const user = await seRequireAdmin(req)
  await seAdminDeleteUser(user, req.params['id']!)
  res.json({})
})

router.patch('/admin/users/:id', async (req, res) => {
  const user = await seRequireAdmin(req)
  res.json(await seAdminPatchUser(user, req.params['id']!, req.body))
})

router.patch('/admin/services/:id', async (req, res) => {
  const user = await seRequireAdmin(req)
  res.json(await seAdminPatchService(user, req.params['id']!, req.body))
})
