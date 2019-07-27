import * as semver from 'semver'

export function parseSemver (v?: string): string | undefined {
  if (!v) return
  const c = semver.coerce(v)
  return c ? c.version : undefined
}
