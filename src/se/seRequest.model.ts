import {
  BaseDBEntity,
  baseDBEntitySchema,
  CommonDao,
  SavedDBEntity,
  savedDBEntitySchema,
} from '@naturalcycles/db-lib'
import { booleanSchema, objectSchema, stringSchema } from '@naturalcycles/nodejs-lib'
import { seFirestoreDB } from '@src/se/se.db'
import { SECategory, SE_CATEGORY_VALUES } from '@src/se/se.model'
import { mobilePhoneNumberSchema } from '@src/se/seAccount.model'

export interface SERequestInput {
  phoneNumber: string
  hasWhatsApp?: boolean
  hasTelegram?: boolean
  name: string
  descr: string
  serviceId: string
  category: SECategory
}

export interface SERequestBM extends SERequestInput, BaseDBEntity {}
export interface SERequestDBM extends SERequestInput, SavedDBEntity {}

export const seRequestInputSchema = objectSchema<SERequestInput>({
  phoneNumber: mobilePhoneNumberSchema,
  hasWhatsApp: booleanSchema.optional(),
  hasTelegram: booleanSchema.optional(),
  name: stringSchema.max(80),
  descr: stringSchema.min(2).max(4000),
  serviceId: stringSchema,
  category: stringSchema.valid(...SE_CATEGORY_VALUES),
})

const seRequestBMSchema = seRequestInputSchema.concat(baseDBEntitySchema)
const seRequestDBMSchema = seRequestInputSchema.concat(savedDBEntitySchema)

export const seRequestDao = new CommonDao<SERequestBM, SERequestDBM>({
  db: seFirestoreDB,
  table: 'Request',
  dbmSchema: seRequestDBMSchema,
  bmSchema: seRequestBMSchema,
  // tmSchema: seRequestTMSchema,
})
