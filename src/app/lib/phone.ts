/** Phone country dial codes + national number rules */

export type PhoneCountry = {
  iso: string
  dial: string
  label: string
  /** Expected national digit count (without country code) */
  length: number
  /** Digit group sizes for display formatting */
  groups: number[]
}

export const PHONE_COUNTRIES: PhoneCountry[] = [
  { iso: 'PL', dial: '48', label: '🇵🇱 +48', length: 9, groups: [3, 3, 3] },
  { iso: 'UA', dial: '380', label: '🇺🇦 +380', length: 9, groups: [2, 3, 2, 2] },
  { iso: 'DE', dial: '49', label: '🇩🇪 +49', length: 11, groups: [3, 4, 4] },
  { iso: 'CZ', dial: '420', label: '🇨🇿 +420', length: 9, groups: [3, 3, 3] },
  { iso: 'SK', dial: '421', label: '🇸🇰 +421', length: 9, groups: [3, 3, 3] },
  { iso: 'GB', dial: '44', label: '🇬🇧 +44', length: 10, groups: [4, 3, 3] },
]

export const DEFAULT_PHONE_COUNTRY =
  PHONE_COUNTRIES.find((c) => c.iso === 'PL') ?? PHONE_COUNTRIES[0]

export function getPhoneCountry(iso: string): PhoneCountry {
  return PHONE_COUNTRIES.find((c) => c.iso === iso) ?? DEFAULT_PHONE_COUNTRY
}

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

/** Format national digits with spaces according to country groups */
export function formatNationalNumber(digits: string, country: PhoneCountry): string {
  const limited = digits.slice(0, country.length)
  if (!limited) return ''

  const parts: string[] = []
  let cursor = 0
  for (const size of country.groups) {
    if (cursor >= limited.length) break
    parts.push(limited.slice(cursor, cursor + size))
    cursor += size
  }
  if (cursor < limited.length) {
    parts.push(limited.slice(cursor))
  }
  return parts.filter(Boolean).join(' ')
}

/**
 * Strip pasted/full international input down to national digits for the selected country.
 * Handles +48… / 48… / 0… prefixes.
 */
export function nationalDigitsFromInput(input: string, country: PhoneCountry): string {
  let digits = digitsOnly(input)

  if (digits.startsWith(country.dial)) {
    digits = digits.slice(country.dial.length)
  } else if (digits.startsWith('0')) {
    digits = digits.slice(1)
  }

  return digits.slice(0, country.length)
}

export function formatPhoneInput(input: string, countryIso: string): string {
  const country = getPhoneCountry(countryIso)
  return formatNationalNumber(nationalDigitsFromInput(input, country), country)
}

export function isCompletePhone(nationalFormatted: string, countryIso: string): boolean {
  const country = getPhoneCountry(countryIso)
  return digitsOnly(nationalFormatted).length === country.length
}

/** Full international number, e.g. +48 123 456 789 */
export function toInternationalPhone(nationalFormatted: string, countryIso: string): string {
  const country = getPhoneCountry(countryIso)
  const national = formatNationalNumber(digitsOnly(nationalFormatted), country)
  if (!national) return `+${country.dial}`
  return `+${country.dial} ${national}`
}

/** Compact E.164-ish for storage/tel links: +48123456789 */
export function toE164(nationalFormatted: string, countryIso: string): string {
  const country = getPhoneCountry(countryIso)
  const national = digitsOnly(nationalFormatted).slice(0, country.length)
  return `+${country.dial}${national}`
}

/** Server-side: accept +XXXXXXXX… with known dial codes and correct length */
export function isValidInternationalPhone(value: string): boolean {
  const digits = digitsOnly(value)
  if (!digits) return false

  for (const country of PHONE_COUNTRIES) {
    if (digits.startsWith(country.dial)) {
      const national = digits.slice(country.dial.length)
      return national.length === country.length
    }
  }
  return false
}

/** @deprecated use formatPhoneInput with PL — kept for compatibility */
export function formatPlPhone(input: string): string {
  return formatPhoneInput(input, 'PL')
}

/** @deprecated use isCompletePhone with PL */
export function isCompletePlPhone(phone: string): boolean {
  return isCompletePhone(phone.replace(/^\+?48\s?/, ''), 'PL') || digitsOnly(phone).length === 11
}
