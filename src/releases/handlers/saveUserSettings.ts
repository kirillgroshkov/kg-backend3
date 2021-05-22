import { Saved } from '@naturalcycles/db-lib'
import { BackendResponse } from '@src/releases/model/releases.model'
import { ReleasesUser, releasesUserDao, UserSettings } from '@src/releases/model/releasesUser.model'

export async function saveUserSettings(
  user: Saved<ReleasesUser>,
  settings: UserSettings,
): Promise<BackendResponse> {
  user = await releasesUserDao.save({
    ...user,
    settings,
  })

  return {
    userFM: releasesUserDao.bmToTM(user),
  }
}
