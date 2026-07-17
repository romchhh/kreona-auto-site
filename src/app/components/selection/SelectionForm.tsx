'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useDictionary, useLocale } from '../../../i18n/LocaleProvider'
import { localePath } from '../../../i18n/paths'
import { getStoredUtm } from '../../lib/utm'
import { IMPORT_COUNTRIES } from '../../data/selectionPage'
import styles from '../ContactSection.module.css'

export type SelectionPrefill = {
  categoryId: string
  categoryLabel: string
  brand?: string
  typeLabel?: string
}

type FormState = {
  name: string
  phone: string
  brand: string
  model: string
  budget: string
  country: string
  comment: string
  consent: boolean
}

type Status = 'idle' | 'loading' | 'success' | 'error'

type Props = {
  prefill: SelectionPrefill
  onClose?: () => void
  idPrefix?: string
}

export default function SelectionForm({ prefill, onClose, idPrefix = 'selection' }: Props) {
  const dict = useDictionary()
  const locale = useLocale()
  const f = dict.selectionPage.form

  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    brand: prefill.brand || prefill.typeLabel || '',
    model: '',
    budget: '',
    country: '',
    comment: '',
    consent: false,
  })
  const [status, setStatus] = useState<Status>('idle')

  const id = (name: string) => `${idPrefix}-${name}`

  const set =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
      setForm((prev) => ({ ...prev, [key]: value }))
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.consent) return
    const name = form.name.trim()
    const phone = form.phone.trim()
    if (!name || !phone) return

    setStatus('loading')
    try {
      const carSearch = [
        prefill.categoryLabel,
        form.brand.trim() && `марка: ${form.brand.trim()}`,
        form.model.trim() && `модель: ${form.model.trim()}`,
        form.budget.trim() && `бюджет: ${form.budget.trim()}`,
        form.country && `країна: ${form.country}`,
      ]
        .filter(Boolean)
        .join(' · ')

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          contact: phone,
          carSearch,
          comment: form.comment.trim() || `Підбір: ${prefill.categoryLabel}`,
          source: 'selection',
          locale,
          path: typeof window !== 'undefined' ? window.location.pathname : undefined,
          utm: getStoredUtm(),
        }),
      })

      if (!response.ok) {
        setStatus('error')
        return
      }
      navigator.sendBeacon?.(
        '/api/analytics/collect',
        new Blob(
          [JSON.stringify({ type: 'conversion', path: window.location.pathname, locale, sessionId: 'form', country: 'Unknown', city: '', referrer: '', screenW: window.innerWidth, screenH: window.innerHeight })],
          { type: 'application/json' },
        ),
      )
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.success}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="var(--primary-red)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="24" cy="24" r="20" />
          <path d="M14 24 L21 31 L34 18" />
        </svg>
        <h3>{f.successTitle}</h3>
        <p>{f.successText}</p>
        {onClose && (
          <button type="button" className={styles.submit} onClick={onClose}>
            {dict.common.close}
          </button>
        )}
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className={styles.success}>
        <h3>{f.errorTitle}</h3>
        <p>{f.errorText}</p>
        <button type="button" className={styles.submit} onClick={() => setStatus('idle')}>
          {f.retry}
        </button>
      </div>
    )
  }

  const categoryNote = [
    prefill.categoryLabel,
    prefill.brand,
    prefill.typeLabel,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <form className={`${styles.form} ${styles.modalForm}`} onSubmit={handleSubmit} noValidate>
      <p className={styles.formCarNote}>{categoryNote}</p>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor={id('name')}>{f.name}</label>
          <input id={id('name')} type="text" value={form.name} onChange={set('name')} placeholder={f.namePh} required />
        </div>
        <div className={styles.field}>
          <label htmlFor={id('phone')}>{f.phone}</label>
          <input
            id={id('phone')}
            type="text"
            inputMode="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={set('phone')}
            placeholder={f.phonePh}
            required
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor={id('brand')}>{f.brand}</label>
          <input id={id('brand')} type="text" value={form.brand} onChange={set('brand')} placeholder={f.brandPh} />
        </div>
        <div className={styles.field}>
          <label htmlFor={id('model')}>{f.model}</label>
          <input id={id('model')} type="text" value={form.model} onChange={set('model')} placeholder={f.modelPh} />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor={id('budget')}>{f.budget}</label>
          <input id={id('budget')} type="text" value={form.budget} onChange={set('budget')} placeholder={f.budgetPh} />
        </div>
        <div className={styles.field}>
          <label htmlFor={id('country')}>{f.country}</label>
          <select id={id('country')} value={form.country} onChange={set('country')}>
            <option value="">{f.countryPh}</option>
            {IMPORT_COUNTRIES.map((code) => (
              <option key={code} value={code}>
                {f.countries[code]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor={id('comment')}>{f.comment}</label>
        <textarea id={id('comment')} value={form.comment} onChange={set('comment')} placeholder={f.commentPh} rows={3} />
      </div>

      <label className={styles.consent}>
        <input type="checkbox" checked={form.consent} onChange={set('consent')} required />
        <span>
          {f.consentBefore}
          <Link href={localePath(locale, '/polityka')} target="_blank" rel="noopener noreferrer">
            {f.consentLink}
          </Link>
        </span>
      </label>

      <button type="submit" className={styles.submit} disabled={status === 'loading' || !form.consent}>
        {status === 'loading' ? f.submitting : dict.selectionPage.ctaSubmit}
        {status !== 'loading' && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 14 L14 2 M6 2 H14 V10" />
          </svg>
        )}
      </button>
    </form>
  )
}
