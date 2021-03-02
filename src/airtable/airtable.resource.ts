import { getDefaultRouter } from '@naturalcycles/backend-lib'
import { DBQuery } from '@naturalcycles/db-lib'
import { _assert } from '@naturalcycles/js-lib'
import { airtableDB } from '@src/airtable/airtable'

const router = getDefaultRouter()
export const airtableResource = router

const TABLES_WHITELIST = new Set(['app6IuewJyIg5GMJ3.Pages'])

router.get('/:table', async (req, res) => {
  const table = req.params['table']!

  _assert(TABLES_WHITELIST.has(table), 'Forbidden')

  const { rows } = await airtableDB.runQuery(DBQuery.create(table))

  res.json({
    rows,
  })
})
