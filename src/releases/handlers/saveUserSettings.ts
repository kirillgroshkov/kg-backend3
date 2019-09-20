import { BackendResponse } from '@src/releases/releases.model'
import { ReleasesUser, releasesUserDao, UserSettings } from '@src/releases/releasesUser.model'

export async function saveUserSettings(
  user: ReleasesUser,
  settings: UserSettings,
): Promise<BackendResponse> {
  user = await releasesUserDao.save({
    ...user,
    settings,
  })

  return {
    userFM: releasesUserDao.bmToFM(user),
  }
}
