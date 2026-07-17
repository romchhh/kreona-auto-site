import type { Metadata } from 'next'
import Image from 'next/image'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ContactForm from '../../components/ContactForm'
import ContactMethodsList from '../../components/ContactMethodsList'
import { SectionHeading } from '../../components/sections/SectionHeading'
import { BRAND } from '../../brand'
import { buildPageMetadata } from '../../lib/pageMetadata'
import { getDictionary } from '../../../i18n/getDictionary'
import { isLocale, type Locale } from '../../../i18n/config'
import { BreadcrumbJsonLd, ContactJsonLd } from '../../components/JsonLd'
import contactStyles from '../../components/ContactSection.module.css'
import styles from './page.module.css'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const locale = (isLocale((await params).locale) ? (await params).locale : 'uk') as Locale
  const dict = await getDictionary(locale)
  return buildPageMetadata({
    locale,
    path: '/kontakty',
    title: dict.contactsPage.metaTitle,
    description: dict.contactsPage.metaDescription,
    keywords: dict.contactsPage.keywords,
    ogImageAlt: dict.seo.ogImageAlt,
  })
}

export default async function ContactsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (isLocale((await params).locale) ? (await params).locale : 'uk') as Locale
  const dict = await getDictionary(locale)

  return (
    <>
      <ContactJsonLd locale={locale} dict={dict} />
      <BreadcrumbJsonLd
        locale={locale}
        items={[{ name: dict.nav.contacts, path: '/kontakty' }]}
      />
      <Navbar />
      <main id="main-content">
        <section className={`${contactStyles.section} ${styles.page}`}>
          <div className={contactStyles.inner}>
            <SectionHeading
              title={<>{dict.contactSection.titleBefore}<em>{dict.contactSection.titleEm}</em></>}
              lead={dict.contactSection.lead}
            />

            <p className={contactStyles.contactNote}>{dict.contactSection.note}</p>

            <div className={contactStyles.panel}>
              <div className={contactStyles.visual}>
                <Image
                  src={BRAND.heroDesktop}
                  alt={dict.contactsPage.imageAlt}
                  fill
                  sizes="(max-width: 900px) 100vw, 48vw"
                  className={contactStyles.img}
                  priority
                />
                <div className={contactStyles.visualOverlay} aria-hidden="true" />
                <div className={contactStyles.visualContent}>
                  <ContactMethodsList />
                </div>
              </div>

              <div className={contactStyles.formCard}>
                <ContactForm idPrefix="contacts-page" />
              </div>
            </div>

            <section className={styles.mapSection} aria-labelledby="map-heading">
              <div className={styles.mapHeader}>
                <h2 id="map-heading" className="section-heading">{dict.contactsPage.mapHeading}</h2>
                <p className="section-lead">{BRAND.address}, {BRAND.city}</p>
              </div>
              <div className={styles.mapWrap}>
                <iframe
                  title={`${dict.contactsPage.mapTitle} - ${BRAND.name}, ${BRAND.city}`}
                  src={BRAND.mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
