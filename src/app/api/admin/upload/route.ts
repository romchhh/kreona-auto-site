import { randomBytes } from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { getAdminSessionFromRequest } from '../../../lib/admin/auth'

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const MAX_BYTES = 8 * 1024 * 1024

function extFor(type: string, fallbackName: string) {
  if (type === 'image/jpeg') return '.jpg'
  if (type === 'image/png') return '.png'
  if (type === 'image/webp') return '.webp'
  if (type === 'image/gif') return '.gif'
  const fromName = path.extname(fallbackName).toLowerCase()
  return fromName || '.jpg'
}

function slugBase(name: string) {
  return name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'car'
}

export async function POST(request: Request) {
  if (!getAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const form = await request.formData()
    const file = form.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Файл не передано' }, { status: 400 })
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: 'Дозволені формати: JPG, PNG, WebP, GIF' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Максимальний розмір файлу — 8 МБ' }, { status: 400 })
    }

    const bytes = Buffer.from(await file.arrayBuffer())
    const dir = path.join(process.cwd(), 'public', 'cars')
    await fs.mkdir(dir, { recursive: true })

    const filename = `${slugBase(file.name)}-${randomBytes(4).toString('hex')}${extFor(file.type, file.name)}`
    await fs.writeFile(path.join(dir, filename), bytes)

    return NextResponse.json({ url: `/cars/${filename}` })
  } catch (error) {
    console.error('[admin upload]', error)
    return NextResponse.json({ error: 'Не вдалося завантажити зображення' }, { status: 500 })
  }
}
