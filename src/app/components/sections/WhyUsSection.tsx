'use client'
import { WHY_ICONS } from '../../data/homeSections'
import { useDictionary } from '../../../i18n/LocaleProvider'
import { SectionHeading } from './SectionHeading'
import styles from './sections.module.css'

type WhyIcon = (typeof WHY_ICONS)[number]

function WhyIconMark({ type }: { type: WhyIcon }) {
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
    case 'experience':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 2" />
        </svg>
      )
    case 'auction':
      return (
        <svg {...props}>
          <path d="M14 4l6 6-3 3-6-6 3-3z" />
          <path d="M11 10 L4 17" />
          <path d="M3 20h8" />
        </svg>
      )
    case 'contract':
      return (
        <svg {...props}>
          <path d="M7 3h7l4 4v14H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
          <path d="M14 3v4h4M9 12h6M9 16h4" />
        </svg>
      )
    case 'check':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
          <path d="M8.5 12.5 L11 15 L16 9.5" />
        </svg>
      )
    case 'media':
      return (
        <svg {...props}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <circle cx="12" cy="12" r="3" />
          <path d="M7 6l1.5-2h7L17 6" />
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
    case 'personal':
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
        </svg>
      )
  }
}

export default function WhyUsSection() {
  const dict = useDictionary()
  const [featured, ...rest] = dict.whyUs.items
  const [featuredIcon, ...restIcons] = WHY_ICONS

  return (
    <section id="chomu-my" className={`${styles.section} ${styles.whySection}`}>
      <div className={styles.inner}>
        <div className={styles.whyHeader}>
          <SectionHeading
            title={<>{dict.whyUs.titleBefore}<em>{dict.whyUs.titleEm}</em></>}
            lead={dict.whyUs.lead}
          />
        </div>

        <div className={styles.whyLayout}>
          <article className={styles.whyFeatured}>
            <span className={styles.whyIcon} aria-hidden="true">
              <WhyIconMark type={featuredIcon} />
            </span>
            <div className={styles.whyFeaturedCopy}>
              <h3 className={styles.whyTitle}>{featured.title}</h3>
              <p className={styles.whyText}>{featured.description}</p>
            </div>
          </article>

          <div className={styles.whyGrid}>
            {rest.map((item, index) => (
              <article key={item.title} className={styles.whyCard}>
                <span className={styles.whyIcon} aria-hidden="true">
                  <WhyIconMark type={restIcons[index]} />
                </span>
                <div className={styles.whyCopy}>
                  <h3 className={styles.whyTitle}>{item.title}</h3>
                  <p className={styles.whyText}>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
