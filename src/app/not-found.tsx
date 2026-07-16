import type { Metadata } from 'next'
import { ContactModalProvider } from './components/ContactModalContext'
import NotFoundContent from './components/NotFoundContent'
import { LocaleProvider } from '../i18n/LocaleProvider'
import { getDictionarySync } from '../i18n/getDictionary'
import { defaultLocale } from '../i18n/config'

export const metadata: Metadata = {
  title: 'Сторінку не знайдено',
  description: 'Запитана сторінка не існує або була переміщена.',
  robots: { index: false, follow: true },
}

export default function RootNotFound() {
  const dict = getDictionarySync(defaultLocale)

  return (
    <LocaleProvider locale={defaultLocale} dict={dict}>
      <ContactModalProvider>
        <NotFoundContent />
      </ContactModalProvider>
    </LocaleProvider>
  )
}
