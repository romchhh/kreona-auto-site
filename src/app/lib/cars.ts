import type { Locale } from '../../i18n/config'
import { listPublishedCars } from './admin/store'
import {
  localize,
  normalizeCarImages,
  type InventoryCar,
  type InventoryCarRecord,
  type LocaleCode,
} from './admin/types'

export type { InventoryCar, InventoryCarRecord }

export function toPublicCar(car: InventoryCarRecord, locale: LocaleCode): InventoryCar {
  const images = normalizeCarImages(car.image, car.images)
  return {
    id: car.id,
    image: images[0] || car.image,
    images,
    make: car.make,
    model: car.model,
    year: car.year,
    engine: car.engine,
    mileage: car.mileage,
    gearboxKey: car.gearboxKey,
    price: car.price,
    statusKey: car.statusKey,
    route: localize(car.route, locale),
    bodyClass: localize(car.bodyClass, locale),
    description: localize(car.description, locale),
    formatKey: car.formatKey,
    resultKey: car.resultKey,
  }
}

export async function getPublishedCarsForLocale(locale: Locale): Promise<InventoryCar[]> {
  const cars = await listPublishedCars()
  return cars.map((car) => toPublicCar(car, locale))
}
