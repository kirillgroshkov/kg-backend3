import { BaseAdminService, createAdminMiddleware } from '@naturalcycles/backend-lib'
import { secret } from '@naturalcycles/nodejs-lib'
import { env } from '@src/srv/env.service'
import { firebaseService } from '@src/srv/firebase.service'

const { authEnabled } = env()

const ADMIN_EMAILS = new Set(['kirill.groshkov@naturalcycles.com', 'ceo@inventix.ru'])

class AdminService extends BaseAdminService {
  getEmailPermissions (email?: string): Set<string> | undefined {
    if (ADMIN_EMAILS.has(email!)) {
      return new Set()
    }
    return // deny all
  }
}

export const adminService = new AdminService(firebaseService.admin().auth(), {
  firebaseAuthDomain: secret('SECRET_FIREBASE_AUTH_DOMAIN'),
  firebaseApiKey: secret('SECRET_FIREBASE_API_KEY'),
  authEnabled,
})

export const reqAdmin = createAdminMiddleware(adminService)
