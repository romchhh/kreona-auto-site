export const BRAND = {
  name: 'KREONA Sp. z o.o.',
  shortName: 'KREONA',
  logo: '/logo.svg',
  phones: ['+48 883 255 131', '+48 793 177 295'] as const,
  phone: '+48 883 255 131',
  email: 'kreonapl@gmail.com',
  address: 'ul. Ludwika Rydygiera 16/1',
  city: '50-249 Wrocław, Polska',
  addressLocality: 'Wrocław',
  postalCode: '50-249',
  countryCode: 'PL',
  vat: 'PL8982256129',
  eori: 'PL898225612900000',
  mapEmbedUrl:
    'https://maps.google.com/maps?q=ul.+Ludwika+Rydygiera+16%2F1,+50-249+Wroc%C5%82aw,+Polska&hl=uk&z=16&output=embed',
  mapLink:
    'https://www.google.com/maps/search/?api=1&query=ul.+Ludwika+Rydygiera+16%2F1,+50-249+Wroc%C5%82aw,+Polska',
  hoursWeekdays: 'Пн-Сб: 09:00 - 18:00',
  hoursSunday: 'Неділя - вихідний',
  heroDesktop: '/hero.png',
  heroMobile: '/hero.png',
  contactImage: '/hero.png',
} as const

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/kreona.pl',
} as const

export const SERVICES = [
  'Авто в наявності',
  'Підбір авто під бюджет',
  'Купівля на аукціонах США',
  'Доставка в Україну',
  'Розмитнення під ключ',
  'Перевірка історії Carfax',
  'Ремонт і підготовка',
  'Страхування вантажу',
  'Інше',
] as const
