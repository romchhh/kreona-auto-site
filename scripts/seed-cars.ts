import { DEFAULT_SEED_CARS } from '../src/app/lib/admin/seedCars'
import { upsertCar } from '../src/app/lib/admin/store'

async function main() {
  const now = new Date().toISOString()
  for (const car of DEFAULT_SEED_CARS) {
    await upsertCar({ ...car, updatedAt: now })
    console.log(`✓ ${car.make} ${car.model} (${car.id}) · ${car.images.length} photo(s)`)
  }
  console.log(`\nDone: ${DEFAULT_SEED_CARS.length} cars upserted.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
