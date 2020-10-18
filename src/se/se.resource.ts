import { getDefaultRouter } from '@naturalcycles/backend-lib'
import { sePageDao } from '@src/se/sePage.model'
import { seSellerDao } from '@src/se/seSeller.model'

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
