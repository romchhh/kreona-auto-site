'use client'
import Image from 'next/image'
import { useEffect, useId, useState } from 'react'
import {
  SELECTION_BENEFIT_IDS,
  SELECTION_CATEGORIES,
  SELECTION_PROCESS_IDS,
  type SelectionCategoryId,
} from '../../data/selectionPage'
import { getBrandLogo } from '../../data/brandLogos'
import { BRAND } from '../../brand'
import { phoneTel } from '../../seo'
import { useDictionary } from '../../../i18n/LocaleProvider'
import { useContactModal } from '../ContactModalContext'
import { SectionHeading } from '../sections/SectionHeading'
import SelectionForm, { type SelectionPrefill } from './SelectionForm'
import styles from './selection.module.css'
import heroStyles from '../Hero.module.css'
import modalStyles from '../ContactModal.module.css'
import sectionStyles from '../sections/sections.module.css'

const SELECTION_BENEFIT_ICONS = [
  'cars',
  'history',
  'photos',
  'pricing',
  'support',
] as const

type BenefitIcon = (typeof SELECTION_BENEFIT_ICONS)[number]
type PanelMode = 'brands' | 'types' | 'form'

function BenefitIconMark({ type }: { type: BenefitIcon }) {
  const props = {
    width: 40,
    height: 40,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  }

  switch (type) {
    case 'cars':
      return (
        <svg {...props}>
          <path d="M4 14l2-5h12l2 5" />
          <path d="M5 14h14v4H5z" />
          <circle cx="8" cy="18" r="1.5" />
          <circle cx="16" cy="18" r="1.5" />
          <path d="M7 9l1.5-2h7L17 9" />
        </svg>
      )
    case 'history':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
          <path d="M8.5 12.5 L11 15 L16 9.5" />
        </svg>
      )
    case 'photos':
      return (
        <svg {...props}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <circle cx="12" cy="12" r="3" />
          <path d="M7 6l1.5-2h7L17 6" />
        </svg>
      )
    case 'pricing':
      return (
        <svg {...props}>
          <path d="M7 3h7l4 4v14H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
          <path d="M14 3v4h4M9 12h6M9 16h4" />
        </svg>
      )
    case 'support':
      return (
        <svg {...props}>
          <path d="M12 21a8 8 0 1 0-8-8v3" />
          <path d="M4 16h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H4" />
          <path d="M20 16h-3a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h3" />
        </svg>
      )
  }
}

const SELECTION_ICONS = [
  'form',
  'chat',
  'search',
  'doc',
  'send',
  'check',
  'buy',
  'ship',
  'key',
] as const

type SelectionIcon = (typeof SELECTION_ICONS)[number]

function StepIcon({ type }: { type: SelectionIcon }) {
  const props = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  }

  switch (type) {
    case 'form':
      return (
        <svg {...props}>
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <path d="M9 8h6M9 12h6M9 16h3" />
        </svg>
      )
    case 'chat':
      return (
        <svg {...props}>
          <path d="M4 6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H10l-4 4v-4H7a3 3 0 0 1-3-3V6z" />
        </svg>
      )
    case 'search':
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16.5 16.5 L21 21" />
        </svg>
      )
    case 'doc':
      return (
        <svg {...props}>
          <path d="M7 3h7l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
          <path d="M14 3v4h4M9 12h6M9 16h4" />
        </svg>
      )
    case 'send':
      return (
        <svg {...props}>
          <path d="M4 12 L20 4 12 20 10 14 4 12z" />
        </svg>
      )
    case 'check':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
          <path d="M8.5 12.5 L11 15l4.5-5" />
        </svg>
      )
    case 'buy':
      return (
        <svg {...props}>
          <path d="M14 4l6 6-3 3-6-6 3-3z" />
          <path d="M11 10 L4 17" />
          <path d="M3 20h8" />
        </svg>
      )
    case 'ship':
      return (
        <svg {...props}>
          <path d="M3 16l9 4 9-4" />
          <path d="M5 16V10h14v6" />
          <path d="M8 10V7h3v3M13 10V6h3v4" />
          <path d="M3 16c1.5 2 4 3 9 3s7.5-1 9-3" />
        </svg>
      )
    case 'key':
      return (
        <svg {...props}>
          <circle cx="8" cy="10" r="4" />
          <path d="M11.5 12.5 L20 21 M17 18l2.5 2.5 M15 16l2 2" />
        </svg>
      )
  }
}

