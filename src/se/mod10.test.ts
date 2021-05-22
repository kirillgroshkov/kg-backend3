import { mod10Check, personNummerCheck } from '@src/se/mod10'

test('mod10', () => {
  const f = mod10Check
  expect(f(8_112_289_874)).toBeTruthy()
  expect(f(8_112_289_875)).toBeFalsy()
  expect(f(8_112_289_864)).toBeFalsy()
  expect(f(8_112_289_884)).toBeFalsy()
})

test('personNummerCheck', () => {
  const f = personNummerCheck
  expect(f(8_112_289_874)).toBeTruthy()
  expect(f(198_112_289_874)).toBeTruthy()
  expect(f(8_112_289_875)).toBeFalsy()
  expect(f(198_112_289_875)).toBeFalsy()
})
