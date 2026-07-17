import Database from 'better-sqlite3'
import { existsSync, mkdirSync, promises as fs } from 'fs'
import path from 'path'
import type { AnalyticsEvent, InventoryCarRecord, LeadRecord } from './types'
import { normalizeCarImages } from './types'

export const DATA_DIR = path.join(process.cwd(), 'data')
export const DB_PATH = process.env.DATABASE_PATH || path.join(DATA_DIR, 'kreona.db')

type GlobalDb = typeof globalThis & { __kreonaSqlite?: Database.Database }

function openDb() {
  const g = globalThis as GlobalDb
  if (g.__kreonaSqlite) return g.__kreonaSqlite

  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })

  const db = new Database(DB_PATH)
  db.pragma('journal_mode = WAL')
  db.pragma('synchronous = NORMAL')
  db.pragma('foreign_keys = ON')
  db.pragma('busy_timeout = 5000')
  migrate(db)

  g.__kreonaSqlite = db
  return db
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cars (
      id TEXT PRIMARY KEY,
      image TEXT NOT NULL DEFAULT '',
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      engine TEXT NOT NULL DEFAULT '',
      mileage TEXT NOT NULL DEFAULT '',
      gearbox_key TEXT NOT NULL,
      price TEXT NOT NULL DEFAULT '',
      status_key TEXT NOT NULL,
      route_uk TEXT NOT NULL DEFAULT '',
      route_pl TEXT NOT NULL DEFAULT '',
      route_en TEXT NOT NULL DEFAULT '',
      body_class_uk TEXT NOT NULL DEFAULT '',
      body_class_pl TEXT NOT NULL DEFAULT '',
      body_class_en TEXT NOT NULL DEFAULT '',
      description_uk TEXT NOT NULL DEFAULT '',
      description_pl TEXT NOT NULL DEFAULT '',
      description_en TEXT NOT NULL DEFAULT '',
      format_key TEXT NOT NULL,
      result_key TEXT NOT NULL,
      published INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_cars_published_sort ON cars(published, sort_order, make);

    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT '',
      contact TEXT NOT NULL DEFAULT '',
      car_search TEXT NOT NULL DEFAULT '',
      comment TEXT NOT NULL DEFAULT '',
      source TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      notes TEXT NOT NULL DEFAULT '',
      car_json TEXT,
      utm_json TEXT,
      locale TEXT,
      path TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_leads_status_created ON leads(status, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_leads_contact ON leads(contact);

    CREATE TABLE IF NOT EXISTS analytics_events (
      id TEXT PRIMARY KEY,
      ts TEXT NOT NULL,
      type TEXT NOT NULL,
      path TEXT NOT NULL,
      locale TEXT NOT NULL DEFAULT 'uk',
      referrer TEXT NOT NULL DEFAULT '',
      country TEXT NOT NULL DEFAULT 'Unknown',
      city TEXT NOT NULL DEFAULT '',
      screen_w INTEGER NOT NULL DEFAULT 0,
      screen_h INTEGER NOT NULL DEFAULT 0,
      session_id TEXT NOT NULL,
      x REAL,
      y REAL,
      label TEXT,
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_analytics_ts ON analytics_events(ts);
    CREATE INDEX IF NOT EXISTS idx_analytics_type_ts ON analytics_events(type, ts);
    CREATE INDEX IF NOT EXISTS idx_analytics_path_type_ts ON analytics_events(path, type, ts);
    CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics_events(session_id);
  `)

  const carCols = db.prepare(`PRAGMA table_info(cars)`).all() as { name: string }[]
  if (!carCols.some((c) => c.name === 'images_json')) {
    db.exec(`ALTER TABLE cars ADD COLUMN images_json TEXT NOT NULL DEFAULT '[]'`)
  }
}

export function getDb() {
  return openDb()
}

export function carToRow(c: InventoryCarRecord) {
  const images = normalizeCarImages(c.image, c.images)
  return {
    id: c.id,
    image: images[0] || c.image || '',
    images_json: JSON.stringify(images),
    make: c.make,
    model: c.model,
    year: c.year,
    engine: c.engine,
    mileage: c.mileage,
    gearbox_key: c.gearboxKey,
    price: c.price,
    status_key: c.statusKey,
    route_uk: c.route?.uk || '',
    route_pl: c.route?.pl || '',
    route_en: c.route?.en || '',
    body_class_uk: c.bodyClass?.uk || '',
    body_class_pl: c.bodyClass?.pl || '',
    body_class_en: c.bodyClass?.en || '',
    description_uk: c.description?.uk || '',
    description_pl: c.description?.pl || '',
    description_en: c.description?.en || '',
    format_key: c.formatKey,
    result_key: c.resultKey,
    published: c.published ? 1 : 0,
    sort_order: c.sortOrder,
    created_at: c.createdAt,
    updated_at: c.updatedAt,
  }
}

function parseImagesJson(raw: unknown): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(String(raw)) as unknown
    return Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : []
  } catch {
    return []
  }
}

export function rowToCar(r: Record<string, unknown>): InventoryCarRecord {
  const image = String(r.image || '')
  const images = normalizeCarImages(image, parseImagesJson(r.images_json))
  return {
    id: String(r.id),
    image: images[0] || image,
    images,
    make: String(r.make),
    model: String(r.model),
    year: Number(r.year),
    engine: String(r.engine || ''),
    mileage: String(r.mileage || ''),
    gearboxKey: r.gearbox_key as InventoryCarRecord['gearboxKey'],
    price: String(r.price || ''),
    statusKey: r.status_key as InventoryCarRecord['statusKey'],
    route: { uk: String(r.route_uk || ''), pl: String(r.route_pl || ''), en: String(r.route_en || '') },
    bodyClass: {
      uk: String(r.body_class_uk || ''),
      pl: String(r.body_class_pl || ''),
      en: String(r.body_class_en || ''),
    },
    description: {
      uk: String(r.description_uk || ''),
      pl: String(r.description_pl || ''),
      en: String(r.description_en || ''),
    },
    formatKey: r.format_key as InventoryCarRecord['formatKey'],
    resultKey: r.result_key as InventoryCarRecord['resultKey'],
    published: Boolean(r.published),
    sortOrder: Number(r.sort_order || 0),
    createdAt: String(r.created_at),
    updatedAt: String(r.updated_at),
  }
}

export function leadToRow(l: LeadRecord) {
  return {
    id: l.id,
    created_at: l.createdAt,
    name: l.name,
    contact: l.contact,
    car_search: l.carSearch,
    comment: l.comment,
    source: l.source,
    status: l.status,
    notes: l.notes,
    car_json: l.car ? JSON.stringify(l.car) : null,
    utm_json: l.utm ? JSON.stringify(l.utm) : null,
    locale: l.locale ?? null,
    path: l.path ?? null,
  }
}

export function rowToLead(r: Record<string, unknown>): LeadRecord {
  return {
    id: String(r.id),
    createdAt: String(r.created_at),
    name: String(r.name || ''),
    contact: String(r.contact || ''),
    carSearch: String(r.car_search || ''),
    comment: String(r.comment || ''),
    source: r.source as LeadRecord['source'],
    status: r.status as LeadRecord['status'],
    notes: String(r.notes || ''),
    car: r.car_json ? (JSON.parse(String(r.car_json)) as LeadRecord['car']) : undefined,
    utm: r.utm_json ? (JSON.parse(String(r.utm_json)) as LeadRecord['utm']) : undefined,
    locale: r.locale ? String(r.locale) : undefined,
    path: r.path ? String(r.path) : undefined,
  }
}

export function eventToRow(e: AnalyticsEvent) {
  return {
    id: e.id,
    ts: e.ts,
    type: e.type,
    path: e.path,
    locale: e.locale || 'uk',
    referrer: e.referrer || '',
    country: e.country || 'Unknown',
    city: e.city || '',
    screen_w: e.screenW || 0,
    screen_h: e.screenH || 0,
    session_id: e.sessionId,
    x: e.x ?? null,
    y: e.y ?? null,
    label: e.label ?? null,
    utm_source: e.utm_source ?? null,
    utm_medium: e.utm_medium ?? null,
    utm_campaign: e.utm_campaign ?? null,
  }
}

export function rowToEvent(r: Record<string, unknown>): AnalyticsEvent {
  return {
    id: String(r.id),
    ts: String(r.ts),
    type: r.type as AnalyticsEvent['type'],
    path: String(r.path),
    locale: String(r.locale || 'uk'),
    referrer: String(r.referrer || ''),
    country: String(r.country || 'Unknown'),
    city: String(r.city || ''),
    screenW: Number(r.screen_w || 0),
    screenH: Number(r.screen_h || 0),
    sessionId: String(r.session_id),
    x: r.x == null ? undefined : Number(r.x),
    y: r.y == null ? undefined : Number(r.y),
    label: r.label == null ? undefined : String(r.label),
    utm_source: r.utm_source == null ? undefined : String(r.utm_source),
    utm_medium: r.utm_medium == null ? undefined : String(r.utm_medium),
    utm_campaign: r.utm_campaign == null ? undefined : String(r.utm_campaign),
  }
}

export async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true })
}
