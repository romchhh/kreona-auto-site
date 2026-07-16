'use client'
import Image from 'next/image'
import { useEffect, useId, useState } from 'react'
import { TYPE_SERVICE_PAGES, type TypeServicePageId } from '../../data/typeServicePages'
import { useDictionary } from '../../../i18n/LocaleProvider'
import { SectionHeading } from '../sections/SectionHeading'
import SelectionForm, { type SelectionPrefill } from '../selection/SelectionForm'
import modalStyles from '../ContactModal.module.css'
import selectionStyles from '../selection/selection.module.css'
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

  useEffect(() => {
    if (!prefill) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPrefill(null)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
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
      <section className={styles.hero} aria-labelledby="type-service-title">
        <div className={styles.heroBg} aria-hidden="true">
          <Image
            src={config.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.heroBgImage}
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <h1 id="type-service-title" className={styles.heroTitle}>
              {copy.titleBefore}
              <em>{copy.titleEm}</em>
            </h1>
            <p className={styles.heroLead}>{copy.lead}</p>
            <button type="button" className={styles.heroCta} onClick={() => openForm()}>
              {copy.cta}
              <span className={styles.heroCtaIcon} aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12 L12 2 M5 2 H12 V9" />
                </svg>
              </span>
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
            {config.typeKeys.map((key) => (
              <li key={key}>
                <button type="button" className={styles.typeBtn} onClick={() => openForm(key)}>
                  <span className={styles.typeName}>{dict.selectionPage.types[key]}</span>
                  <span className={styles.typeArrow} aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 14 L14 2 M6 2 H14 V10" />
                    </svg>
                  </span>
                </button>
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
