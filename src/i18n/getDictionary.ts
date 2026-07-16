import type { Locale } from './config'
import type { Dictionary } from './dictionaries/uk'
import { uk } from './dictionaries/uk'
import { en } from './dictionaries/en'
import { pl } from './dictionaries/pl'

const dictionaries = { uk, en, pl } as const

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return (dictionaries[locale] ?? dictionaries.uk) as Dictionary
}

export function getDictionarySync(locale: Locale): Dictionary {
  return (dictionaries[locale] ?? dictionaries.uk) as Dictionary
}
