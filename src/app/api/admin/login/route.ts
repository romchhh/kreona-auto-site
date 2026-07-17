import { NextResponse } from 'next/server'
import {
  createAdminSessionToken,
  isAdminConfigured,
  verifyAdminCredentials,
} from '../../../lib/admin/auth'
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE } from '../../../lib/admin/constants'

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: 'Admin credentials are not configured in .env' },
      { status: 503 },
    )
  }

  const body = (await request.json()) as { username?: string; password?: string }
  const username = String(body.username ?? '').trim()
  const password = String(body.password ?? '')

  if (!verifyAdminCredentials(username, password)) {
    return NextResponse.json({ error: 'Невірний логін або пароль' }, { status: 401 })
  }

  const token = createAdminSessionToken(username)
  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE,
  })
  return response
}
