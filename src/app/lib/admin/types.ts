export type LocaleCode = 'uk' | 'pl' | 'en'

export type LocalizedString = Record<LocaleCode, string>

export type GearboxKey = 'automatic' | 'manual'
export type StatusKey = 'delivered' | 'inTransit'
export type FormatKey = 'turnkey'
export type ResultKey = 'keysInPl'

export type InventoryCarRecord = {
  id: string
  image: string
  make: string
  model: string
  year: number
  engine: string
  mileage: string
  gearboxKey: GearboxKey
  price: string
  statusKey: StatusKey
  route: LocalizedString
  bodyClass: LocalizedString
  description: LocalizedString
  formatKey: FormatKey
  resultKey: ResultKey
  published: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

/** Flat car shape used by public UI for a given locale */
export type InventoryCar = {
  id: string
  image: string
  make: string
  model: string
  year: number
  engine: string
  mileage: string
  gearboxKey: GearboxKey
  price: string
  statusKey: StatusKey
  route: string
  bodyClass: string
  description: string
  formatKey: FormatKey
  resultKey: ResultKey
}

export type LeadStatus = 'new' | 'in_progress' | 'done' | 'spam'

export type LeadRecord = {
  id: string
  createdAt: string
  name: string
  contact: string
  carSearch: string
  comment: string
  source: 'contact' | 'selection' | 'inventory'
  status: LeadStatus
  notes: string
  car?: {
    id?: string
    label?: string
    price?: string
    details?: string
  }
  utm?: Partial<Record<'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_content' | 'utm_term', string>>
  locale?: string
  path?: string
}

export type AnalyticsEvent = {
  id: string
  ts: string
  type: 'pageview' | 'click' | 'conversion'
  path: string
  locale: string
  referrer: string
  country: string
  city: string
  screenW: number
  screenH: number
  sessionId: string
  x?: number
  y?: number
  label?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

export function emptyLocalized(fallback = ''): LocalizedString {
  return { uk: fallback, pl: fallback, en: fallback }
}

export function localize(value: LocalizedString | string, locale: LocaleCode): string {
  if (typeof value === 'string') return value
  return value[locale] || value.uk || value.pl || value.en || ''
}
