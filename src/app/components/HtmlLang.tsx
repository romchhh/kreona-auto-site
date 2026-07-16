'use client'
import { useEffect } from 'react'
import type { Locale } from '../../i18n/config'
import { localeHtmlLang } from '../../i18n/config'

export default function HtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = localeHtmlLang[locale]
  }, [locale])

  return null
}
