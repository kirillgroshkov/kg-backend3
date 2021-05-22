import { AirtableAttachment, AirtableDB } from '@naturalcycles/airtable-lib'
import { CommonDao } from '@naturalcycles/db-lib'
import { secret } from '@naturalcycles/nodejs-lib'

export const airtableDB = new AirtableDB({
  apiKey: secret('SECRET_AIRTABLE_KEY'),
})

export const airtableDao = new CommonDao({
  table: 'should_be_set',
  db: airtableDB,
  createdUpdated: false,
  readOnly: true, // safety, for now
})

export const airtableImagesMapper = (v: AirtableAttachment[] | undefined): string[] =>
  (v || []).map(r => r.url)
