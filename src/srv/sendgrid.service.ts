import { secret } from '@naturalcycles/nodejs-lib'
import { SendgridSharedService } from '@src/srv/sendgrid.shared.service'

export const sendgridService = new SendgridSharedService({
  apiKey: secret('SECRET_SENDGRID_API_KEY'),
})
