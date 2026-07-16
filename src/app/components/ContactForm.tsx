'use client'
import { useState } from 'react'
import { useDictionary, useLocale } from '../../i18n/LocaleProvider'
import { localePath } from '../../i18n/paths'
import { getStoredUtm } from '../lib/utm'
import type { CarInquiry } from '../lib/carInquiry'
import type { Dictionary } from '../../i18n/dictionaries/uk'
import styles from './ContactSection.module.css'

type FormState = {
  name: string
  contact: string
  carSearch: string
  comment: string
  consent: boolean
}
type Status = 'idle' | 'loading' | 'success' | 'error'

type ContactFormProps = {
  idPrefix?: string
  onSuccess?: () => void
  className?: string
  inquiryCar?: CarInquiry | null
}

function buildInitialForm(inquiryCar: CarInquiry | null | undefined, form: Dictionary['form']): FormState {
  return {
    name: '',
    contact: '',
    carSearch: inquiryCar ? `${inquiryCar.label}, ${inquiryCar.price}` : '',
    comment: inquiryCar ? `${form.inquiryComment}: ${inquiryCar.label}` : '',
    consent: false,
  }
}

export default function ContactForm({ idPrefix = '', onSuccess, className, inquiryCar = null }: ContactFormProps) {
  const dict = useDictionary()
  const locale = useLocale()
  const [form, setForm] = useState<FormState>(() => buildInitialForm(inquiryCar, dict.form))
  const [status, setStatus] = useState<Status>('idle')

  const id = (name: string) => (idPrefix ? `${idPrefix}-${name}` : name)

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setForm(f => ({ ...f, [k]: val }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.consent) return

    const name = form.name.trim()
    const contact = form.contact.trim()
    if (!name || !contact) return

    setStatus('loading')

    try {
      const utm = getStoredUtm()
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          contact,
          carSearch: form.carSearch.trim(),
          comment: form.comment.trim(),
          car: inquiryCar ?? undefined,
          utm,
        }),
      })

      if (!response.ok) {
        setStatus('error')
        return
      }

      setStatus('success')
      onSuccess?.()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'error') {
    return (
      <div className={styles.success}>
        <h3>{dict.form.errorTitle}</h3>
        <p>{dict.form.errorText}</p>
        <button type="button" className={styles.submit} onClick={() => setStatus('idle')}>
          {dict.form.retry}
        </button>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className={styles.success}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="var(--primary-red)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="24" cy="24" r="20"/>
          <path d="M14 24 L21 31 L34 18"/>
        </svg>
        <h3>{dict.form.successTitle}</h3>
        <p>{dict.form.successText}</p>
      </div>
    )
  }

  return (
    <form className={`${styles.form} ${className ?? ''}`.trim()} onSubmit={handleSubmit} noValidate>
      <p className={styles.formTitle}>{dict.form.title}</p>
      {inquiryCar && (
        <p className={styles.formCarNote}>
          {inquiryCar.label} · {inquiryCar.price}
        </p>
      )}
      <div className={styles.field}>
        <label htmlFor={id('name')}>{dict.form.name}</label>
        <input id={id('name')} type="text" placeholder={dict.form.namePh} value={form.name} onChange={set('name')} required />
      </div>
      <div className={styles.field}>
        <label htmlFor={id('contact')}>{dict.form.contact}</label>
        <input
          id={id('contact')}
          type="text"
          inputMode="text"
          autoComplete="tel email"
          placeholder={dict.form.contactPh}
          value={form.contact}
          onChange={set('contact')}
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor={id('carSearch')}>{dict.form.carSearch}</label>
        <input
          id={id('carSearch')}
          type="text"
          placeholder={dict.form.carSearchPh}
          value={form.carSearch}
          onChange={set('carSearch')}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor={id('comment')}>{dict.form.comment}</label>
        <textarea id={id('comment')} placeholder={dict.form.commentPh} rows={3} value={form.comment} onChange={set('comment')} />
      </div>
      <label className={styles.consent}>
        <input type="checkbox" checked={form.consent} onChange={set('consent')} required />
        <span>
          {dict.form.consentBefore}
          <a href={localePath(locale, '/polityka')} target="_blank" rel="noopener noreferrer">
            {dict.form.consentLink}
          </a>
        </span>
      </label>
      <button type="submit" className={styles.submit} disabled={!form.consent || status === 'loading'}>
        {status === 'loading' ? dict.form.submitting : dict.form.submit}
        {status !== 'loading' && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 14 L14 2 M6 2 H14 V10"/>
          </svg>
        )}
      </button>
    </form>
  )
}
