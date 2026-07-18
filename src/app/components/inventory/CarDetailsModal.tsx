'use client'

import Image from 'next/image'
import { useEffect, useState, type MouseEvent } from 'react'
import type { InventoryCar } from '../../lib/cars'
import { buildCarInquiry } from '../../lib/carInquiry'
import { useDictionary } from '../../../i18n/LocaleProvider'
import { useBodyScrollLock } from '../../lib/useBodyScrollLock'
import { useContactModal } from '../ContactModalContext'
import styles from './CarDetailsModal.module.css'

type Props = {
  car: InventoryCar | null
  open: boolean
  onClose: () => void
}

export default function CarDetailsModal({ car, open, onClose }: Props) {
  const dict = useDictionary()
  const { openForm } = useContactModal()
  const photos = car
    ? car.images?.length
      ? car.images
      : car.image
        ? [car.image]
        : []
    : []
  const [photoIndex, setPhotoIndex] = useState(0)

  useBodyScrollLock(open)

  useEffect(() => {
    if (open) setPhotoIndex(0)
  }, [open, car?.id])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!car) return null

  const activePhoto = photos[photoIndex] || car.image
  const hasGallery = photos.length > 1

  const showPrev = (e: MouseEvent) => {
    e.preventDefault()
    setPhotoIndex((i) => (i - 1 + photos.length) % photos.length)
  }

  const showNext = (e: MouseEvent) => {
    e.preventDefault()
    setPhotoIndex((i) => (i + 1) % photos.length)
  }

  const onInquire = () => {
    onClose()
    openForm(buildCarInquiry(car))
  }

  return (
    <div
      className={`${styles.overlay} ${open ? styles.open : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="car-details-title"
      aria-hidden={!open}
    >
      <button
        type="button"
        className={styles.backdrop}
        onClick={onClose}
        aria-label={dict.common.close}
        tabIndex={open ? 0 : -1}
      />
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h2 id="car-details-title" className={styles.title}>
              {car.make} {car.model} · {car.year}
            </h2>
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label={dict.common.close}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 4 L20 20 M20 4 L4 20" />
            </svg>
          </button>
        </div>

        <div className={styles.scroll}>
          {activePhoto ? (
            <div className={styles.galleryBlock}>
              <div className={styles.gallery}>
                <div className={styles.galleryStage}>
                  <Image
                    key={activePhoto}
                    src={activePhoto}
                    alt={`${car.make} ${car.model} ${car.year}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 760px"
                    className={styles.galleryImage}
                    priority={open}
                  />
                </div>
                {hasGallery ? (
                  <>
                    <button type="button" className={`${styles.photoNav} ${styles.photoNavPrev}`} onClick={showPrev} aria-label={dict.inventory.prevPhoto}>
                      <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M11 3 L5 9 L11 15" />
                      </svg>
                    </button>
                    <button type="button" className={`${styles.photoNav} ${styles.photoNavNext}`} onClick={showNext} aria-label={dict.inventory.nextPhoto}>
                      <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M7 3 L13 9 L7 15" />
                      </svg>
                    </button>
                    <span className={styles.photoCounter}>
                      {photoIndex + 1}/{photos.length}
                    </span>
                  </>
                ) : null}
              </div>

              {hasGallery ? (
                <div className={styles.thumbs} role="tablist" aria-label={`${car.make} ${car.model}`}>
                  {photos.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      role="tab"
                      aria-selected={i === photoIndex}
                      className={`${styles.thumb} ${i === photoIndex ? styles.thumbActive : ''}`}
                      onClick={() => setPhotoIndex(i)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          <div className={styles.body}>
            <p className={styles.price}>{car.price}</p>

            <dl className={styles.specs}>
              <div>
                <dt>{dict.inventory.engine}</dt>
                <dd>{car.engine || '—'}</dd>
              </div>
              <div>
                <dt>{dict.inventory.mileage}</dt>
                <dd>{car.mileage || '—'}</dd>
              </div>
              <div>
                <dt>{dict.inventory.gearbox}</dt>
                <dd>{dict.inventory[car.gearboxKey]}</dd>
              </div>
              <div>
                <dt>{dict.inventory.statusLabel}</dt>
                <dd>{dict.inventory[car.statusKey]}</dd>
              </div>
              <div>
                <dt>{dict.inventory.routeLabel}</dt>
                <dd>{car.route || '—'}</dd>
              </div>
              <div>
                <dt>{dict.inventory.classPrefix}</dt>
                <dd>{car.bodyClass || '—'}</dd>
              </div>
              <div>
                <dt>{dict.inventory.formatPrefix}</dt>
                <dd>{dict.inventory[car.formatKey]}</dd>
              </div>
              <div>
                <dt>{dict.inventory.resultPrefix}</dt>
                <dd>{dict.inventory[car.resultKey]}</dd>
              </div>
            </dl>

            {car.description ? (
              <div className={styles.descriptionBlock}>
                <h3 className={styles.descriptionTitle}>{dict.inventory.descriptionLabel}</h3>
                <p className={styles.description}>{car.description}</p>
              </div>
            ) : null}

            <button type="button" className={styles.inquireBtn} onClick={onInquire}>
              {dict.inventory.inquire}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
