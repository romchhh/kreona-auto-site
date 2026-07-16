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
  params: { locale: string }
}): Promise<Metadata> {
  const locale = (isLocale(params.locale) ? params.locale : 'uk') as Locale
  const dict = await getDictionary(locale)
  return buildPageMetadata({
    locale,
    path: '/poslugy/vodnyy',
    title: dict.waterPage.metaTitle,
    description: dict.waterPage.metaDescription,
    keywords: dict.waterPage.keywords,
    ogImageAlt: dict.waterPage.imageAlt,
  })
}

export default async function WaterTransportPage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = (isLocale(params.locale) ? params.locale : 'uk') as Locale
  const dict = await getDictionary(locale)

  return (
    <>
      <ServiceJsonLd
        locale={locale}
        name={dict.waterPage.metaTitle.replace(/ - KREONA$/, '')}
        description={dict.waterPage.metaDescription}
        path="/poslugy/vodnyy"
        serviceType="Watercraft selection and import"
        image="/services/types/yacht.jpg"
      />
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          {
            name: dict.selectionPage.categories.water,
            path: '/poslugy/vodnyy',
          },
        ]}
      />
      <Navbar transparent />
      <main id="main-content">
        <TypeServicePageContent pageId="water" />
        <OrderCarsSection variant="transport" />
      </main>
      <Footer />
    </>
  )
}
