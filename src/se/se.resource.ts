import { getDefaultRouter, reqValidation } from '@naturalcycles/backend-lib'
import { _assert } from '@naturalcycles/js-lib'
import { seAccountPut } from '@src/se/handlers/seAccountPut'
import { seAvatarUpload } from '@src/se/handlers/seAvatarUpload'
import { seInit } from '@src/se/handlers/seInit'
import { seServiceDelete } from '@src/se/handlers/seServiceDelete'
import { seServicePut } from '@src/se/handlers/seServicePut'
import { seAccountPatchSchema } from '@src/se/seAccount.model'
import { seRequireUser } from '@src/se/seAuth'
import { sePageDao } from '@src/se/sePage.model'
import { seSellerDao } from '@src/se/seSeller.model'
import { seServicePatchSchema } from '@src/se/seService.model'
import { fileUploadHandler } from '@src/server/upload.util'

const router = getDefaultRouter()
export const seResource = router

router.get('/cms/pages/:pageId?', async (req, res) => {
  const { pageId } = req.params

  if (pageId) {
    res.json({ data: await sePageDao.getById(pageId) })
  } else {
    res.json({ data: await sePageDao.query().runQuery() })
  }
})

router.get('/cms/sellers/:sellerId?', async (req, res) => {
  const { sellerId } = req.params

  if (sellerId) {
    res.json({ data: await seSellerDao.getByIdAsTM(sellerId) })
  } else {
    res.json({ data: await seSellerDao.query().runQueryAsTM() })
  }
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
  _assert(req.files?.file)

  res.json(await seAvatarUpload(user, req.files.file))
})

router.put(`/services/:id?`, reqValidation('body', seServicePatchSchema), async (req, res) => {
  const user = await seRequireUser(req)

  res.json(await seServicePut(user, req.body, req.params.id))
})

router.delete(`/services/:id`, async (req, res) => {
  const user = await seRequireUser(req)
  res.json(await seServiceDelete(user, req.params.id))
})
