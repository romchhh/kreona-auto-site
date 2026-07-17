import { createHmac, randomBytes, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE } from './constants'

const COOKIE = ADMIN_SESSION_COOKIE
const MAX_AGE_SEC = ADMIN_SESSION_MAX_AGE

function cleanEnv(value?: string) {
  if (!value) return undefined
  return value.trim().replace(/^['"]|['"]$/g, '')
}

function getSecret() {
  return cleanEnv(process.env.ADMIN_SESSION_SECRET) || cleanEnv(process.env.ADMIN_PASSWORD) || 'dev-secret'
}

function getCredentials() {
  return {
    username: cleanEnv(process.env.ADMIN_USERNAME),
    password: cleanEnv(process.env.ADMIN_PASSWORD),
  }
}

export function isAdminConfigured() {
  const { username, password } = getCredentials()
  return Boolean(username && password)
}

/** Constant-time string compare (handles different lengths). */
function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) {
    // Still do a dummy compare to reduce timing leaks on length.
    timingSafeEqual(bufA, Buffer.alloc(bufA.length))
    return false
  }
  return timingSafeEqual(bufA, bufB)
}

export function verifyAdminCredentials(username: string, password: string) {
  const creds = getCredentials()
  if (!creds.username || !creds.password) return false
  return safeEqual(username.trim(), creds.username) && safeEqual(password, creds.password)
}

function sign(payload: string) {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url')
}

export function createAdminSessionToken(username: string) {
  const exp = Date.now() + MAX_AGE_SEC * 1000
  const payload = Buffer.from(JSON.stringify({ u: username, exp, n: randomBytes(8).toString('hex') })).toString(
    'base64url',
  )
  return `${payload}.${sign(payload)}`
}

export function parseAdminSessionToken(token: string | undefined | null): { username: string } | null {
  if (!token) return null
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null
  const expected = sign(payload)
  try {
    const sigBuf = Buffer.from(signature)
    const expBuf = Buffer.from(expected)
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null
  } catch {
    return null
  }
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      u: string
      exp: number
    }
    if (!data.u || !data.exp || Date.now() > data.exp) return null
    return { username: data.u }
  } catch {
    return null
  }
}

export function setAdminSessionCookie(token: string) {
  cookies().set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SEC,
  })
}

export function clearAdminSessionCookie() {
  cookies().set(COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
}

export function getAdminSessionFromCookies() {
  return parseAdminSessionToken(cookies().get(COOKIE)?.value)
}

export function getAdminSessionFromRequest(request: Request) {
  const cookie = request.headers.get('cookie') || ''
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`))
  return parseAdminSessionToken(match?.[1] ? decodeURIComponent(match[1]) : null)
}

export { COOKIE as ADMIN_SESSION_COOKIE, MAX_AGE_SEC as ADMIN_SESSION_MAX_AGE }
