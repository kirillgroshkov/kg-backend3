import { HttpError, _assert } from '@naturalcycles/js-lib'
import { seFirebaseService } from '@src/se/seFirebase.service'
import { Request } from 'express'

export interface SEFirebaseUser {
  uid: string
  phoneNumber: string
}

export async function seRequireUser(req: Request): Promise<SEFirebaseUser> {
  const user = await seGetUser(req)

  if (!user) {
    throw new HttpError(`Authorization required`, {
      httpStatusCode: 401,
      userFriendly: true,
    })
  }

  return user
}

export async function seGetUser(req: Request): Promise<SEFirebaseUser | null> {
  const idToken = req.header('idToken')
  if (!idToken) return null

  // todo: check if we need to catch it and interpret the error somehow
  const decodedIdToken = await seFirebaseService.auth().verifyIdToken(idToken)
  const { uid, phone_number: phoneNumber } = decodedIdToken
  _assert(phoneNumber, 'phone_number should exist')

  return {
    uid,
    phoneNumber,
  }
}
