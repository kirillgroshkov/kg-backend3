import { Saved } from '@naturalcycles/db-lib'
import { HttpError } from '@naturalcycles/js-lib'
import { ReleasesUser, releasesUserDao } from '@src/releases/model/releasesUser.model'
import { Request } from 'express'

export async function getUserFromRequest(req: Request): Promise<Saved<ReleasesUser> | undefined> {
  const uid = req.header('uid')
  if (!uid) return

  return await releasesUserDao.getById(uid)
}

export async function requireUserFromRequest(req: Request): Promise<Saved<ReleasesUser>> {
  const uid = req.header('uid') || (req.query['uid'] as string | undefined)
  if (!uid) {
    throw new HttpError('uid required', {
      httpStatusCode: 401,
      userFriendly: true,
    })
  }

  const user = await releasesUserDao.getById(uid)
  if (!user) {
    throw new HttpError(`user not found: ${uid}`, {
      httpStatusCode: 401,
      userFriendly: true,
    })
  }

  return user
}
