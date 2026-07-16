import type { Metadata } from 'next'
import NotFoundContent from '../components/NotFoundContent'

export const metadata: Metadata = {
  title: 'Сторінку не знайдено',
  description: 'Запитана сторінка не існує або була переміщена.',
  robots: { index: false, follow: true },
}

export default function LocaleNotFound() {
  return <NotFoundContent />
}
