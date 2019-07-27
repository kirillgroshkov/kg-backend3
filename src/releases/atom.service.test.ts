import { exDir } from '@src/cnst/paths.cnst'
import { atomService } from '@src/releases/atom.service'
import * as fs from 'fs-extra'

test('releases.xml', async () => {
  const atom = await fs.readFile(`${exDir}/releases.xml`, 'utf8')
  // console.log(atom)
  const r = await atomService.parse(atom)
  // console.log(r)
  expect(r).toMatchSnapshot()
})

test('releases2.xml', async () => {
  const atom = await fs.readFile(`${exDir}/releases2.xml`, 'utf8')
  const r = await atomService.parse(atom)
  expect(r).toMatchSnapshot()
})

test('releases3.xml', async () => {
  const atom = await fs.readFile(`${exDir}/releases3.xml`, 'utf8')
  const r = await atomService.parse(atom)
  expect(r).toMatchSnapshot()
})
