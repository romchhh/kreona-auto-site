import { NextResponse } from 'next/server'
import { getAdminSessionFromRequest } from '../../../lib/admin/auth'
import { countCars, deleteCar, getCar, listCars, upsertCar } from '../../../lib/admin/store'
import {
  emptyLocalized,
  normalizeCarImages,
  type InventoryCarRecord,
  type LocalizedString,
} from '../../../lib/admin/types'

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48)
}

function asLocalized(value: unknown, fallback = ''): LocalizedString {
  if (value && typeof value === 'object') {
    const v = value as Partial<LocalizedString>
    return {
      uk: String(v.uk ?? fallback),
      pl: String(v.pl ?? fallback),
      en: String(v.en ?? fallback),
    }
  }
  if (typeof value === 'string') return emptyLocalized(value)
  return emptyLocalized(fallback)
}

function asImages(body: Partial<InventoryCarRecord>): string[] {
  return normalizeCarImages(body.image || '', body.images)
}

export async function GET(request: Request) {
  if (!getAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const url = new URL(request.url)
  const id = url.searchParams.get('id')
  if (id) {
    const car = await getCar(id)
    if (!car) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ car })
  }
  return NextResponse.json({ cars: await listCars() })
}

export async function POST(request: Request) {
  if (!getAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = (await request.json()) as Partial<InventoryCarRecord> & {
    make?: string
    model?: string
    year?: number
  }
  const make = body.make?.trim()
  const model = body.model?.trim()
  const year = Number(body.year)
  if (!make || !model || !year) {
    return NextResponse.json({ error: 'make, model, year required' }, { status: 400 })
  }

  const now = new Date().toISOString()
  const id = body.id?.trim() || `${slugify(make)}-${slugify(model)}-${year}-${Date.now().toString(36)}`
  if (await getCar(id)) {
    return NextResponse.json({ error: 'Car id already exists' }, { status: 409 })
  }

  const carCount = await countCars()
  const images = asImages(body)
  const car: InventoryCarRecord = {
    id,
    image: images[0] || '/hero.png',
    images: images.length ? images : ['/hero.png'],
    make,
    model,
    year,
    engine: body.engine?.trim() || '',
    mileage: body.mileage?.trim() || '',
    gearboxKey: body.gearboxKey === 'manual' ? 'manual' : 'automatic',
    price: body.price?.trim() || '',
    statusKey: body.statusKey === 'inTransit' ? 'inTransit' : 'delivered',
    route: asLocalized(body.route),
    bodyClass: asLocalized(body.bodyClass, 'SUV'),
    description: asLocalized(body.description),
    formatKey: 'turnkey',
    resultKey: 'keysInPl',
    published: body.published !== false,
    sortOrder: Number.isFinite(body.sortOrder) ? Number(body.sortOrder) : carCount + 1,
    createdAt: now,
    updatedAt: now,
  }

  await upsertCar(car)
  return NextResponse.json({ car }, { status: 201 })
}

export async function PUT(request: Request) {
  if (!getAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = (await request.json()) as Partial<InventoryCarRecord> & { id?: string }
  if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const existing = await getCar(body.id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const images =
    body.images !== undefined || body.image !== undefined
      ? normalizeCarImages(
          body.image?.trim() || existing.image,
          body.images !== undefined ? body.images : existing.images,
        )
      : existing.images

  const car: InventoryCarRecord = {
    ...existing,
    image: images[0] || existing.image,
    images,
    make: body.make?.trim() || existing.make,
    model: body.model?.trim() || existing.model,
    year: Number(body.year) || existing.year,
    engine: body.engine !== undefined ? String(body.engine) : existing.engine,
    mileage: body.mileage !== undefined ? String(body.mileage) : existing.mileage,
    gearboxKey: body.gearboxKey === 'manual' ? 'manual' : body.gearboxKey === 'automatic' ? 'automatic' : existing.gearboxKey,
    price: body.price !== undefined ? String(body.price) : existing.price,
    statusKey:
      body.statusKey === 'inTransit'
        ? 'inTransit'
        : body.statusKey === 'delivered'
          ? 'delivered'
          : existing.statusKey,
    route: body.route ? asLocalized(body.route) : existing.route,
    bodyClass: body.bodyClass ? asLocalized(body.bodyClass) : existing.bodyClass,
    description: body.description ? asLocalized(body.description) : existing.description,
    published: body.published !== undefined ? Boolean(body.published) : existing.published,
    sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : existing.sortOrder,
    updatedAt: new Date().toISOString(),
  }

  await upsertCar(car)
  return NextResponse.json({ car })
}

export async function DELETE(request: Request) {
  if (!getAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const url = new URL(request.url)
  const id = url.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await deleteCar(id)
  return NextResponse.json({ ok: true })
}
