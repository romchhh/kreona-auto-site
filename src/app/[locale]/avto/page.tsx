import type { Metadata } from 'next'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import InventoryPageContent from '../../components/inventory/InventoryPageContent'
import OrderCarsSection from '../../components/sections/OrderCarsSection'
import { BreadcrumbJsonLd, InventoryJsonLd } from '../../components/JsonLd'
import { getPublishedCarsForLocale } from '../../lib/cars'
import { buildPageMetadata } from '../../lib/pageMetadata'
import { getDictionary } from '../../../i18n/getDictionary'
import { isLocale, type Locale } from '../../../i18n/config'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = (isLocale(params.locale) ? params.locale : 'uk') as Locale
  const dict = await getDictionary(locale)
  return buildPageMetadata({
    locale,
    path: '/avto',
    title: dict.inventory.metaTitle,
    description: dict.inventory.metaDescription,
    keywords: dict.inventory.keywords,
    ogImageAlt: dict.seo.ogImageAlt,
  })
}

export default async function InventoryPage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = (isLocale(params.locale) ? params.locale : 'uk') as Locale
  const dict = await getDictionary(locale)
  const cars = await getPublishedCarsForLocale(locale)

  return (
    <>
      <InventoryJsonLd locale={locale} dict={dict} cars={cars} />
      <BreadcrumbJsonLd
        locale={locale}
        items={[{ name: dict.nav.inStock, path: '/avto' }]}
      />
      <Navbar />
      <main id="main-content">
        <InventoryPageContent cars={cars} />
        <OrderCarsSection />
      </main>
      <Footer />
    </>
  )
}
