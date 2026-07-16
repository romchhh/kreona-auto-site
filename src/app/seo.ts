import { BRAND, SOCIAL_LINKS } from './brand'

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://kreona.pl'

export const SITE_NAME = BRAND.name

export const DEFAULT_TITLE =
  'KREONA - Автомобілі з США, Європи, Канади та Кореї під ключ'

export const DEFAULT_DESCRIPTION =
  'KREONA Sp. z o.o. - підбір, купівля, доставка та повний супровід автомобілів з США, Європи, Канади та Кореї. Wrocław, Polska.'

export const KEYWORDS = [
  'пригін авто з США',
  'доставка авто з Європи',
  'авто з Кореї',
  'авто з Канади',
  'підбір авто під бюджет',
  'KREONA',
  'купівля авто з США',
  'доставка авто в Україну',
  'розмитнення авто Польща',
  'авто під ключ Вроцлав',
  'Carfax перевірка',
] as const

/** Social / OG share image (optimized JPEG 1200×630) */
export const OG_IMAGE = '/og.jpg'
export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630

/** Raster logo for structured data (Google prefers non-SVG) */
export const SCHEMA_LOGO = '/favicon.png'

export function absoluteUrl(path = '/') {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}

export function phoneTel(phone: string) {
  return phone.replace(/[^\d+]/g, '')
}

export const BUSINESS_HOURS = {
  weekdays: 'Пн-Сб: 09:00 - 18:00',
  sunday: 'Неділя - вихідний',
  schema: ['Mo-Sa 09:00-18:00'],
} as const

export const SAME_AS = [SOCIAL_LINKS.instagram] as const
