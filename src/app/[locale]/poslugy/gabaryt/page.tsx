import type { Metadata } from 'next'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import TypeServicePageContent from '../../../components/typeService/TypeServicePageContent'
import OrderCarsSection from '../../../components/sections/OrderCarsSection'
import { BreadcrumbJsonLd, ServiceJsonLd } from '../../../components/JsonLd'
import { buildPageMetadata } from '../../../lib/pageMetadata'
import { getDictionary } from '../../../../i18n/getDictionary'
import { isLocale, type Locale } from '../../../../i18n/config'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const locale = (isLocale((await params).locale) ? (await params).locale : 'uk') as Locale
  const dict = await getDictionary(locale)
  return buildPageMetadata({
    locale,
    path: '/poslugy/gabaryt',
    title: dict.oversizedPage.metaTitle,
    description: dict.oversizedPage.metaDescription,
    keywords: dict.oversizedPage.keywords,
    ogImageAlt: dict.oversizedPage.imageAlt,
  })
}

export default async function OversizedTransportPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = (isLocale((await params).locale) ? (await params).locale : 'uk') as Locale
  const dict = await getDictionary(locale)

  return (
    <>
      <ServiceJsonLd
        locale={locale}
        name={dict.oversizedPage.metaTitle.replace(/ - KREONA$/, '')}
        description={dict.oversizedPage.metaDescription}
        path="/poslugy/gabaryt"
        serviceType="Oversized and special equipment import"
        image="/services/velykogabarytnyy-transport.jpg"
      />
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          {
            name: dict.selectionPage.categories.oversized,
            path: '/poslugy/gabaryt',
          },
        ]}
      />
      <Navbar transparent />
      <main id="main-content">
        <TypeServicePageContent pageId="oversized" />
        <OrderCarsSection variant="transport" />
      </main>
      <Footer />
    </>
  )
}
