import { mod10Check, personNummerCheck } from '@src/se/mod10'

test('mod10', () => {
  const f = mod10Check
  expect(f(811228_9874)).toBeTruthy()
  expect(f(811228_9875)).toBeFalsy()
  expect(f(811228_9864)).toBeFalsy()
  expect(f(811228_9884)).toBeFalsy()
})

test('personNummerCheck', () => {
  const f = personNummerCheck
  expect(f(811228_9874)).toBeTruthy()
  expect(f(19811228_9874)).toBeTruthy()
  expect(f(811228_9875)).toBeFalsy()
  expect(f(19811228_9875)).toBeFalsy()
})
