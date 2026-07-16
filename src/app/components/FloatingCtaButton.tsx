'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useDictionary } from '../../i18n/LocaleProvider'
import { useContactModal } from './ContactModalContext'
import styles from './FloatingCtaButton.module.css'

export default function FloatingCtaButton() {
  const dict = useDictionary()
  const pathname = usePathname()
  const { openForm, formOpen } = useContactModal()
  const [visible, setVisible] = useState(false)
  const [footerVisible, setFooterVisible] = useState(false)

  const hiddenOnPage =
    pathname?.includes('/poslugy/pidbir') ||
    pathname?.endsWith('/avto') ||
    pathname?.includes('/poslugy/vodnyy') ||
    pathname?.includes('/poslugy/gabaryt')

  useEffect(() => {
    if (hiddenOnPage) return
    const hero = document.getElementById('hero')

    const updateVisibility = () => {
      if (!hero) {
        setVisible(true)
        return
      }
      const { bottom } = hero.getBoundingClientRect()
      setVisible(bottom <= 0)
    }

    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    window.addEventListener('resize', updateVisibility)
    return () => {
      window.removeEventListener('scroll', updateVisibility)
      window.removeEventListener('resize', updateVisibility)
    }
  }, [hiddenOnPage])

  useEffect(() => {
    if (hiddenOnPage) return
    const footer = document.getElementById('site-footer')
    if (!footer) return

    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: '0px 0px -80px 0px' },
    )

    observer.observe(footer)
    return () => observer.disconnect()
  }, [hiddenOnPage])

  if (hiddenOnPage || formOpen || !visible || footerVisible) return null

  return (
    <button
      type="button"
      className={styles.fab}
      onClick={() => openForm()}
      aria-label={dict.floatingCta.label}
    >
      <span className={styles.pulse} aria-hidden="true" />
      <span className={styles.label}>{dict.floatingCta.label}</span>
      <span className={styles.icon} aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 14 L14 2 M6 2 H14 V10" />
        </svg>
      </span>
    </button>
  )
}
