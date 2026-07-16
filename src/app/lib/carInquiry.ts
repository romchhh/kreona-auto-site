import type { CARS_IN_STOCK } from '../data/homeSections'

export type CarInquiry = {
  id: string
  label: string
  price: string
  details: string
}

export function buildCarInquiry(car: (typeof CARS_IN_STOCK)[number]): CarInquiry {
  return {
    id: car.id,
    label: `${car.make} ${car.model} - ${car.year}`,
    price: car.price,
    details: [
      `${car.make} ${car.model}, ${car.year}`,
      car.engine,
      car.mileage,
      car.price,
      car.route,
    ].join(' · '),
  }
}
