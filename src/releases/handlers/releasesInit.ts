import { filterUndefinedValues } from '@naturalcycles/js-lib'
import { BackendResponse } from '@src/releases/model/releases.model'
import { ReleasesUser, releasesUserDao } from '@src/releases/model/releasesUser.model'
import { releasesUpdater } from '@src/releases/releasesUpdater'

export async function releasesInit(user: ReleasesUser): Promise<BackendResponse> {
  const releasesUpdaterLastFinished =
    releasesUpdater.lastFinished && releasesUpdater.lastFinished.unix()

  return filterUndefinedValues({
    userFM: await releasesUserDao.bmToTM(user),
    releasesUpdaterLastFinished,
  })
}
