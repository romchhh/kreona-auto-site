'use client'
import Image from 'next/image'
import { BRAND } from '../brand'
import { useDictionary } from '../../i18n/LocaleProvider'
import ContactForm from './ContactForm'
import ContactMethodsList from './ContactMethodsList'
import { SectionHeading } from './sections/SectionHeading'
import styles from './ContactSection.module.css'

export default function ContactSection() {
  const dict = useDictionary()

  return (
    <section id="kontakt" className={styles.section}>
      <div className={styles.inner}>
        <SectionHeading
          title={<>{dict.contactSection.titleBefore}<em>{dict.contactSection.titleEm}</em></>}
          lead={dict.contactSection.lead}
        />

        <p className={styles.contactNote}>{dict.contactSection.note}</p>

        <div className={styles.panel}>
          <div className={styles.visual}>
            <Image
              src={BRAND.heroDesktop}
              alt={dict.contactSection.imageAlt}
              fill
              sizes="(max-width: 900px) 100vw, 48vw"
              className={styles.img}
            />
            <div className={styles.visualOverlay} aria-hidden="true" />
            <div className={styles.visualContent}>
              <ContactMethodsList />
            </div>
          </div>

          <div className={styles.formCard}>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
