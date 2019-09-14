import { BackendResponse } from '@src/releases/releases.model'
import { ReleasesUser, releasesUserDao } from '@src/releases/releasesUser.model'

export async function releasesInit (user: ReleasesUser): Promise<BackendResponse> {
  return {
    userFM: releasesUserDao.bmToFM(user),
  }
}
