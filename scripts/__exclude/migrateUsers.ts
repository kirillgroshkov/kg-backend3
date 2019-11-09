/*

APP_ENV=dev DEBUG=app*,kg:*,nc:* yarn tsn ./scripts/migrateUsers.ts

 */

/* tslint:disable:ordered-imports */
import '@src/bootstrap'
import { BaseDBEntity, DBQuery, Saved, SavedDBEntity } from '@naturalcycles/db-lib'
import { runScript, validate } from '@naturalcycles/nodejs-lib'
import { dayjs } from '@naturalcycles/time-lib'
import {
  ReleasesUser,
  releasesUserSchema,
  UserSettings,
} from '@src/releases/model/releasesUser.model'
import { firestoreDB, mongoDB } from '@src/srv/db'

interface LegacyUser extends SavedDBEntity {
  accessToken: string
  displayName: string
  username: string
  settings: UserSettings
  // updated - treat as "created" in new DB
}

runScript(async () => {
  const now = dayjs()

  const q = new DBQuery<LegacyUser>('users')
  const { records: users } = await firestoreDB.runQuery(q)
  console.log(users)

  const newUsers: Saved<ReleasesUser>[] = users.map(u => {
    return {
      id: u.id,
      created: u.updated,
      updated: now.unix(),
      accessToken: u.accessToken,
      displayName: u.displayName,
      username: u.username,
      settings: u.settings || {},
      starredRepos: [],
    }
  })

  newUsers.forEach(u => {
    validate(u, releasesUserSchema)
  })

  await mongoDB.saveBatch('ReleasesUser', newUsers)
})
