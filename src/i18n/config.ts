export const locales = ['uk', 'pl', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'uk'

export const localeNames: Record<Locale, string> = {
  uk: 'UA',
  pl: 'PL',
  en: 'EN',
}

export const localeHtmlLang: Record<Locale, string> = {
  uk: 'uk',
  pl: 'pl',
  en: 'en',
}

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}
