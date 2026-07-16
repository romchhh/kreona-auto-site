'use client'
import { useState } from 'react'
import { useDictionary } from '../../../i18n/LocaleProvider'
import { useContactModal } from '../ContactModalContext'
import { SectionHeading } from './SectionHeading'
import styles from './sections.module.css'

export default function FaqSection() {
  const dict = useDictionary()
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const { openForm } = useContactModal()

  return (
    <section id="faq" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.faqLayout}>
          <div className={styles.faqIntro}>
            <SectionHeading
              title={<>{dict.faq.titleBefore}<em>{dict.faq.titleEm}</em></>}
            />
            <div className={styles.faqHelp}>
              <p className={styles.faqHelpLabel}>{dict.faq.helpLabel}</p>
              <p className={styles.faqHelpText}>{dict.faq.helpText}</p>
              <button type="button" className={styles.faqHelpBtn} onClick={() => openForm()}>
                {dict.faq.helpCta}
                <span className={styles.faqHelpBtnIcon} aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12 L12 2 M5 2 H12 V9" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          <div className={styles.faqList}>
            {dict.faq.items.map(({ question, answer }, index) => {
              const isOpen = openIndex === index
              const number = String(index + 1).padStart(2, '0')

              return (
                <div
                  key={question}
                  className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''}`}
                >
                  <button
                    type="button"
                    className={styles.faqQuestion}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span className={styles.faqNumber}>{number}</span>
                    <span className={styles.faqQuestionText}>{question}</span>
                    <span className={styles.faqIcon} aria-hidden="true">
                      <svg width="14" height="10" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 1.5 L6 6.5 L11 1.5" />
                      </svg>
                    </span>
                  </button>
                  <div className={styles.faqAnswer}>
                    <div className={styles.faqAnswerInner}>
                      <p>{answer}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
