import type { Metadata } from 'next'
import { BRAND } from '../../brand'
import { absoluteUrl } from '../../seo'
import { buildPageMetadata } from '../../lib/pageMetadata'
import { getDictionary } from '../../../i18n/getDictionary'
import { isLocale, type Locale } from '../../../i18n/config'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import styles from './page.module.css'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = (isLocale(params.locale) ? params.locale : 'uk') as Locale
  const dict = await getDictionary(locale)
  return buildPageMetadata({
    locale,
    path: '/polityka-konfidentsiynosti',
    title: dict.privacy.metaTitle,
    description: dict.privacy.metaDescription,
    keywords: dict.privacy.keywords,
    ogImageAlt: dict.seo.ogImageAlt,
  })
}

export default async function PrivacyPolicyPage({ params }: { params: { locale: string } }) {
  const locale = (isLocale(params.locale) ? params.locale : 'uk') as Locale
  const dict = await getDictionary(locale)
  const siteUrl = absoluteUrl(`/${locale}`)
  const s1Body = dict.privacy.s1Body
    .replace('{brand}', BRAND.name)
    .replace('{url}', siteUrl)

  return (
    <>
      <Navbar />
      <main id="main-content" className={styles.page}>
        <header className={styles.header}>
          <h1>{dict.privacy.heading}</h1>
          <p className={styles.updated}>{dict.privacy.updated}</p>
        </header>

        <article className={styles.content}>
          <section>
            <h2>{dict.privacy.s1Title}</h2>
            <p>{s1Body}</p>
          </section>

          <section>
            <h2>{dict.privacy.s2Title}</h2>
            <p>{dict.privacy.s2Intro}</p>
            <ul>
              {dict.privacy.s2Items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2>{dict.privacy.s3Title}</h2>
            <p>{dict.privacy.s3Intro}</p>
            <ul>
              {dict.privacy.s3Items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2>{dict.privacy.s4Title}</h2>
            <p>{dict.privacy.s4Body}</p>
          </section>

          <section>
            <h2>{dict.privacy.s5Title}</h2>
            <p>{dict.privacy.s5Body}</p>
          </section>

          <section>
            <h2>{dict.privacy.s6Title}</h2>
            <p>{dict.privacy.s6Intro}</p>
            <ul>
              {dict.privacy.s6Items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2>{dict.privacy.s7Title}</h2>
            <p>
              {dict.privacy.s7Intro}
              <br />
              <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
              <br />
              {BRAND.address}, {BRAND.city}
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  )
}
