import { headers } from 'next/headers'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import './west-auto.css'
import UtmCapture from './components/UtmCapture'
import AnalyticsTracker from './components/AnalyticsTracker'
import { isLocale, localeHtmlLang, type Locale } from '../i18n/config'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  KEYWORDS,
  OG_IMAGE,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
} from './seo'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [...KEYWORDS],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'automotive',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: absoluteUrl('/uk'),
    languages: {
      uk: absoluteUrl('/uk'),
      pl: absoluteUrl('/pl'),
      en: absoluteUrl('/en'),
      'x-default': absoluteUrl('/uk'),
    },
  },
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    alternateLocale: ['pl_PL', 'en_US'],
    url: absoluteUrl('/uk'),
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: `${SITE_NAME} - автомобілі під ключ`,
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [{ url: '/favicon.png', sizes: '500x500', type: 'image/png' }],
    shortcut: '/favicon.png',
    apple: [{ url: '/favicon.png', sizes: '500x500', type: 'image/png' }],
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  other: {
    'geo.region': 'PL-DS',
    'geo.placename': 'Wrocław',
    'geo.position': '51.1254;17.0335',
    ICBM: '51.1254, 17.0335',
  },
}

export const viewport: Viewport = {
  themeColor: '#9AB11C',
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerLocale = (await headers()).get('x-locale') ?? ''
  const locale: Locale = isLocale(headerLocale) ? headerLocale : 'uk'
  const htmlLang = localeHtmlLang[locale]

  return (
    <html lang={htmlLang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <UtmCapture />
        <AnalyticsTracker />
        <div className="west-auto">{children}</div>
      </body>
    </html>
  )
}
