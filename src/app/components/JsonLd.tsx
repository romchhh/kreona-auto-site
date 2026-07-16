import { BRAND } from '../brand'
import type { Dictionary } from '../../i18n/dictionaries/uk'
import type { Locale } from '../../i18n/config'
import { localeHtmlLang } from '../../i18n/config'
import {
  OG_IMAGE,
  SAME_AS,
  SCHEMA_LOGO,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  phoneTel,
} from '../seo'

function JsonLdScript({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

type Props = {
  locale: Locale
  dict: Dictionary
}

export default function JsonLd({ locale, dict }: Props) {
  const lang = localeHtmlLang[locale]
  const pageUrl = absoluteUrl(`/${locale}`)

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl(SCHEMA_LOGO),
      width: 500,
      height: 500,
    },
    image: absoluteUrl(OG_IMAGE),
    description: dict.seo.defaultDescription,
    email: BRAND.email,
    taxID: BRAND.vat,
    identifier: BRAND.eori,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BRAND.address,
      addressLocality: BRAND.addressLocality,
      postalCode: BRAND.postalCode,
      addressCountry: BRAND.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 51.1254,
      longitude: 17.0335,
    },
    hasMap: BRAND.mapLink,
    telephone: phoneTel(BRAND.phone),
    contactPoint: BRAND.phones.map((phone) => ({
      '@type': 'ContactPoint',
      telephone: phoneTel(phone),
      contactType: 'customer service',
      email: BRAND.email,
      areaServed: ['PL', 'UA'],
      availableLanguage: ['Ukrainian', 'Polish', 'English'],
    })),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    areaServed: [
      { '@type': 'Country', name: 'Poland' },
      { '@type': 'Country', name: 'Ukraine' },
    ],
    priceRange: '€€€',
    currenciesAccepted: 'EUR, PLN, USD',
    paymentAccepted: 'Cash, Bank Transfer',
    sameAs: [...SAME_AS],
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    alternateName: 'KREONA',
    description: dict.seo.defaultDescription,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: ['uk', 'pl', 'en'],
  }

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: dict.faq.items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  }

  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}/#webpage`,
    url: pageUrl,
    name: dict.seo.defaultTitle,
    description: dict.seo.defaultDescription,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
    inLanguage: lang,
    primaryImageOfPage: absoluteUrl(OG_IMAGE),
  }

  return (
    <>
      <JsonLdScript data={organization} />
      <JsonLdScript data={website} />
      <JsonLdScript data={faqPage} />
      <JsonLdScript data={webPage} />
    </>
  )
}

export function BreadcrumbJsonLd({
  locale,
  items,
}: {
  locale: Locale
  items: { name: string; path: string }[]
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'KREONA',
        item: absoluteUrl(`/${locale}`),
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.name,
        item: absoluteUrl(`/${locale}${item.path.startsWith('/') ? item.path : `/${item.path}`}`),
      })),
    ],
  }

  return <JsonLdScript data={data} />
}

type ServiceJsonLdProps = {
  locale: Locale
  name: string
  description: string
  path: string
  serviceType: string
  image?: string
}

export function ServiceJsonLd({
  locale,
  name,
  description,
  path,
  serviceType,
  image = OG_IMAGE,
}: ServiceJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: [
      { '@type': 'Country', name: 'Poland' },
      { '@type': 'Country', name: 'Ukraine' },
    ],
    url: absoluteUrl(`/${locale}${path}`),
    serviceType,
    image: absoluteUrl(image),
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'EUR',
      url: absoluteUrl(`/${locale}${path}`),
    },
  }

  return <JsonLdScript data={data} />
}

export function InventoryJsonLd({
  locale,
  dict,
  cars,
}: {
  locale: Locale
  dict: Dictionary
  cars: readonly {
    id: string
    make: string
    model: string
    year: number
    price: string
    image: string
  }[]
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: dict.inventory.metaTitle.replace(/ - KREONA$/, ''),
    description: dict.inventory.metaDescription,
    url: absoluteUrl(`/${locale}/avto`),
    numberOfItems: cars.length,
    itemListElement: cars.map((car, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Car',
        name: `${car.make} ${car.model} ${car.year}`,
        brand: { '@type': 'Brand', name: car.make },
        model: car.model,
        vehicleModelDate: String(car.year),
        image: car.image.startsWith('http') ? car.image : absoluteUrl(car.image),
        offers: {
          '@type': 'Offer',
          priceCurrency: 'EUR',
          price: car.price.replace(/[^\d]/g, ''),
          availability: 'https://schema.org/InStock',
          url: absoluteUrl(`/${locale}/avto`),
        },
      },
    })),
  }

  return <JsonLdScript data={data} />
}

export function ContactJsonLd({
  locale,
  dict,
}: {
  locale: Locale
  dict: Dictionary
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: dict.contactsPage.metaTitle,
    description: dict.contactsPage.metaDescription,
    url: absoluteUrl(`/${locale}/kontakty`),
    mainEntity: { '@id': `${SITE_URL}/#organization` },
    inLanguage: localeHtmlLang[locale],
  }

  return <JsonLdScript data={data} />
}
