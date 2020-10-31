import { AirtableAttachment } from '@naturalcycles/airtable-lib'
import { CommonDao, SavedDBEntity } from '@naturalcycles/db-lib'
import {
  arraySchema,
  booleanSchema,
  emailSchema,
  integerSchema,
  numberSchema,
  objectSchema,
  stringSchema,
  urlSchema,
} from '@naturalcycles/nodejs-lib'
import { airtableDB, airtableImagesMapper } from '@src/airtable/airtable'
import { SECategory } from '@src/se/se.model'
import { markdownMapper } from '@src/srv/markdown'
import { Merge } from 'type-fest'

export interface SESellerTM {
  id: string
  // created: number
  // updated: number
  airtableId?: string
  name_en: string
  name_ru: string
  zip?: number
  services?: SECategory[]
  shortDescr?: string
  descr?: string
  regions?: string
  profilePhoto?: string
  portfolioPhotos?: string[]
  scheduleWorkdays?: boolean
  scheduleEvenings?: boolean
  scheduleWeekend?: boolean
  submitTs?: number

  // BM
  pub?: boolean
}

export interface SESellerBM extends SESellerTM {
  email: string
  phone: string
  recommendation?: string
  source?: string
}

export interface SESellerDBM
  extends Merge<
      SESellerBM,
      {
        profilePhoto?: AirtableAttachment[]
        portfolioPhotos?: AirtableAttachment[]
      }
    >,
    SavedDBEntity {}

const seSellerTMSchema = objectSchema<SESellerTM>({
  id: stringSchema,
  // airtableId: airtableIdSchema.optional(), // drop it
  name_en: stringSchema.optional(),
  name_ru: stringSchema.optional(),
  zip: integerSchema.optional(),
  services: arraySchema(stringSchema).default([]),
  shortDescr: stringSchema.optional(),
  descr: stringSchema.optional(),
  regions: stringSchema.optional(),
  profilePhoto: urlSchema().optional(),
  portfolioPhotos: arraySchema(urlSchema()).default([]),
  scheduleWorkdays: booleanSchema.optional(),
  scheduleEvenings: booleanSchema.optional(),
  scheduleWeekend: booleanSchema.optional(),
  submitTs: numberSchema.optional(), // todo: unix ts
  pub: booleanSchema.optional(),
})

const seSellerBMSchema = objectSchema<SESellerBM>({
  email: emailSchema,
  phone: stringSchema, // todo: phoneSchema
  recommendation: stringSchema.optional(),
  source: stringSchema.optional(),
}).concat(seSellerTMSchema)

export const seSellerDao = new CommonDao<SESellerBM, SESellerDBM, SESellerTM>({
  table: 'app5zPX1QY0VFZOBe.Sellers',
  db: airtableDB,
  createdUpdated: false,
  // dbmSchema: any! (no validation)
  bmSchema: seSellerBMSchema,
  tmSchema: seSellerTMSchema,
  hooks: {
    beforeDBMToBM: dbm => {
      return {
        ...dbm,
        profilePhoto: airtableImagesMapper(dbm.profilePhoto)[0],
        portfolioPhotos: airtableImagesMapper(dbm.portfolioPhotos),
        descr: markdownMapper(dbm.descr),
      }
    },
  },
})
