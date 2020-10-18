import { CommonDao } from '@naturalcycles/db-lib'
import { booleanSchema, objectSchema, stringSchema } from '@naturalcycles/nodejs-lib'
import { airtableDB } from '@src/airtable/airtable'
import { markdownMapper } from '@src/srv/markdown'

export interface SEPage {
  id: string
  pub?: boolean
  content_ru?: string // html
}

const sePageSchema = objectSchema<SEPage>({
  id: stringSchema,
  pub: booleanSchema.optional(),
  content_ru: stringSchema.optional(),
})

export const sePageDao = new CommonDao<SEPage>({
  table: 'app6IuewJyIg5GMJ3.Pages',
  db: airtableDB,
  createdUpdated: false,
  dbmSchema: sePageSchema,
  bmSchema: sePageSchema,
  hooks: {
    beforeDBMToBM: dbm => {
      return {
        ...dbm,
        content_ru: markdownMapper(dbm.content_ru),
      }
    },
  },
})
