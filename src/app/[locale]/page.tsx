import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import HomeSections from '../components/HomeSections'
import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'
import JsonLd from '../components/JsonLd'
import { getPublishedCarsForLocale } from '../lib/cars'
import { getDictionary } from '../../i18n/getDictionary'
import { isLocale, type Locale } from '../../i18n/config'

export const dynamic = 'force-dynamic'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = (isLocale((await params).locale) ? (await params).locale : 'uk') as Locale
  const dict = await getDictionary(locale)
  const cars = await getPublishedCarsForLocale(locale)

  return (
    <>
      <JsonLd locale={locale} dict={dict} />
      <Navbar transparent />
      <main id="main-content">
        <Hero />
        <HomeSections cars={cars} />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
