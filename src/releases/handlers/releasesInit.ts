import { BackendResponse } from '@src/releases/model/releases.model'
import { ReleasesUser, releasesUserDao } from '@src/releases/model/releasesUser.model'

export async function releasesInit(user: ReleasesUser): Promise<BackendResponse> {
  return {
    userFM: await releasesUserDao.bmToTM(user),
  }
}
