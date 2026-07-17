'use client'
import Image from 'next/image'
import type { InventoryCar } from '../../lib/cars'
import { buildCarInquiry } from '../../lib/carInquiry'
import { useDictionary } from '../../../i18n/LocaleProvider'
import { useContactModal } from '../ContactModalContext'
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

  return (
    <article className={styles.inventoryCard}>
      <div className={styles.inventoryImageWrap}>
        <Image
          src={car.image}
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
            className={styles.inventoryDetailsBtn}
            onClick={() => openForm(buildCarInquiry(car))}
          >
            {dict.inventory.inquire}
          </button>
        </div>
      </div>
    </article>
  )
}
