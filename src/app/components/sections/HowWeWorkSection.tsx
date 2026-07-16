'use client'
import { PROCESS_ICONS } from '../../data/homeSections'
import { useDictionary } from '../../../i18n/LocaleProvider'
import { SectionHeading } from './SectionHeading'
import styles from './sections.module.css'

type ProcessIcon = (typeof PROCESS_ICONS)[number]

function StepIcon({ type }: { type: ProcessIcon }) {
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
          <circle cx="15.5" cy="15.5" r="3" />
          <path d="M17.6 17.6 L20 20" />
        </svg>
      )
    case 'gavel':
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
    case 'wrench':
      return (
        <svg {...props}>
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-2.5 2.5-2.5z" />
        </svg>
      )
    case 'customs':
      return (
        <svg {...props}>
          <path d="M4 20V8l8-4 8 4v12" />
          <path d="M9 20v-6h6v6" />
          <path d="M4 20h16" />
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

export default function HowWeWorkSection() {
  const dict = useDictionary()

  return (
    <section id="yak-pratsyuyemo" className={`${styles.section} ${styles.processSection}`}>
      <div className={styles.inner}>
        <div className={styles.processIntro}>
          <SectionHeading
            title={<>{dict.process.titleBefore}<em>{dict.process.titleEm}</em></>}
            lead={dict.process.lead}
          />
        </div>

        <ol className={styles.processTimeline}>
          {dict.process.steps.map((step, index) => (
            <li key={step.title} className={styles.processStep}>
              <div className={styles.processMarker}>
                <span className={styles.processIcon}>
                  <StepIcon type={PROCESS_ICONS[index]} />
                </span>
              </div>
              <div className={styles.processBody}>
                <p className={styles.processLabel}>{`${dict.process.step} ${String(index + 1).padStart(2, '0')}`}</p>
                <h3 className={styles.processTitle}>{step.title}</h3>
                <p className={styles.processDesc}>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
