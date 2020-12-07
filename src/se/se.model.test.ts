import { isValid } from '@naturalcycles/nodejs-lib'
import { mobilePhoneNumberSchema } from '@src/se/seAccount.model'

test('phoneNumber', () => {
  const phoneNumberOk = '+46760818788'
  const phoneNumberWrong = '+460760818788'

  expect(isValid(phoneNumberOk, mobilePhoneNumberSchema)).toBe(true)
  expect(isValid(phoneNumberWrong, mobilePhoneNumberSchema)).toBe(false)
})
