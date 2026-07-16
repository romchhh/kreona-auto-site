import type { Metadata } from 'next'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import SelectionPageContent from '../../../components/selection/SelectionPageContent'
import OrderCarsSection from '../../../components/sections/OrderCarsSection'
import { BreadcrumbJsonLd, ServiceJsonLd } from '../../../components/JsonLd'
import { buildPageMetadata } from '../../../lib/pageMetadata'
import { getDictionary } from '../../../../i18n/getDictionary'
import { isLocale, type Locale } from '../../../../i18n/config'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = (isLocale(params.locale) ? params.locale : 'uk') as Locale
  const dict = await getDictionary(locale)
  return buildPageMetadata({
    locale,
    path: '/poslugy/pidbir-avtomobilya',
    title: dict.selectionPage.metaTitle,
    description: dict.selectionPage.metaDescription,
    keywords: dict.selectionPage.keywords,
    ogImageAlt: dict.seo.ogImageAlt,
  })
}

export default async function SelectionServicePage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = (isLocale(params.locale) ? params.locale : 'uk') as Locale
  const dict = await getDictionary(locale)

  return (
    <>
      <ServiceJsonLd locale={locale} dict={dict} />
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: dict.nav.services, path: '/#poslugy' },
          { name: dict.nav.selection, path: '/poslugy/pidbir-avtomobilya' },
        ]}
      />
      <Navbar transparent />
      <main id="main-content">
        <SelectionPageContent />
        <OrderCarsSection />
      </main>
      <Footer />
    </>
  )
}
