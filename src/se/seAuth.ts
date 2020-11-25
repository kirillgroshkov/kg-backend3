import { _assert, _filterNullishValues } from '@naturalcycles/js-lib'
import { seFirebaseService } from '@src/se/seFirebase.service'
import { Request } from 'express'

// yes, hard-coded list of uids
const ADMINS = new Set([
  'M5iAyTUjOofR8odrXER0bvInIq42',
  'DCXKFvar8Ke1fcp9cfk78zm1PsW2',
  'dlYGfF0SJwQReGc0yD9ZC7PKMGu2',
])

export interface SEFirebaseUser {
  uid: string
  phoneNumber: string

  admin?: true // true or undefined
  impersonatedBy?: SEFirebaseUser
}

export async function seRequireAdmin(req: Request): Promise<SEFirebaseUser> {
  const user = await seRequireUser(req)

  _assert(user.admin, 'Admin required', { httpStatusCode: 403 })

  return user
}

export async function seRequireUser(req: Request): Promise<SEFirebaseUser> {
  const user = await seGetUser(req)

  _assert(user, 'Authorization required', { httpStatusCode: 401 })

  return user
}

export async function seGetUser(req: Request): Promise<SEFirebaseUser | null> {
  const idToken = req.header('idToken')
  if (!idToken) return null

  // todo: check if we need to catch it and interpret the error somehow
  const decodedIdToken = await seFirebaseService.auth().verifyIdToken(idToken)
  const { uid, phone_number: phoneNumber } = decodedIdToken
  _assert(phoneNumber, 'phone_number should exist')

  const admin = ADMINS.has(uid) || undefined

  // Allow super-admins to impersonate other users
  const impersonatedId = req.header('impersonatedId')
  if (impersonatedId) {
    // Ensure Admin
    _assert(admin, 'Forbidden', { httpStatusCode: 403 })

    const user = await seFirebaseService.auth().getUser(impersonatedId)
    _assert(user, 'impersonated user not found')

    return {
      uid: user.uid,
      phoneNumber: user.phoneNumber!,
      admin,
      impersonatedBy: {
        uid,
        phoneNumber,
      },
    }
  }

  return _filterNullishValues({
    uid,
    phoneNumber,
    admin,
  })
}
