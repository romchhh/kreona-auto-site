'use client'
import { createContext, useContext } from 'react'
import type { Locale } from './config'
import type { Dictionary } from './dictionaries/uk'

type LocaleContextValue = {
  locale: Locale
  dict: Dictionary
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale
  dict: Dictionary
  children: React.ReactNode
}) {
  return (
    <LocaleContext.Provider value={{ locale, dict }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx.locale
}

export function useDictionary() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useDictionary must be used within LocaleProvider')
  return ctx.dict
}
