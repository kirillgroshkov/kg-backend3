import { getDefaultRouter, reqValidation } from '@naturalcycles/backend-lib'
import { dayjs } from '@naturalcycles/time-lib'
import { reqAdmin } from '@src/admin/admin.service'
import { requireUserFromRequest } from '@src/releases/getUserFromRequest'
import { getFeed } from '@src/releases/handlers/getFeed'
import { getGlobalReleases } from '@src/releases/handlers/getGlobalReleases'
import { getRepoNames, getRepoOrgs } from '@src/releases/handlers/getRepoNames'
import { getRepoReleases } from '@src/releases/handlers/getRepoReleases'
import { authUser } from '@src/releases/handlers/releasesAuthHandler'
import { releasesInit } from '@src/releases/handlers/releasesInit'
import { saveUserSettings } from '@src/releases/handlers/saveUserSettings'
import {
  authInputSchema,
  BackendResponse,
  dateRangeSchema,
  releasesQuerySchema,
  RepoAuthorName,
  repoAuthorNameSchema,
} from '@src/releases/model/releases.model'
import { userSettingsSchema } from '@src/releases/model/releasesUser.model'
import { releasesUpdater } from '@src/releases/releasesUpdater'
import { userStarsUpdater } from '@src/releases/userStarsUpdater'
import { log } from '@src/srv/log.service'

const router = getDefaultRouter()
export const releasesResource = router

router.all('/hooks/marketplace', async (req, res) => {
  const { body } = req
  log(body)
  res.json({ ok: 1 })
})

router.get('/repos', async (req, res) => {
  res.json(await getRepoNames())
})

router.get('/repos/orgs', async (req, res) => {
  res.json(await getRepoOrgs())
})

router.get('/global', reqValidation('query', releasesQuerySchema), async (req, res) => {
  res.json({
    releases: await getGlobalReleases(req.query),
    // query,
  } as BackendResponse)
})

router.get('/global/pretty', async (req, res) => {
  const releases = (await getGlobalReleases()).map(r =>
    [dayjs.unix(r.published).toPretty(), r.repoFullName, r.tagName].join(' - '),
  )

  res.json(releases)
})

router.get(
  '/:repoAuthor/:repoName',
  reqValidation('query', releasesQuerySchema),
  reqValidation('params', repoAuthorNameSchema),
  async (req, res) => {
    const { repoAuthor, repoName } = (req.params as any) as RepoAuthorName
    const repoFullName = [repoAuthor, repoName].join('/')
    const releases = await getRepoReleases(repoFullName, req.query)

    res.json({
      releases,
      // query,
    } as BackendResponse)
  },
)

router.get('/updateStars', reqAdmin(), async (req, res) => {
  const { forceUpdateAll } = req.query
  void userStarsUpdater.start(!!forceUpdateAll)
  res.json({ ok: 1 })
})

router.get('/updateReleases', reqAdmin(), async (req, res) => {
  const { forceUpdateAll } = req.query
  void releasesUpdater.start({
    forceUpdateAll: !!forceUpdateAll,
  })
  res.json({ ok: 1 })
})

router.post('/auth', reqValidation('body', authInputSchema), async (req, res) => {
  res.json(await authUser(req.body))
})

router.put('/userSettings', reqValidation('body', userSettingsSchema), async (req, res) => {
  // todo: optimize, use projection query (where needed)
  const user = await requireUserFromRequest(req)
  res.json(await saveUserSettings(user, req.body))
})

// feed
router.get('/', reqValidation('query', dateRangeSchema), async (req, res) => {
  const user = await requireUserFromRequest(req)
  res.json(await getFeed(user, req.query))
})

router.get('/init', async (req, res) => {
  const user = await requireUserFromRequest(req)
  res.json(await releasesInit(user))
})
