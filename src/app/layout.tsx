import { headers } from 'next/headers'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'
import './west-auto.css'
import UtmCapture from './components/UtmCapture'
import { isLocale, localeHtmlLang, type Locale } from '../i18n/config'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  KEYWORDS,
  OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
} from './seo'

const GTM_ID = 'GTM-KNX6TD98'

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
        width: 1408,
        height: 768,
        alt: `${SITE_NAME} — автомобілі під ключ`,
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
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#9AB11C',
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const headerLocale = headers().get('x-locale') ?? ''
  const locale: Locale = isLocale(headerLocale) ? headerLocale : 'uk'
  const htmlLang = localeHtmlLang[locale]

  return (
    <html lang={htmlLang}>
      <head>
        <Script id="google-tag-manager" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <UtmCapture />
        <div className="west-auto">{children}</div>
      </body>
    </html>
  )
}
