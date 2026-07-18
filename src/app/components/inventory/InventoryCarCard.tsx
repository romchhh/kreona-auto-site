'use client'
import Image from 'next/image'
import { useState, type MouseEvent } from 'react'
import type { InventoryCar } from '../../lib/cars'
import { buildCarInquiry } from '../../lib/carInquiry'
import { useDictionary } from '../../../i18n/LocaleProvider'
import { useContactModal } from '../ContactModalContext'
import CarDetailsModal from './CarDetailsModal'
import styles from '../sections/sections.module.css'

export type { InventoryCar }

function TagChip({ label }: { label: string }) {
  return (
    <span className={styles.inventoryTag}>
      {label}
      <span className={styles.inventoryTagDot} aria-hidden="true" />
    </span>
  )
}

export default function InventoryCarCard({ car }: { car: InventoryCar }) {
  const dict = useDictionary()
  const { openForm } = useContactModal()
  const [detailsOpen, setDetailsOpen] = useState(false)
  const photos = car.images?.length ? car.images : car.image ? [car.image] : []
  const [photoIndex, setPhotoIndex] = useState(0)
  const activePhoto = photos[photoIndex] || car.image
  const hasGallery = photos.length > 1

  const showPrev = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setPhotoIndex((i) => (i - 1 + photos.length) % photos.length)
  }

  const showNext = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setPhotoIndex((i) => (i + 1) % photos.length)
  }

  return (
    <>
      <article className={styles.inventoryCard}>
        <div className={styles.inventoryImageWrap}>
          <Image
            key={activePhoto}
            src={activePhoto}
            alt={`${car.make} ${car.model} ${car.year}`}
            fill
            sizes="(max-width: 768px) 85vw, (max-width: 1100px) 45vw, 360px"
            className={styles.inventoryImage}
          />

          <div className={styles.inventoryBadges}>
            <span className={styles.inventoryStatus}>{dict.inventory[car.statusKey]}</span>
            <span className={styles.inventoryRoute}>{car.route}</span>
          </div>

          <div className={styles.inventoryTags}>
            <TagChip label={`${dict.inventory.classPrefix}: ${car.bodyClass}`} />
            <TagChip label={`${dict.inventory.formatPrefix}: ${dict.inventory[car.formatKey]}`} />
            <TagChip label={`${dict.inventory.resultPrefix}: ${dict.inventory[car.resultKey]}`} />
          </div>

          {hasGallery ? (
            <>
              <button
                type="button"
                className={`${styles.inventoryPhotoNav} ${styles.inventoryPhotoNavPrev}`}
                onClick={showPrev}
                aria-label={dict.inventory.prevPhoto}
              >
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M11 3 L5 9 L11 15" />
                </svg>
              </button>
              <button
                type="button"
                className={`${styles.inventoryPhotoNav} ${styles.inventoryPhotoNavNext}`}
                onClick={showNext}
                aria-label={dict.inventory.nextPhoto}
              >
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 3 L13 9 L7 15" />
                </svg>
              </button>
              <div className={styles.inventoryPhotoDots} aria-hidden="true">
                {photos.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    className={`${styles.inventoryPhotoDot} ${i === photoIndex ? styles.inventoryPhotoDotActive : ''}`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setPhotoIndex(i)
                    }}
                  />
                ))}
              </div>
              <span className={styles.inventoryPhotoCounter}>
                {photoIndex + 1}/{photos.length}
              </span>
            </>
          ) : null}
        </div>

        <div className={styles.inventoryMeta}>
          <h3 className={styles.inventorySlideTitle}>
            {car.make} {car.model} - {car.year}
          </h3>
          <p className={styles.inventoryPrice}>{car.price}</p>

          <dl className={styles.inventorySpecs}>
            <div>
              <dt>{dict.inventory.engine}</dt>
              <dd>{car.engine}</dd>
            </div>
            <div>
              <dt>{dict.inventory.mileage}</dt>
              <dd>{car.mileage}</dd>
            </div>
            <div>
              <dt>{dict.inventory.gearbox}</dt>
              <dd>{dict.inventory[car.gearboxKey]}</dd>
            </div>
          </dl>

          <div className={styles.inventoryFooter}>
            <button
              type="button"
              className={styles.inventoryMoreBtn}
              onClick={() => setDetailsOpen(true)}
            >
              {dict.inventory.moreDetails}
            </button>
            <button
              type="button"
              className={styles.inventoryDetailsBtn}
              onClick={() => openForm(buildCarInquiry(car))}
            >
              {dict.inventory.inquire}
            </button>
          </div>
        </div>
      </article>

      <CarDetailsModal car={car} open={detailsOpen} onClose={() => setDetailsOpen(false)} />
    </>
  )
}
