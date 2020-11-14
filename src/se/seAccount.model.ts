import { BaseDBEntity, baseDBEntitySchema, CommonDao, SavedDBEntity } from '@naturalcycles/db-lib'
import {
  arraySchema,
  booleanSchema,
  emailSchema,
  integerSchema,
  objectSchema,
  stringSchema,
  unixTimestampSchema,
} from '@naturalcycles/nodejs-lib'
import { seFirestoreDB } from '@src/se/se.db'
import { SELang, SE_LANG_VALUES } from '@src/se/se.lang'
import { Merge } from 'type-fest'

export interface SEAccountPatch {
  // phoneNumber?: string // no, you cannot patch it!
  email?: string
  name1Ru?: string
  name2Ru?: string
  name1Latin?: string
  name2Latin?: string
  zip?: number
  personNummer?: number
  languages?: SELang[]
}

export const SE_ACCOUNT_REQ_FIELDS: (keyof SEAccountTM)[] = [
  'email',
  'phoneNumber',
  'name1Latin',
  'name2Latin',
  'name1Ru',
  'name2Ru',
  'zip',
  'languages',
  // 'emailVerified', // to check!
  // 'personNummer', // optional
]

/**
 * This model represents not completed Account where everything is optional.
 */
export interface SEAccountTM extends SEAccountPatch {
  id: string
  updated?: number // ts
  phoneNumber?: string
  completed?: number // ts
  emailVerified?: boolean
  avatarId?: string
  languages: SELang[]
}

export interface SEAccountBM extends Merge<SEAccountTM, BaseDBEntity> {}

export interface SEAccountDBM extends Merge<SEAccountTM, SavedDBEntity> {}

// todo: move to nodejs-lib
const mobilePhoneNumberSchema = stringSchema.regex(/^\+[0-9]{11}$/)
const seZipSchema = integerSchema.min(10_000).max(99_999)
const nameSchema = stringSchema.max(30)
const personNummerSchema = integerSchema.min(1930_01_01_0000).max(2010_01_01_0000)
// todo: add customer mod10 check on personnummer

export const seAccountPatchSchema = objectSchema<SEAccountPatch>({
  email: emailSchema.optional(),
  name1Ru: nameSchema.optional(),
  name2Ru: nameSchema.optional(),
  name1Latin: nameSchema.optional(),
  name2Latin: nameSchema.optional(),
  zip: seZipSchema.optional(),
  personNummer: personNummerSchema.optional(),
  languages: arraySchema(stringSchema.valid(...SE_LANG_VALUES)).optional(),
}).min(1)

const seAccountSchema = objectSchema<SEAccountBM>({
  phoneNumber: mobilePhoneNumberSchema.optional(),
  completed: unixTimestampSchema.optional(),
  emailVerified: booleanSchema.optional(),
  avatarId: stringSchema.optional(),
  languages: arraySchema(stringSchema.valid(...SE_LANG_VALUES))
    .optional()
    .default([]),
})
  .concat(seAccountPatchSchema)
  .concat(baseDBEntitySchema)

export const seAccountDao = new CommonDao<SEAccountBM, SEAccountDBM, SEAccountTM>({
  db: seFirestoreDB,
  table: 'Account',
  dbmSchema: seAccountSchema,
  bmSchema: seAccountSchema,
})
