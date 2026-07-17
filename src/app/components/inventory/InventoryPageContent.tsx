'use client'
import type { InventoryCar } from '../../lib/cars'
import { useDictionary } from '../../../i18n/LocaleProvider'
import InventoryCarCard from './InventoryCarCard'
import styles from '../sections/sections.module.css'
import pageStyles from './inventoryPage.module.css'

export default function InventoryPageContent({ cars }: { cars: InventoryCar[] }) {
  const dict = useDictionary()

  return (
    <section className={`${styles.section} ${styles.inventorySection} ${pageStyles.page}`}>
      <div className={styles.inner}>
        <div className={styles.inventoryIntro}>
          <h1 className={styles.inventoryHeading}>
            {dict.inventory.titleBefore}
            <em>{dict.inventory.titleEm}</em>
          </h1>
          <p className={styles.inventoryLead}>{dict.inventory.lead}</p>
        </div>

        <div className={pageStyles.grid}>
          {cars.map((car) => (
            <InventoryCarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  )
}
