import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ContactModalProvider } from '../components/ContactModalContext'
import HtmlLang from '../components/HtmlLang'
import { LocaleProvider } from '../../i18n/LocaleProvider'
import { getDictionary } from '../../i18n/getDictionary'
import { isLocale, locales, type Locale } from '../../i18n/config'
import { buildPageMetadata } from '../lib/pageMetadata'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {}
  const locale = params.locale as Locale
  const dict = await getDictionary(locale)

  return buildPageMetadata({
    locale,
    path: '',
    title: dict.seo.defaultTitle,
    description: dict.seo.defaultDescription,
    keywords: dict.seo.keywords,
    ogImageAlt: dict.seo.ogImageAlt,
    absoluteTitle: true,
  })
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!isLocale(params.locale)) notFound()
  const locale = params.locale as Locale
  const dict = await getDictionary(locale)

  return (
    <LocaleProvider locale={locale} dict={dict}>
      <HtmlLang locale={locale} />
      <ContactModalProvider>{children}</ContactModalProvider>
    </LocaleProvider>
  )
}
