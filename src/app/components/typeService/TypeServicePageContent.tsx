'use client'
import Image from 'next/image'
import { useEffect, useId, useState } from 'react'
import { BRAND } from '../../brand'
import { TYPE_IMAGES, TYPE_SERVICE_PAGES, type TypeServicePageId } from '../../data/typeServicePages'
import { phoneTel } from '../../seo'
import { useDictionary } from '../../../i18n/LocaleProvider'
import { SectionHeading } from '../sections/SectionHeading'
import SelectionForm, { type SelectionPrefill } from '../selection/SelectionForm'
import modalStyles from '../ContactModal.module.css'
import heroStyles from '../Hero.module.css'
import selectionStyles from '../selection/selection.module.css'
import sectionStyles from '../sections/sections.module.css'
import { useBodyScrollLock } from '../../lib/useBodyScrollLock'
import styles from './typeService.module.css'

const PROCESS_KEYS = ['brief', 'search', 'check', 'delivery'] as const
const BENEFIT_KEYS = ['markets', 'care', 'turnkey'] as const

type Props = {
  pageId: TypeServicePageId
}

export default function TypeServicePageContent({ pageId }: Props) {
  const dict = useDictionary()
  const config = TYPE_SERVICE_PAGES[pageId]
  const copy = pageId === 'water' ? dict.waterPage : dict.oversizedPage
  const categoryLabel = dict.selectionPage.categories[config.id]
  const formTitleId = useId()
  const [prefill, setPrefill] = useState<SelectionPrefill | null>(null)

  useBodyScrollLock(Boolean(prefill))

  useEffect(() => {
    if (!prefill) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPrefill(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prefill])

  const openForm = (typeKey?: (typeof config.typeKeys)[number]) => {
    setPrefill({
      categoryId: config.id,
      categoryLabel,
      typeLabel: typeKey ? dict.selectionPage.types[typeKey] : undefined,
      brand: typeKey ? dict.selectionPage.types[typeKey] : undefined,
    })
  }

  return (
    <>
      <section id="hero" className={heroStyles.hero} aria-labelledby="type-service-title">
        <div className={heroStyles.bg} aria-hidden="true">
          <Image
            src={config.image}
            alt={copy.imageAlt}
            fill
            priority
            sizes="100vw"
            className={`${heroStyles.bgImage} ${heroStyles.bgDesktop}`}
          />
          <Image
            src={config.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className={`${heroStyles.bgImage} ${heroStyles.bgMobile}`}
          />
        </div>
        <div className={heroStyles.overlay} />

        <div className={heroStyles.body}>
          <div className={heroStyles.copy}>
            <h1 id="type-service-title" className={heroStyles.headline}>
              {copy.titleBefore}
              <em>{copy.titleEm}</em>
            </h1>
            <p className={heroStyles.subheadline}>{copy.lead}</p>
          </div>

          <div className={heroStyles.bottomRow}>
            <div className={heroStyles.contact}>
              {BRAND.phones.map((phone) => (
                <div key={phone} className={heroStyles.phoneGroup}>
                  <a className={heroStyles.phone} href={`tel:${phoneTel(phone)}`}>
                    {phone}
                  </a>
                  <a
                    className={heroStyles.whatsappLink}
                    href={`https://wa.me/${phoneTel(phone).replace('+', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${dict.hero.whatsappAria}: ${phone}`}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M20.52 3.48A11.77 11.77 0 0 0 12.05 0C5.5 0 .17 5.33.17 11.88c0 2.09.55 4.14 1.59 5.95L0 24l6.35-1.66a11.83 11.83 0 0 0 5.69 1.45h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.23-6.14-3.41-8.43Zm-8.47 18.3h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.77.99 1.01-3.68-.24-.38a9.85 9.85 0 0 1-1.51-5.24c0-5.45 4.44-9.89 9.9-9.89a9.8 9.8 0 0 1 7.01 2.91 9.83 9.83 0 0 1 2.89 7c0 5.46-4.44 9.9-9.88 9.9Zm5.43-7.43c-.3-.15-1.76-.87-2.04-.96-.27-.1-.47-.15-.67.15-.2.3-.76.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.45-.88-.79-1.47-1.76-1.64-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.08-.79.38-.27.3-1.03 1-1.03 2.44s1.05 2.82 1.2 3.02c.15.2 2.06 3.15 4.99 4.42.7.3 1.24.48 1.67.61.7.22 1.34.19 1.85.12.56-.08 1.76-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
                    </svg>
                    {dict.common.whatsapp}
                  </a>
                </div>
              ))}
              <address className={heroStyles.address}>
                {BRAND.address}
                <br />
                {BRAND.city}
              </address>
            </div>

            <button type="button" className={heroStyles.card} onClick={() => openForm()}>
              <div className={heroStyles.cardText}>
                <p className={heroStyles.cardTitle}>{copy.ctaTitle}</p>
                <p className={heroStyles.cardSub}>{copy.ctaSub}</p>
              </div>
              <div className={heroStyles.cardArrow}>
                <svg width="22" height="22" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 14 L14 2 M6 2 H14 V10" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </section>

      <section className={styles.aboutSection}>
        <div className={styles.aboutInner}>
          <SectionHeading
            title={
              <>
                {copy.aboutTitleBefore}
                <em>{copy.aboutTitleEm}</em>
              </>
            }
            lead={copy.about}
          />
        </div>
      </section>

      <section className={styles.typesSection} aria-labelledby="type-list-title">
        <div className={styles.typesInner}>
          <SectionHeading
            title={
              <>
                {copy.typesTitleBefore}
                <em>{copy.typesTitleEm}</em>
              </>
            }
          />
          <ul className={styles.typeList}>
            {config.typeKeys.map((key, index) => (
              <li
                key={key}
                className={`${sectionStyles.serviceCard} ${
                  index % 2 === 0 ? sectionStyles.servicePhoto : sectionStyles.servicePhotoAlt
                } ${styles.typeCardFit}`}
              >
                <div className={sectionStyles.serviceMedia}>
                  <Image
                    src={TYPE_IMAGES[key]}
                    alt={dict.selectionPage.types[key]}
                    fill
                    sizes="(max-width: 900px) 100vw, 25vw"
                    className={sectionStyles.serviceImage}
                  />
                </div>
                <div className={sectionStyles.serviceBody}>
                  <h3 className={sectionStyles.serviceTitle}>{dict.selectionPage.types[key]}</h3>
                  <p className={sectionStyles.serviceText}>
                    {(copy.typeDescriptions as Record<string, string>)[key]}
                  </p>
                  <button type="button" className={sectionStyles.serviceBtn} onClick={() => openForm(key)}>
                    {copy.orderCta}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M2 12 L12 2 M5 2 H12 V9" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.processSection}>
        <div className={styles.sectionInner}>
          <SectionHeading
            title={
              <>
                {copy.processTitleBefore}
                <em>{copy.processTitleEm}</em>
              </>
            }
          />
          <ol className={styles.processList}>
            {PROCESS_KEYS.map((key, index) => (
              <li key={key} className={styles.processItem}>
                <span className={styles.processNum}>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className={styles.processTitle}>{copy.process[key].title}</h3>
                  <p className={styles.processText}>{copy.process[key].text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.benefitsSection}>
        <div className={styles.sectionInner}>
          <SectionHeading
            title={
              <>
                {copy.benefitsTitleBefore}
                <em>{copy.benefitsTitleEm}</em>
              </>
            }
          />
          <div className={styles.benefitsGrid}>
            {BENEFIT_KEYS.map((key) => (
              <article key={key} className={styles.benefitCard}>
                <h3 className={styles.benefitTitle}>{copy.benefits[key].title}</h3>
                <p className={styles.benefitText}>{copy.benefits[key].text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.midCtaSection}>
        <div className={styles.midCtaInner}>
          <div className={styles.midCtaCopy}>
            <h2 className={styles.midCtaTitle}>{copy.midCtaTitle}</h2>
            <p className={styles.midCtaText}>{copy.midCtaText}</p>
          </div>
          <button type="button" className={styles.midCtaBtn} onClick={() => openForm()}>
            {copy.cta}
          </button>
        </div>
      </section>

      {prefill && (
        <div
          className={`${modalStyles.overlay} ${modalStyles.open}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={formTitleId}
        >
          <button
            type="button"
            className={modalStyles.backdrop}
            aria-label={dict.common.close}
            onClick={() => setPrefill(null)}
          />
          <div className={modalStyles.modal}>
            <div className={modalStyles.header}>
              <h2 id={formTitleId} className={modalStyles.title}>
                {dict.selectionPage.form.title}
              </h2>
              <button
                type="button"
                className={modalStyles.close}
                aria-label={dict.common.close}
                onClick={() => setPrefill(null)}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M4 4 L14 14 M14 4 L4 14" />
                </svg>
              </button>
            </div>
            <div className={`${modalStyles.body} ${selectionStyles.panelStack}`}>
              <SelectionForm
                key={`${prefill.categoryId}-${prefill.brand ?? ''}-${prefill.typeLabel ?? ''}`}
                prefill={prefill}
                onClose={() => setPrefill(null)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