export default function SelectionPageContent() {
  const dict = useDictionary()
  const page = dict.selectionPage
  const { openForm: openContactForm } = useContactModal()
  const panelTitleId = useId()
  const [activeId, setActiveId] = useState<SelectionCategoryId | null>(null)
  const [panelMode, setPanelMode] = useState<PanelMode>('brands')
  const [prefill, setPrefill] = useState<SelectionPrefill | null>(null)

  const active = SELECTION_CATEGORIES.find((item) => item.id === activeId) ?? null

  const closePanel = () => {
    setActiveId(null)
    setPrefill(null)
    setPanelMode('brands')
  }

  useEffect(() => {
    if (!activeId) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [activeId])

  const openCategory = (id: SelectionCategoryId) => {
    const category = SELECTION_CATEGORIES.find((item) => item.id === id)
    if (!category) return
    setActiveId(id)
    setPanelMode(category.mode === 'types' ? 'types' : 'brands')
    setPrefill(null)
  }

  const openSelectionForm = (next: SelectionPrefill) => {
    setPrefill(next)
    setPanelMode('form')
  }

  const categoryLabel = (id: SelectionCategoryId) => page.categories[id]
  const ctaLabel = (key: 'ctaRequest' | 'ctaOrder' | 'ctaElectric') => page[key]

  return (
    <>
      <section id="hero" className={heroStyles.hero} aria-labelledby="selection-hero-title">
        <div className={heroStyles.bg} aria-hidden="true">
          <Image
            src="/services/pidbir.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className={`${heroStyles.bgImage} ${heroStyles.bgDesktop}`}
          />
          <Image
            src="/services/pidbir.png"
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
            <h1 id="selection-hero-title" className={heroStyles.headline}>
              {page.titleBefore}
              <em>{page.titleEm}</em>
            </h1>
            <p className={heroStyles.subheadline}>{page.lead}</p>
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

            <button type="button" className={heroStyles.card} onClick={() => openContactForm()}>
              <div className={heroStyles.cardText}>
                <p className={heroStyles.cardTitle}>{dict.hero.ctaTitle}</p>
                <p className={heroStyles.cardSub}>{dict.hero.ctaSub}</p>
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

      <section id="categories" className={styles.section}>
        <div className={styles.inner}>
          <SectionHeading
            title={
              <>
                {page.categoriesTitleBefore}
                <em>{page.categoriesTitleEm}</em>
              </>
            }
          />
          <div className={styles.categoryList}>
            {SELECTION_CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                className={styles.categoryCard}
                onClick={() => openCategory(category.id)}
              >
                <div className={styles.categoryMedia} aria-hidden="true">
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className={`${styles.categoryImage}${'flip' in category && category.flip ? ` ${styles.categoryImageFlip}` : ''}`}
                  />
                </div>
                <div className={styles.categoryFooter}>
                  <h2 className={styles.categoryName}>{categoryLabel(category.id)}</h2>
                  <span className={styles.categoryCta} aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 14 L14 2 M6 2 H14 V10" />
                    </svg>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={`${sectionStyles.section} ${sectionStyles.processSection}`}>
        <div className={sectionStyles.inner}>
          <div className={sectionStyles.processIntro}>
            <SectionHeading
              title={
                <>
                  {page.processTitleBefore}
                  <em>{page.processTitleEm}</em>
                </>
              }
            />
          </div>
          <ol className={sectionStyles.processTimeline}>
            {SELECTION_PROCESS_IDS.map((id, index) => (
              <li key={id} className={sectionStyles.processStep}>
                <div className={sectionStyles.processMarker}>
                  <span className={sectionStyles.processIcon}>
                    <StepIcon type={SELECTION_ICONS[index]} />
                  </span>
                </div>
                <div className={sectionStyles.processBody}>
                  <p className={sectionStyles.processLabel}>
                    {`${dict.process.step} ${String(index + 1).padStart(2, '0')}`}
                  </p>
                  <h3 className={sectionStyles.processTitle}>{page.process[id]}</h3>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${sectionStyles.section} ${sectionStyles.whySection}`}>
        <div className={sectionStyles.inner}>
          <div className={sectionStyles.whyHeader}>
            <SectionHeading
              title={
                <>
                  {page.benefitsTitleBefore}
                  <em>{page.benefitsTitleEm}</em>
                </>
              }
              lead={page.benefitsLead}
            />
          </div>

          <div className={sectionStyles.whyLayout}>
            {(() => {
              const [featuredId, ...restIds] = SELECTION_BENEFIT_IDS
              const [featuredIcon, ...restIcons] = SELECTION_BENEFIT_ICONS
              const featured = page.benefits[featuredId]

              return (
                <>
                  <article className={sectionStyles.whyFeatured}>
                    <span className={sectionStyles.whyIcon} aria-hidden="true">
                      <BenefitIconMark type={featuredIcon} />
                    </span>
                    <div className={sectionStyles.whyFeaturedCopy}>
                      <h3 className={sectionStyles.whyTitle}>{featured.title}</h3>
                      <p className={sectionStyles.whyText}>{featured.description}</p>
                    </div>
                  </article>

                  <div className={`${sectionStyles.whyGrid} ${sectionStyles.whyGridFour}`}>
                    {restIds.map((id, index) => (
                      <article key={id} className={sectionStyles.whyCard}>
                        <span className={sectionStyles.whyIcon} aria-hidden="true">
                          <BenefitIconMark type={restIcons[index]} />
                        </span>
                        <div className={sectionStyles.whyCopy}>
                          <h3 className={sectionStyles.whyTitle}>{page.benefits[id].title}</h3>
                          <p className={sectionStyles.whyText}>{page.benefits[id].description}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      </section>

      {active && (
        <div
          className={`${modalStyles.overlay} ${modalStyles.open}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={panelTitleId}
        >
          <button
            type="button"
            className={modalStyles.backdrop}
            aria-label={dict.common.close}
            onClick={closePanel}
          />
          <div className={modalStyles.modal}>
            <div className={modalStyles.header}>
              <h2 id={panelTitleId} className={modalStyles.title}>
                {panelMode === 'form' ? page.form.title : categoryLabel(active.id)}
              </h2>
              <button
                type="button"
                className={modalStyles.close}
                onClick={closePanel}
                aria-label={dict.common.close}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M4 4 L20 20 M20 4 L4 20" />
                </svg>
              </button>
            </div>

            {panelMode === 'brands' && active.mode === 'brands' && (
              <div className={`${modalStyles.body} ${styles.panelStack}`}>
                <p className={styles.panelLead}>{page.brandsTitle}</p>
                <div className={styles.brandGrid}>
                  {active.brands.map((brand) => {
                    const logo = getBrandLogo(brand)
                    return (
                      <button
                        key={brand}
                        type="button"
                        className={styles.brandBtn}
                        onClick={() =>
                          openSelectionForm({
                            categoryId: active.id,
                            categoryLabel: categoryLabel(active.id),
                            brand,
                          })
                        }
                      >
                        {logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={logo} alt="" className={styles.brandLogo} />
                        ) : (
                          <span className={styles.brandLogoFallback} aria-hidden="true">
                            {brand.slice(0, 1)}
                          </span>
                        )}
                        <span className={styles.brandName}>{brand}</span>
                      </button>
                    )
                  })}
                  {active.hasOthers && (
                    <button
                      type="button"
                      className={styles.brandBtn}
                      onClick={() =>
                        openSelectionForm({
                          categoryId: active.id,
                          categoryLabel: categoryLabel(active.id),
                          brand: page.others,
                        })
                      }
                    >
                      <span className={styles.brandLogoFallback} aria-hidden="true">
                        +
                      </span>
                      <span className={styles.brandName}>{page.others}</span>
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  className={styles.panelCta}
                  onClick={() =>
                    openSelectionForm({
                      categoryId: active.id,
                      categoryLabel: categoryLabel(active.id),
                    })
                  }
                >
                  {ctaLabel(active.ctaKey)}
                </button>
              </div>
            )}

            {panelMode === 'types' && active.mode === 'types' && (
              <div className={`${modalStyles.body} ${styles.panelStack}`}>
                <p className={styles.panelLead}>
                  {active.id === 'water' ? page.waterLead : page.oversizedLead}
                </p>
                <p className={styles.panelSub}>{page.typesTitle}</p>
                <div className={styles.brandGrid}>
                  {active.typeKeys.map((key) => (
                    <button
                      key={key}
                      type="button"
                      className={styles.brandBtn}
                      onClick={() =>
                        openSelectionForm({
                          categoryId: active.id,
                          categoryLabel: categoryLabel(active.id),
                          typeLabel: page.types[key],
                          brand: page.types[key],
                        })
                      }
                    >
                      {page.types[key]}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className={styles.panelCta}
                  onClick={() =>
                    openSelectionForm({
                      categoryId: active.id,
                      categoryLabel: categoryLabel(active.id),
                    })
                  }
                >
                  {ctaLabel(active.ctaKey)}
                </button>
              </div>
            )}

            {panelMode === 'form' && prefill && (
              <div className={modalStyles.body}>
                <SelectionForm
                  key={`${prefill.categoryId}-${prefill.brand ?? ''}-${prefill.typeLabel ?? ''}`}
                  prefill={prefill}
                  onClose={closePanel}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
