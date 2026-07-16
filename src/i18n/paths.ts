import type { Locale } from './config'

/** Build a localized path, e.g. localePath('uk', '/kontakty') => '/uk/kontakty' */
export function localePath(locale: Locale, path = '/') {
  if (path.startsWith('/#')) {
    return `/${locale}${path.slice(1)}`
  }
  if (path.startsWith('#')) {
    return `/${locale}${path}`
  }
  const normalized = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
  return `/${locale}${normalized}`
}

/** Replace locale segment in a pathname while keeping the rest */
export function switchLocalePath(pathname: string, nextLocale: Locale) {
  const parts = pathname.split('/')
  if (parts.length > 1 && ['uk', 'pl', 'en'].includes(parts[1])) {
    parts[1] = nextLocale
    return parts.join('/') || `/${nextLocale}`
  }
  return `/${nextLocale}${pathname === '/' ? '' : pathname}`
}
