import { pMap } from '@naturalcycles/js-lib'
import { atomService } from '@src/releases/atom.service'
import * as got from 'got'

test('test1', async () => {
  // const repos: any[] = await githubService.getUserStarredRepos()
  const repos: any[] = []
  // console.log(repos)

  const all: string[] = []

  await pMap(
    repos,
    async r => {
      const url = `https://github.com/${r}/releases.atom`
      const { body } = await got.get(url)
      console.log(`>> ${r}`)
      const releases = await atomService.parse(body)
      releases.forEach(rel => {
        console.log(`${r} ${rel.title}`)
      })
      all.push(...releases.map(r => r.title))
    },
    { concurrency: 100 },
  )

  console.log(all.length)
})
