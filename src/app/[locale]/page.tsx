import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import HomeSections from '../components/HomeSections'
import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'
import JsonLd from '../components/JsonLd'
import { getDictionary } from '../../i18n/getDictionary'
import { isLocale, type Locale } from '../../i18n/config'

export default async function HomePage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = (isLocale(params.locale) ? params.locale : 'uk') as Locale
  const dict = await getDictionary(locale)

  return (
    <>
      <JsonLd locale={locale} dict={dict} />
      <Navbar transparent />
      <main id="main-content">
        <Hero />
        <HomeSections />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
