'use client'
import { useEffect } from 'react'
import { useDictionary } from '../../i18n/LocaleProvider'
import ContactForm from './ContactForm'
import formStyles from './ContactSection.module.css'
import type { CarInquiry } from '../lib/carInquiry'
import styles from './ContactModal.module.css'

type ContactModalProps = {
  open: boolean
  onClose: () => void
  inquiryCar: CarInquiry | null
}

export default function ContactModal({ open, onClose, inquiryCar }: ContactModalProps) {
  const dict = useDictionary()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div
      className={`${styles.overlay} ${open ? styles.open : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      aria-hidden={!open}
    >
      <button type="button" className={styles.backdrop} onClick={onClose} aria-label={dict.common.close} tabIndex={open ? 0 : -1} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 id="contact-modal-title" className={styles.title}>
            {dict.form.title}
          </h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label={dict.common.close}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 4 L20 20 M20 4 L4 20"/>
            </svg>
          </button>
        </div>
        {inquiryCar && (
          <div className={styles.carBanner}>
            <p className={styles.carBannerLabel}>{dict.form.carBanner}</p>
            <p className={styles.carBannerTitle}>{inquiryCar.label}</p>
            <p className={styles.carBannerPrice}>{inquiryCar.price}</p>
          </div>
        )}
        <div className={styles.body}>
          <ContactForm
            key={inquiryCar?.id ?? 'general'}
            idPrefix="modal"
            className={formStyles.modalForm}
            inquiryCar={inquiryCar}
          />
        </div>
      </div>
    </div>
  )
}
