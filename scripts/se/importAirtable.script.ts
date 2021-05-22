/*

APP_ENV=prod DEBUG=nc* yarn tsn se/importAirtable

 */

/* tslint:disable:ordered-imports no-unused-variable */
/* eslint-disable */
import '@src/bootstrap'
import { _hb, pDelay, pMap } from '@naturalcycles/js-lib'
import { getGot, stringId } from '@naturalcycles/nodejs-lib'
import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { SESchedule } from '@src/se/se.model'
import { seRegionMap } from '@src/se/se.regions'
import { SEAccountBM, seAccountDao } from '@src/se/seAccount.model'
import { seFirebaseService, seStorageBucket } from '@src/se/seFirebase.service'
import { seSellerDao } from '@src/se/seSeller.model'
import { SEServiceBM, seServiceDao } from '@src/se/seService.model'

let existing = 0
const limit = 0

const got = getGot({
  logFinished: true,
})

runScript(async () => {
  let sellers = await seSellerDao.query().limit(limit).runQuery()

  const accounts = await seAccountDao.query().runQuery()

  sellers = sellers.filter(s => s.phone)

  console.log({ sellers: sellers.length, accounts: accounts.length })

  await pMap(
    sellers,
    async seller => {
      if (accounts.some(a => a.phoneNumber === seller.phone)) {
        console.log(`${seller.phone} exists`)
        existing++
        return
      }

      const regions: number[] = []

      if (!seller.regions) {
        regions.push(1) // hela
      } else if (seller.regions.trim() === 'Stockholm') {
        regions.push(2)
      } else {
        const regionCode = Object.entries(seRegionMap).find(
          ([code, str]) => seller.regions!.trim() === str,
        )?.[0]
        if (!regionCode) {
          throw new Error(`Cannot map region: ${seller.regions}`)
        }
        regions.push(Number(regionCode))
      }

      const existingFirebaseUser = await seFirebaseService
        .auth()
        .getUserByPhoneNumber(seller.phone)
        .catch(err => {
          if (err.errorInfo.code !== 'auth/user-not-found') {
            throw err
          }
        })

      let uid

      if (existingFirebaseUser) {
        // throw new Error(`existingFirebaseUser`)
        uid = existingFirebaseUser.uid
        console.log({ existingFirebaseUser: uid })
      } else {
        const fbUser = await seFirebaseService.auth().createUser({
          phoneNumber: seller.phone,
        })
        uid = fbUser.uid
        console.log(`created new fb user: ${uid}`)
      }

      // Delete/recreate Storage bucket
      const accFolderPath = `public/${uid}`

      await seStorageBucket.deleteFolder(accFolderPath).catch(err => {
        console.log(`Failed to delete service images folder at: ${accFolderPath}`)
      })

      let avatarId

      if (seller.profilePhoto) {
        avatarId = stringId(8)

        const data = await got.get(seller.profilePhoto).buffer()
        console.log(`avatar file length: ${data.length} or ${_hb(data.length)}`)

        const newAvatarPath = `public/${uid}/${avatarId}.jpg`
        await seStorageBucket.savePublicFile(newAvatarPath, data)
      }

      const [name1Ru, name2Ru] = (seller.name_ru || '').split(' ')
      const [name1Latin, name2Latin] = (seller.name_en || '').split(' ')

      const acc: SEAccountBM = {
        id: uid,
        phoneNumber: seller.phone,
        languages: [],
        avatarId,
        email: seller.email?.toLowerCase(),
        name1Ru,
        name2Ru,
        name1Latin,
        name2Latin,
        zip: seller.zip,
      }

      const serviceId = stringId()

      const schedule: SESchedule[] = []
      if (seller.scheduleEvenings) schedule.push(SESchedule.EVENING)
      if (seller.scheduleWorkdays) schedule.push(SESchedule.WORKDAYS)
      if (seller.scheduleWeekend) schedule.push(SESchedule.WEEKEND)

      const imageIds: string[] = []
      if (seller.portfolioPhotos?.length) {
        for await (const url of seller.portfolioPhotos) {
          const data = await got.get(url).buffer()
          console.log(`service file length: ${_hb(data.length)}`)

          const imageId = stringId(8)
          const filePath = `public/${uid}/services/${serviceId}/${imageId}.jpg`
          await seStorageBucket.savePublicFile(filePath, data)
          imageIds.push(imageId)
        }
      }

      const service: SEServiceBM = {
        id: serviceId,
        accountId: uid,
        imageIds,
        regions,
        category: seller.services?.[0],
        title: seller.shortDescr,
        descr: seller.descr,
        schedule,
      }

      console.log({ acc, service })

      await seAccountDao.save(acc)
      await seServiceDao.save(service)

      await pDelay(5000)
    },
    {
      concurrency: 1,
    },
  )

  console.log({
    existing,
  })
})
