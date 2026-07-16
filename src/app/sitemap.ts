import type { MetadataRoute } from 'next'
import { absoluteUrl } from './seo'
import { languageAlternates } from './lib/pageMetadata'
import { locales } from '../i18n/config'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const paths = [
    { path: '', changeFrequency: 'weekly' as const, priority: 1 },
    { path: '/kontakty', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/avto', changeFrequency: 'weekly' as const, priority: 0.85 },
    { path: '/poslugy/pidbir', changeFrequency: 'monthly' as const, priority: 0.75 },
    { path: '/poslugy/vodnyy', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/poslugy/gabaryt', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/polityka', changeFrequency: 'yearly' as const, priority: 0.3 },
  ]

  return locales.flatMap((locale) =>
    paths.map(({ path, changeFrequency, priority }) => ({
      url: absoluteUrl(`/${locale}${path}`),
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: languageAlternates(path),
      },
    })),
  )
}
