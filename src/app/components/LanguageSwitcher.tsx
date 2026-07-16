'use client'
import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { locales, localeNames, type Locale } from '../../i18n/config'
import { switchLocalePath } from '../../i18n/paths'
import { useLocale } from '../../i18n/LocaleProvider'
import styles from './LanguageSwitcher.module.css'

function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18" />
      <path d="M12 3a14 14 0 0 0 0 18" />
    </svg>
  )
}

export default function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname() || `/${locale}`
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className={styles.switcher} ref={rootRef}>
      <button
        type="button"
        className={`${styles.trigger} ${open ? styles.triggerOpen : ''}`}
        aria-label="Language"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        <GlobeIcon />
      </button>

      {open && (
        <div className={styles.menu} id={menuId} role="menu" aria-label="Language">
          {locales.map((code) => {
            const active = code === locale
            return (
              <Link
                key={code}
                href={switchLocalePath(pathname, code as Locale)}
                className={`${styles.lang} ${active ? styles.active : ''}`}
                hrefLang={code}
                role="menuitem"
                aria-current={active ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                {localeNames[code]}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
