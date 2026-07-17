import DirectionsSection from './sections/DirectionsSection'
import InventorySection from './sections/InventorySection'
import OrderCarsSection from './sections/OrderCarsSection'
import ServicesSection from './sections/ServicesSection'
import HowWeWorkSection from './sections/HowWeWorkSection'
import WhyUsSection from './sections/WhyUsSection'
import FaqSection from './sections/FaqSection'
import type { InventoryCar } from '../lib/cars'

export default function HomeSections({ cars }: { cars: InventoryCar[] }) {
  return (
    <>
      <DirectionsSection />
      <InventorySection cars={cars} />
      <OrderCarsSection />
      <ServicesSection />
      <HowWeWorkSection />
      <WhyUsSection />
      <FaqSection />
    </>
  )
}
