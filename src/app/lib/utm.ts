const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const

export type UtmKey = (typeof UTM_KEYS)[number]
export type UtmParams = Partial<Record<UtmKey, string>>

const STORAGE_KEY = 'was_utm'

export function captureUtmFromUrl(): void {
  if (typeof window === 'undefined') return

  const params = new URLSearchParams(window.location.search)
  const next: UtmParams = {}
  let found = false

  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim()
    if (value) {
      next[key] = value
      found = true
    }
  }

  if (!found) return

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // ignore quota / private mode errors
  }
}

export function getStoredUtm(): UtmParams {
  if (typeof window === 'undefined') return {}

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as UtmParams
    const cleaned: UtmParams = {}

    for (const key of UTM_KEYS) {
      const value = parsed[key]?.trim()
      if (value) cleaned[key] = value
    }

    return cleaned
  } catch {
    return {}
  }
}

export { UTM_KEYS }
