'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { SERVICES } from '../../data/homeSections'
import { useDictionary, useLocale } from '../../../i18n/LocaleProvider'
import { localePath } from '../../../i18n/paths'
import { SectionHeading } from './SectionHeading'
import styles from './sections.module.css'

const THEME_CLASS = {
  dark: styles.serviceDark,
  photo: styles.servicePhoto,
  photoAlt: styles.servicePhotoAlt,
  light: styles.serviceLight,
} as const

export default function ServicesSection() {
  const dict = useDictionary()
  const locale = useLocale()
  const trackRef = useRef<HTMLDivElement>(null)
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
    const slide = track.querySelector<HTMLElement>(`.${styles.serviceCard}`)
    const gap = 20
    const amount = slide ? slide.offsetWidth + gap : track.clientWidth * 0.8
    track.scrollBy({ left: direction === 'next' ? amount : -amount, behavior: 'smooth' })
  }

  return (
    <section id="poslugy" className={styles.section}>
      <div className={styles.inner}>
        <SectionHeading title={<>{dict.services.titleBefore}<em>{dict.services.titleEm}</em></>} />

        <div className={styles.servicesCarousel}>
          <button
            type="button"
            className={`${styles.carouselArrow} ${styles.carouselArrowPrev}`}
            onClick={() => scroll('prev')}
            disabled={!canPrev}
            aria-label={dict.services.prev}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 3 L5 9 L11 15" />
            </svg>
          </button>

          <div className={styles.servicesViewport}>
            <div ref={trackRef} className={styles.servicesRow}>
              {SERVICES.map((service) => {
                const copy = dict.services.items[service.id]

                return (
                  <article
                    key={service.id}
                    className={`${styles.serviceCard} ${THEME_CLASS[service.theme]}`}
                  >
                    <div className={styles.serviceMedia}>
                      <Image
                        src={service.image}
                        alt={copy.title}
                        fill
                        sizes="(max-width: 768px) 82vw, 360px"
                        className={styles.serviceImage}
                      />
                    </div>

                    <div className={styles.serviceBody}>
                      <h3 className={styles.serviceTitle}>{copy.title}</h3>
                      <p className={styles.serviceText}>{copy.description}</p>
                      <Link href={localePath(locale, '/poslugy/pidbir-avtomobilya')} className={styles.serviceBtn}>
                        {dict.services.details}
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M2 12 L12 2 M5 2 H12 V9" />
                        </svg>
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          <button
            type="button"
            className={`${styles.carouselArrow} ${styles.carouselArrowNext}`}
            onClick={() => scroll('next')}
            disabled={!canNext}
            aria-label={dict.services.next}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 3 L13 9 L7 15" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
