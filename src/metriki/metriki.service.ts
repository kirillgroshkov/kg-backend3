import { HttpError } from '@naturalcycles/js-lib'
import { MetrikiApiKey, metrikiApiKeyDao, MetrikiPermission } from '@src/metriki/metriki.model'

class MetrikiService {
  /**
   * Throws on error
   */
  async auth(
    passedApiKey?: string,
    passedAccountId?: string,
    requirePermission?: MetrikiPermission,
  ): Promise<MetrikiApiKey> {
    if (!passedApiKey) {
      throw new HttpError('401', {
        httpStatusCode: 401,
      })
    }

    const apiKey = await metrikiApiKeyDao.getById(passedApiKey)
    if (!apiKey || apiKey.accountId !== passedAccountId) {
      throw new HttpError('403', {
        httpStatusCode: 403,
      })
    }

    if (requirePermission) {
      const { permission } = apiKey
      if (
        (requirePermission === 'r' && !['r', 'rw'].includes(permission)) ||
        (requirePermission === 'w' && !['w', 'rw'].includes(permission)) ||
        (requirePermission === 'rw' && permission !== 'rw')
      ) {
        throw new HttpError('403', {
          httpStatusCode: 403,
          permissionRequired: requirePermission,
        })
      }
    }

    return apiKey
  }
}

export const metrikiService = new MetrikiService()
