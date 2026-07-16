import type { Metadata } from 'next'
import NotFoundContent from '../components/NotFoundContent'
import { getDictionarySync } from '../../i18n/getDictionary'
import { defaultLocale } from '../../i18n/config'

const dict = getDictionarySync(defaultLocale)

export const metadata: Metadata = {
  title: { absolute: dict.notFound.metaTitle },
  description: dict.notFound.metaDescription,
  robots: { index: false, follow: true },
}

export default function LocaleNotFound() {
  return <NotFoundContent />
}
