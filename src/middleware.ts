import { NextRequest, NextResponse } from 'next/server'
import { defaultLocale, isLocale } from './i18n/config'
import { ADMIN_SESSION_COOKIE } from './app/lib/admin/constants'

const PATH_REDIRECTS: Record<string, string> = {
  '/avto-v-nayavnosti': '/avto',
  '/poslugy/pidbir-avtomobilya': '/poslugy/pidbir',
  '/poslugy/vodnyy-transport': '/poslugy/vodnyy',
  '/poslugy/velykogabarytnyy-transport': '/poslugy/gabaryt',
  '/polityka-konfidentsiynosti': '/polityka',
}

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

  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
      return NextResponse.next()
    }
    if (!request.cookies.get(ADMIN_SESSION_COOKIE)?.value) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  const segments = pathname.split('/')
  const maybeLocale = segments[1]
  const hasLocale = isLocale(maybeLocale)
  const pathWithoutLocale = hasLocale
    ? `/${segments.slice(2).join('/')}`.replace(/\/$/, '') || '/'
    : pathname

  const redirected = PATH_REDIRECTS[pathWithoutLocale]
  if (redirected) {
    const url = request.nextUrl.clone()
    const locale = hasLocale ? maybeLocale : defaultLocale
    url.pathname = `/${locale}${redirected}`
    return NextResponse.redirect(url, 308)
  }

  if (hasLocale) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-locale', maybeLocale)
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
