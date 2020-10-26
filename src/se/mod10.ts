/**
 * @return true if number is valid
 *
 * Source: https://en.wikipedia.org/wiki/Luhn_algorithm
 */
export function mod10Check(n: number | string): boolean {
  const num = String(n)

  let sum = parseInt(num.charAt(num.length - 1))

  for (let i = 0; i < num.length - 1; i++) {
    let value = parseInt(num.charAt(i))

    if (i % 2 === 0) {
      value *= 2
    }

    if (value > 9) {
      value -= 9
    }

    sum += value
  }

  return sum % 10 === 0
}

/**
 * @return true if it's valid
 * Automatically omits first 2 digits if 12-digit number is passed
 */
export function personNummerCheck(n: number): boolean {
  let s = String(n)
  if (s.length === 12) s = s.substr(2)
  return mod10Check(s)
}
