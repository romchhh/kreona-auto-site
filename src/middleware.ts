import { NextRequest, NextResponse } from 'next/server'
import { defaultLocale, isLocale, locales } from './i18n/config'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/cars') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const segment = pathname.split('/')[1]
  if (isLocale(segment)) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-locale', segment)
    return NextResponse.next({
      request: { headers: requestHeaders },
    })
  }

  const url = request.nextUrl.clone()
  url.pathname = pathname === '/' ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
