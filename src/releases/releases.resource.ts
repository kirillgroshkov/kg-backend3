import { getDefaultRouter, reqValidation } from '@naturalcycles/backend-lib'
import { getGlobalReleases } from '@src/releases/getGlobalReleases'
import { getRepoNames, getRepoOrgs } from '@src/releases/getRepoNames'
import { getRepoReleases } from '@src/releases/getRepoReleases'
import {
  ReleasesQuery,
  releasesQuerySchema,
  RepoAuthorName,
  repoAuthorNameSchema,
} from '@src/releases/releases.model'

const router = getDefaultRouter()
export const releasesResource = router

router.get('/repos', async (req, res) => {
  const repoNames = await getRepoNames()
  res.json(repoNames)
})

router.get('/repos/orgs', async (req, res) => {
  const repoOrgs = await getRepoOrgs()
  res.json(repoOrgs)
})

router.get('/global', reqValidation('query', releasesQuerySchema), async (req, res) => {
  const query: ReleasesQuery = req.query
  const releases = await getGlobalReleases(query)

  res.json({
    releases,
    // query,
  })
})

router.get(
  '/:repoAuthor/:repoName',
  reqValidation('query', releasesQuerySchema),
  reqValidation('params', repoAuthorNameSchema),
  async (req, res) => {
    const query: ReleasesQuery = req.query
    const { repoAuthor, repoName } = (req.params as any) as RepoAuthorName
    const repoFullName = [repoAuthor, repoName].join('/')
    const releases = await getRepoReleases(repoFullName, query)

    res.json({
      releases,
      // query,
    })
  },
)
