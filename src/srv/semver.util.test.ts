import { parseSemver } from '@src/srv/semver.util'

test('parseSemver', () => {
  expect(parseSemver('0.3.0')).toBe('0.3.0')
  expect(parseSemver('0.3')).toBe('0.3.0')
})
