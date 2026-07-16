'use client'
import Image from 'next/image'
import { DIRECTIONS } from '../../data/homeSections'
import { useDictionary } from '../../../i18n/LocaleProvider'
import { SectionHeading } from './SectionHeading'
import styles from './sections.module.css'

export default function DirectionsSection() {
  const dict = useDictionary()

  return (
    <section id="napryamky" className={`${styles.section} ${styles.directionsSection}`}>
      <div className={styles.directionsBackdrop} aria-hidden="true">
        <Image
          src="/directions/world-map.png"
          alt=""
          fill
          sizes="100vw"
          className={styles.directionsBackdropImage}
        />
      </div>

      <div className={styles.inner}>
        <SectionHeading
          title={<>{dict.directions.titleBefore}<em>{dict.directions.titleEm}</em></>}
          lead={dict.directions.route}
        />

        <div className={styles.directionsGrid}>
          {DIRECTIONS.map(({ id, code, crop }, index) => (
            <article key={id} className={styles.directionItem}>
              <div className={styles.directionGlobe} aria-hidden="true">
                <div
                  className={styles.directionGlobeInner}
                  style={{
                    ['--crop-x' as string]: crop.x,
                    ['--crop-y' as string]: crop.y,
                    ['--crop-scale' as string]: String(crop.scale),
                  }}
                >
                  <Image
                    src="/directions/world-map.png"
                    alt=""
                    fill
                    sizes="280px"
                    className={styles.directionGlobeImage}
                  />
                </div>
                <span className={styles.directionRing} />
              </div>

              <div className={styles.directionCopy}>
                <span className={styles.directionCode}>
                  {String(index + 1).padStart(2, '0')} · {code}
                </span>
                <h3 className={styles.directionTitle}>{dict.directions[id]}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
