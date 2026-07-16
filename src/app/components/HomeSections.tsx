import DirectionsSection from './sections/DirectionsSection'
import InventorySection from './sections/InventorySection'
import OrderCarsSection from './sections/OrderCarsSection'
import ServicesSection from './sections/ServicesSection'
import HowWeWorkSection from './sections/HowWeWorkSection'
import WhyUsSection from './sections/WhyUsSection'
import FaqSection from './sections/FaqSection'

export default function HomeSections() {
  return (
    <>
      <DirectionsSection />
      <InventorySection />
      <OrderCarsSection />
      <ServicesSection />
      <HowWeWorkSection />
      <WhyUsSection />
      <FaqSection />
    </>
  )
}
