'use client'
import Link from 'next/link'
import { useRef, useState, useCallback, useEffect } from 'react'
import { CARS_IN_STOCK } from '../../data/homeSections'
import { useDictionary, useLocale } from '../../../i18n/LocaleProvider'
import { localePath } from '../../../i18n/paths'
import { useContactModal } from '../ContactModalContext'
import InventoryCarCard from '../inventory/InventoryCarCard'
import styles from './sections.module.css'

export default function InventorySection() {
  const dict = useDictionary()
  const locale = useLocale()
  const trackRef = useRef<HTMLDivElement>(null)
  const { openForm } = useContactModal()
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const updateNav = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const { scrollLeft, scrollWidth, clientWidth } = track
    setCanPrev(scrollLeft > 8)
    setCanNext(scrollLeft + clientWidth < scrollWidth - 8)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    updateNav()
    track.addEventListener('scroll', updateNav, { passive: true })
    window.addEventListener('resize', updateNav)
    return () => {
      track.removeEventListener('scroll', updateNav)
      window.removeEventListener('resize', updateNav)
    }
  }, [updateNav])

  const scroll = (direction: 'prev' | 'next') => {
    const track = trackRef.current
    if (!track) return
    const slide = track.querySelector<HTMLElement>(`.${styles.inventorySlide}`)
    const gap = 24
    const amount = slide ? slide.offsetWidth + gap : track.clientWidth * 0.85
    track.scrollBy({ left: direction === 'next' ? amount : -amount, behavior: 'smooth' })
  }

  return (
    <section id="nayavnist" className={`${styles.section} ${styles.inventorySection}`}>
      <div className={styles.inner}>
        <div className={styles.inventoryHeader}>
          <div className={styles.inventoryIntro}>
            <h2 className={styles.inventoryHeading}>
              {dict.inventory.titleBefore}<em>{dict.inventory.titleEm}</em>
            </h2>
            <p className={styles.inventoryLead}>{dict.inventory.lead}</p>
          </div>
          <Link href={localePath(locale, '/avto-v-nayavnosti')} className={styles.inventoryAllLink}>
            {dict.inventory.allCars}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 12 L12 2 M5 2 H12 V9" />
            </svg>
          </Link>
        </div>

        <div className={styles.inventoryCarousel}>
          <button
            type="button"
            className={`${styles.carouselArrow} ${styles.carouselArrowPrev}`}
            onClick={() => scroll('prev')}
            disabled={!canPrev}
            aria-label={dict.inventory.prev}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 3 L5 9 L11 15" />
            </svg>
          </button>

          <div className={styles.inventoryViewport}>
            <div ref={trackRef} className={styles.inventoryTrack}>
              {CARS_IN_STOCK.map((car) => (
                <div key={car.id} className={styles.inventorySlide}>
                  <InventoryCarCard car={car} />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={`${styles.carouselArrow} ${styles.carouselArrowNext}`}
            onClick={() => scroll('next')}
            disabled={!canNext}
            aria-label={dict.inventory.next}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 3 L13 9 L7 15" />
            </svg>
          </button>
        </div>

        <div className={styles.inventoryCtaWrap}>
          <button type="button" className={styles.inventoryCta} onClick={() => openForm()}>
            {dict.inventory.pickCar}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 12 L12 2 M5 2 H12 V9" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
