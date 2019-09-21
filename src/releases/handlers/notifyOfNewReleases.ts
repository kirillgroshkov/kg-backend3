import { _truncate, _uniq, pMap } from '@naturalcycles/js-lib'
import { dayjs } from '@naturalcycles/time-lib'
import { DEF_FROM } from '@src/cnst/email.cnst'
import { viewsDir } from '@src/cnst/paths.cnst'
import { releaseDao } from '@src/releases/model/release.model'
import { releasesUserDao } from '@src/releases/model/releasesUser.model'
import { log } from '@src/srv/log.service'
import { sendgridService } from '@src/srv/sendgrid.service'
import { sentryService } from '@src/srv/sentry.service'
import { slackService } from '@src/srv/slack.service'
import * as ejs from 'ejs'
import * as fs from 'fs-extra'

export async function notifyOfNewReleasesDaily(daily = true): Promise<void> {
  const maxExcl = dayjs()
    .utc()
    .startOf('day')
  const minIncl = maxExcl.subtract(1, 'day')
  void slackService.send(`notifyOfNewReleasesDaily: ${minIncl.toPretty()} - ${maxExcl.toPretty()}`)

  const newReleases = await releaseDao
    .query()
    .filter('published', '>=', minIncl.unix())
    .filter('published', '<', maxExcl.unix())
    .order('published', true)
    .runQuery()

  if (!newReleases.length) return

  const users = await releasesUserDao
    .query()
    .filter('accessToken', '>', '')
    .filter('settings.notificationEmail', '>', '')
    .filter('settings.notifyEmailDaily', '=', true)
    .runQuery()

  let emailsSent = 0

  await pMap(
    users,
    async user => {
      const stars = new Set(user.starredRepos)
      const releases = newReleases.filter(r => stars.has(r.repoFullName))
      if (!releases.length) return

      const releasesList = _uniq(releases.map(r => r.repoFullName))
        .slice(0, 5)
        .join(', ')
      const subject = _truncate(`New releases: ${releasesList}`, 60)

      const tmpl = await fs.readFile(`${viewsDir}/newreleases.ejs`, 'utf8')
      const content = ejs.render(tmpl, { releases })

      const { notificationEmail } = user.settings

      log(`email to ${notificationEmail}`)

      await sendgridService.send({
        from: DEF_FROM,
        to: {
          email: notificationEmail!,
          name: user.displayName || notificationEmail,
        },
        subject,
        content,
      })

      emailsSent++
    },
    { concurrency: 1, stopOnError: false },
  ).catch(err => sentryService.captureException(err))

  void slackService.send(`notifyOfNewReleasesDaily sent ${emailsSent} email(s)`)
}
