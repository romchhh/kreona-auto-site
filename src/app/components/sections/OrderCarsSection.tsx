'use client'
import Image from 'next/image'
import { useDictionary } from '../../../i18n/LocaleProvider'
import { useContactModal } from '../ContactModalContext'
import { SectionHeading } from './SectionHeading'
import styles from './sections.module.css'

export default function OrderCarsSection() {
  const dict = useDictionary()
  const { openForm } = useContactModal()

  return (
    <section id="pid-zamovlennya" className={`${styles.section} ${styles.orderSection}`}>
      <div className={styles.inner}>
        <div className={styles.orderCard}>
          <div className={styles.orderCopy}>
            <SectionHeading
              title={<>{dict.order.titleBefore}<em>{dict.order.titleEm}</em></>}
              lead={dict.order.lead}
            />
            <button type="button" className={styles.orderCta} onClick={() => openForm()}>
              {dict.order.cta}
              <span className={styles.orderCtaIcon} aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12 L12 2 M5 2 H12 V9" />
                </svg>
              </span>
            </button>
          </div>

          <div className={styles.orderVisual}>
            <Image
              src="/order-car.png"
              alt={dict.order.imageAlt}
              fill
              sizes="(max-width: 768px) 90vw, 48vw"
              className={styles.orderCar}
              priority={false}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
