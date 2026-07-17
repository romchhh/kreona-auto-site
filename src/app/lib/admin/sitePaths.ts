const SITE_LOCALES = ['uk', 'pl', 'en'] as const
const SITE_PAGE_SUFFIXES = [
  '',
  '/avto',
  '/kontakty',
  '/poslugy/pidbir',
  '/poslugy/vodnyy',
  '/poslugy/gabaryt',
  '/polityka',
] as const

/** Full public sitemap paths — always shown in heatmap even without traffic yet. */
export function getKnownSitePaths() {
  return SITE_LOCALES.flatMap((locale) =>
    SITE_PAGE_SUFFIXES.map((suffix) => `/${locale}${suffix}`),
  )
}
