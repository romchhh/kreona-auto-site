import type { Metadata } from 'next'
import { locales, type Locale } from '../../i18n/config'
import { absoluteUrl, OG_IMAGE, SITE_NAME } from '../seo'

export const localeToOgLocale: Record<Locale, string> = {
  uk: 'uk_UA',
  pl: 'pl_PL',
  en: 'en_US',
}

export const localeToHtmlLang: Record<Locale, string> = {
  uk: 'uk-UA',
  pl: 'pl-PL',
  en: 'en-US',
}

/** Build hreflang map for a path without locale prefix, e.g. '' or '/kontakty' */
export function languageAlternates(path = '') {
  const normalized = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
  const languages: Record<string, string> = {
    'x-default': absoluteUrl(`/uk${normalized}`),
  }
  for (const locale of locales) {
    languages[locale] = absoluteUrl(`/${locale}${normalized}`)
  }
  return languages
}

type PageMetaInput = {
  locale: Locale
  path?: string
  title: string
  description: string
  keywords?: string[]
  noIndex?: boolean
  ogImageAlt?: string
  /** Skip "%s | Brand" template (use for homepage full titles) */
  absoluteTitle?: boolean
}

export function buildPageMetadata({
  locale,
  path = '',
  title,
  description,
  keywords = [],
  noIndex = false,
  ogImageAlt,
  absoluteTitle = true,
}: PageMetaInput): Metadata {
  const normalized = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
  const url = absoluteUrl(`/${locale}${normalized}`)
  const ogLocale = localeToOgLocale[locale]
  const alternateLocales = locales
    .filter((code) => code !== locale)
    .map((code) => localeToOgLocale[code])

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: {
      canonical: url,
      languages: languageAlternates(normalized),
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title,
      description,
      url,
      locale: ogLocale,
      alternateLocale: alternateLocales,
      images: [
        {
          url: OG_IMAGE,
          width: 1408,
          height: 768,
          alt: ogImageAlt ?? title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE],
    },
    robots: noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true },
  }
}
