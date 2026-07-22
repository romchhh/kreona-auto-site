'use client'

import { useId } from 'react'
import {
  DEFAULT_PHONE_COUNTRY,
  PHONE_COUNTRIES,
  formatPhoneInput,
  isCompletePhone,
  toInternationalPhone,
} from '../lib/phone'
import styles from './PhoneInput.module.css'

type Props = {
  id?: string
  label: string
  value: string
  countryIso: string
  onValueChange: (nationalFormatted: string) => void
  onCountryChange: (iso: string) => void
  error?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
}

export default function PhoneInput({
  id: idProp,
  label,
  value,
  countryIso,
  onValueChange,
  onCountryChange,
  error,
  placeholder = 'XXX XXX XXX',
  required,
  disabled,
}: Props) {
  const autoId = useId()
  const inputId = idProp || autoId
  const selectId = `${inputId}-country`
  const invalid = Boolean(error)

  return (
    <div className={styles.field}>
      <label htmlFor={inputId}>{label}</label>
      <div className={`${styles.row} ${invalid ? styles.invalid : ''}`}>
        <label htmlFor={selectId} className={styles.srOnly}>
          {label}
        </label>
        <select
          id={selectId}
          className={styles.country}
          value={countryIso}
          disabled={disabled}
          aria-label={label}
          onChange={(e) => {
            const nextIso = e.target.value
            onCountryChange(nextIso)
            // Re-clamp current digits to new country length/format
            onValueChange(formatPhoneInput(value, nextIso))
          }}
        >
          {PHONE_COUNTRIES.map((c) => (
            <option key={c.iso} value={c.iso}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          id={inputId}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          className={styles.number}
          value={value}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={invalid}
          aria-describedby={error ? `${inputId}-error` : undefined}
          onChange={(e) => onValueChange(formatPhoneInput(e.target.value, countryIso))}
        />
      </div>
      {error ? (
        <p id={`${inputId}-error`} className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function phoneOrEmpty(national: string, countryIso: string): string {
  if (!isCompletePhone(national, countryIso)) return ''
  return toInternationalPhone(national, countryIso)
}

export { DEFAULT_PHONE_COUNTRY, isCompletePhone, toInternationalPhone }
