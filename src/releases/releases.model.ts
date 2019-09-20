import {
  booleanSchema,
  dateStringSchema,
  integerSchema,
  objectSchema,
  stringSchema,
} from '@naturalcycles/nodejs-lib'
import { Release } from '@src/releases/release.model'
import { ReleasesUserTM } from '@src/releases/releasesUser.model'

export interface ReleasesQuery {
  /**
   * @default 90
   */
  maxDaysOld?: number

  /**
   * @default 100
   */
  maxReleasesTotal?: number

  /**
   * @default 10
   */
  maxReleasesPerRepo?: number

  /**
   * If true - always hit origin.
   * Otherwise will return cached if available.
   * @default false
   */
  skipCache?: boolean

  repoFullName?: string
}

export const releasesQueryDefault: ReleasesQuery = {
  maxDaysOld: 90,
  maxReleasesTotal: 100,
  maxReleasesPerRepo: 10,
  skipCache: false,
}

export const releasesQuerySchema = objectSchema<ReleasesQuery>({
  maxDaysOld: integerSchema.min(0).optional(),
  maxReleasesTotal: integerSchema.min(0).optional(),
  maxReleasesPerRepo: integerSchema.min(0).optional(),
  skipCache: stringSchema.optional(), // because booleanSchema is biting now
  repoFullName: stringSchema.optional(),
})

export interface RepoFullNameObject {
  repoFullName: string
}

export const repoFullNameObjectSchema = objectSchema<RepoFullNameObject>({
  repoFullName: stringSchema,
})

export interface RepoAuthorName {
  repoAuthor: string
  repoName: string
}

export const repoAuthorNameSchema = objectSchema<RepoAuthorName>({
  repoAuthor: stringSchema,
  repoName: stringSchema,
})

export interface AuthInput {
  username: string
  accessToken: string
  idToken: string
}

export const authInputSchema = objectSchema<AuthInput>({
  username: stringSchema,
  accessToken: stringSchema,
  idToken: stringSchema,
})

export interface BackendResponse {
  newUser?: boolean
  userFM?: ReleasesUserTM
  releases?: Release[]
}

export const backendResponseSchema = objectSchema<BackendResponse>({
  newUser: booleanSchema.optional(),
})

export interface DateRange {
  minIncl?: string
  maxExcl?: string
}

export const dateRangeSchema = objectSchema<DateRange>({
  minIncl: dateStringSchema.optional(),
  maxExcl: dateStringSchema.optional(),
}).options({ stripUnknown: false })
