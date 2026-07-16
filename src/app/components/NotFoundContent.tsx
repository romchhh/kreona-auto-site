'use client'
import Link from 'next/link'
import Navbar from './Navbar'
import Footer from './Footer'
import { useDictionary, useLocale } from '../../i18n/LocaleProvider'
import { localePath } from '../../i18n/paths'
import styles from './NotFoundContent.module.css'

export default function NotFoundContent() {
  const dict = useDictionary()
  const locale = useLocale()

  return (
    <>
      <Navbar />
      <main id="main-content" className={styles.main}>
        <div className={styles.inner}>
          <p className={styles.code}>{dict.notFound.code}</p>
          <h1 className={styles.heading}>{dict.notFound.heading}</h1>
          <p className={styles.text}>{dict.notFound.text}</p>
          <div className={styles.actions}>
            <Link href={localePath(locale)} className={styles.primary}>
              {dict.notFound.home}
            </Link>
            <Link href={localePath(locale, '/kontakty')} className={styles.secondary}>
              {dict.notFound.contacts}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
