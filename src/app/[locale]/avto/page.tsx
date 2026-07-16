import type { Metadata } from 'next'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import InventoryPageContent from '../../components/inventory/InventoryPageContent'
import OrderCarsSection from '../../components/sections/OrderCarsSection'
import { BreadcrumbJsonLd, InventoryJsonLd } from '../../components/JsonLd'
import { CARS_IN_STOCK } from '../../data/homeSections'
import { buildPageMetadata } from '../../lib/pageMetadata'
import { getDictionary } from '../../../i18n/getDictionary'
import { isLocale, type Locale } from '../../../i18n/config'

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

  return (
    <>
      <InventoryJsonLd locale={locale} dict={dict} cars={CARS_IN_STOCK} />
      <BreadcrumbJsonLd
        locale={locale}
        items={[{ name: dict.nav.inStock, path: '/avto' }]}
      />
      <Navbar />
      <main id="main-content">
        <InventoryPageContent />
        <OrderCarsSection />
      </main>
      <Footer />
    </>
  )
}
