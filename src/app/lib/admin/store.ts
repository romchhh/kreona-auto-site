import { randomUUID } from 'crypto'
import {
  carToRow,
  eventToRow,
  getDb,
  leadToRow,
  rowToCar,
  rowToEvent,
  rowToLead,
} from './db'
import type { AnalyticsEvent, InventoryCarRecord, LeadRecord, LeadStatus } from './types'

const ANALYTICS_RETENTION_MS = 1000 * 60 * 60 * 24 * 90
const ANALYTICS_MAX_ROWS = 50_000

/* ─── Cars ─── */

export async function listCars(): Promise<InventoryCarRecord[]> {
  const rows = getDb()
    .prepare('SELECT * FROM cars ORDER BY sort_order ASC, make ASC')
    .all() as Record<string, unknown>[]
  return rows.map(rowToCar)
}

export async function listPublishedCars(): Promise<InventoryCarRecord[]> {
  const rows = getDb()
    .prepare('SELECT * FROM cars WHERE published = 1 ORDER BY sort_order ASC, make ASC')
    .all() as Record<string, unknown>[]
  return rows.map(rowToCar)
}

export async function getCar(id: string) {
  const row = getDb().prepare('SELECT * FROM cars WHERE id = ?').get(id) as Record<string, unknown> | undefined
  return row ? rowToCar(row) : null
}

export async function upsertCar(car: InventoryCarRecord) {
  getDb()
    .prepare(
      `INSERT INTO cars (
        id, image, images_json, make, model, year, engine, mileage, gearbox_key, price, status_key,
        route_uk, route_pl, route_en, body_class_uk, body_class_pl, body_class_en,
        description_uk, description_pl, description_en, format_key, result_key,
        published, sort_order, created_at, updated_at
      ) VALUES (
        @id, @image, @images_json, @make, @model, @year, @engine, @mileage, @gearbox_key, @price, @status_key,
        @route_uk, @route_pl, @route_en, @body_class_uk, @body_class_pl, @body_class_en,
        @description_uk, @description_pl, @description_en, @format_key, @result_key,
        @published, @sort_order, @created_at, @updated_at
      )
      ON CONFLICT(id) DO UPDATE SET
        image = excluded.image,
        images_json = excluded.images_json,
        make = excluded.make,
        model = excluded.model,
        year = excluded.year,
        engine = excluded.engine,
        mileage = excluded.mileage,
        gearbox_key = excluded.gearbox_key,
        price = excluded.price,
        status_key = excluded.status_key,
        route_uk = excluded.route_uk,
        route_pl = excluded.route_pl,
        route_en = excluded.route_en,
        body_class_uk = excluded.body_class_uk,
        body_class_pl = excluded.body_class_pl,
        body_class_en = excluded.body_class_en,
        description_uk = excluded.description_uk,
        description_pl = excluded.description_pl,
        description_en = excluded.description_en,
        format_key = excluded.format_key,
        result_key = excluded.result_key,
        published = excluded.published,
        sort_order = excluded.sort_order,
        updated_at = excluded.updated_at`,
    )
    .run(carToRow(car))
  return car
}

export async function deleteCar(id: string) {
  getDb().prepare('DELETE FROM cars WHERE id = ?').run(id)
}

/* ─── Leads ─── */

export type ListLeadsOptions = {
  q?: string
  status?: string
  sort?: 'newest' | 'oldest' | 'name'
  limit?: number
  offset?: number
}

export async function listLeads(options: ListLeadsOptions = {}): Promise<LeadRecord[]> {
  const { q = '', status = 'all', sort = 'newest', limit, offset = 0 } = options
  const where: string[] = []
  const params: unknown[] = []

  if (status !== 'all') {
    where.push('status = ?')
    params.push(status)
  }
  if (q.trim()) {
    where.push(
      `(lower(name) LIKE ? OR lower(contact) LIKE ? OR lower(car_search) LIKE ? OR lower(comment) LIKE ? OR lower(COALESCE(car_json, '')) LIKE ?)`,
    )
    const like = `%${q.trim().toLowerCase()}%`
    params.push(like, like, like, like, like)
  }

  const order =
    sort === 'oldest' ? 'created_at ASC' : sort === 'name' ? 'name COLLATE NOCASE ASC' : 'created_at DESC'

  let sql = `SELECT * FROM leads ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY ${order}`
  if (limit != null) {
    sql += ' LIMIT ? OFFSET ?'
    params.push(limit, offset)
  }

  const rows = getDb().prepare(sql).all(...params) as Record<string, unknown>[]
  return rows.map(rowToLead)
}

export async function countLeads(status = 'all') {
  if (status === 'all') {
    return (getDb().prepare('SELECT COUNT(*) AS n FROM leads').get() as { n: number }).n
  }
  return (getDb().prepare('SELECT COUNT(*) AS n FROM leads WHERE status = ?').get(status) as { n: number }).n
}

export async function countCars() {
  return (getDb().prepare('SELECT COUNT(*) AS n FROM cars').get() as { n: number }).n
}

export async function addLead(
  input: Omit<LeadRecord, 'id' | 'createdAt' | 'status' | 'notes'> & {
    status?: LeadRecord['status']
    notes?: string
  },
) {
  const lead: LeadRecord = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: input.status ?? 'new',
    notes: input.notes ?? '',
    name: input.name,
    contact: input.contact,
    carSearch: input.carSearch,
    comment: input.comment,
    source: input.source,
    car: input.car,
    utm: input.utm,
    locale: input.locale,
    path: input.path,
  }
  getDb()
    .prepare(
      `INSERT INTO leads (
        id, created_at, name, contact, car_search, comment, source, status, notes,
        car_json, utm_json, locale, path
      ) VALUES (
        @id, @created_at, @name, @contact, @car_search, @comment, @source, @status, @notes,
        @car_json, @utm_json, @locale, @path
      )`,
    )
    .run(leadToRow(lead))
  return lead
}

export async function updateLead(id: string, patch: Partial<LeadRecord>) {
  const existing = getDb().prepare('SELECT * FROM leads WHERE id = ?').get(id) as Record<string, unknown> | undefined
  if (!existing) return null
  const current = rowToLead(existing)
  const next: LeadRecord = {
    ...current,
    ...patch,
    id: current.id,
    createdAt: current.createdAt,
  }
  getDb()
    .prepare(
      `UPDATE leads SET
        name = @name,
        contact = @contact,
        car_search = @car_search,
        comment = @comment,
        source = @source,
        status = @status,
        notes = @notes,
        car_json = @car_json,
        utm_json = @utm_json,
        locale = @locale,
        path = @path
      WHERE id = @id`,
    )
    .run(leadToRow(next))
  return next
}

export async function deleteLead(id: string) {
  getDb().prepare('DELETE FROM leads WHERE id = ?').run(id)
}

export async function listClients(q = '') {
  const rows = getDb()
    .prepare(
      `SELECT
        contact,
        name,
        created_at,
        source,
        car_search
      FROM leads
      WHERE trim(contact) != ''
      ORDER BY created_at DESC`,
    )
    .all() as {
    contact: string
    name: string
    created_at: string
    source: string
    car_search: string
  }[]

  const map = new Map<
    string,
    {
      contact: string
      name: string
      leads: number
      lastAt: string
      sources: string[]
      carSearches: string[]
    }
  >()

  for (const row of rows) {
    const key = row.contact.trim().toLowerCase()
    if (!key) continue
    const existing = map.get(key)
    if (!existing) {
      map.set(key, {
        contact: row.contact,
        name: row.name,
        leads: 1,
        lastAt: row.created_at,
        sources: [row.source],
        carSearches: row.car_search && row.car_search !== '-' ? [row.car_search] : [],
      })
    } else {
      existing.leads += 1
      if (!existing.sources.includes(row.source)) existing.sources.push(row.source)
      if (row.car_search && row.car_search !== '-' && !existing.carSearches.includes(row.car_search)) {
        existing.carSearches.push(row.car_search)
      }
    }
  }

  let clients = Array.from(map.values()).sort((a, b) => b.lastAt.localeCompare(a.lastAt))
  if (q.trim()) {
    const needle = q.trim().toLowerCase()
    clients = clients.filter(
      (c) =>
        c.name.toLowerCase().includes(needle) ||
        c.contact.toLowerCase().includes(needle) ||
        c.carSearches.some((s) => s.toLowerCase().includes(needle)),
    )
  }
  return clients
}

export async function leadsByStatusCounts(): Promise<Record<LeadStatus, number>> {
  const rows = getDb()
    .prepare('SELECT status, COUNT(*) AS n FROM leads GROUP BY status')
    .all() as { status: LeadStatus; n: number }[]
  const out: Record<LeadStatus, number> = { new: 0, in_progress: 0, done: 0, spam: 0 }
  for (const row of rows) {
    if (row.status in out) out[row.status] = row.n
  }
  return out
}

/* ─── Analytics ─── */

export async function listAnalyticsEvents(sinceIso?: string, limit = 50_000): Promise<AnalyticsEvent[]> {
  const rows = (
    sinceIso
      ? getDb()
          .prepare('SELECT * FROM analytics_events WHERE ts >= ? ORDER BY ts DESC LIMIT ?')
          .all(sinceIso, limit)
      : getDb().prepare('SELECT * FROM analytics_events ORDER BY ts DESC LIMIT ?').all(limit)
  ) as Record<string, unknown>[]
  return rows.map(rowToEvent)
}

export async function addAnalyticsEvents(events: Omit<AnalyticsEvent, 'id' | 'ts'>[]) {
  if (!events.length) return
  const db = getDb()
  const insert = db.prepare(`
    INSERT INTO analytics_events (
      id, ts, type, path, locale, referrer, country, city, screen_w, screen_h,
      session_id, x, y, label, utm_source, utm_medium, utm_campaign
    ) VALUES (
      @id, @ts, @type, @path, @locale, @referrer, @country, @city, @screen_w, @screen_h,
      @session_id, @x, @y, @label, @utm_source, @utm_medium, @utm_campaign
    )
  `)

  const now = new Date().toISOString()
  const tx = db.transaction((batch: Omit<AnalyticsEvent, 'id' | 'ts'>[]) => {
    for (const e of batch) {
      insert.run(
        eventToRow({
          ...e,
          id: randomUUID(),
          ts: now,
        }),
      )
    }

    const cutoff = new Date(Date.now() - ANALYTICS_RETENTION_MS).toISOString()
    db.prepare('DELETE FROM analytics_events WHERE ts < ?').run(cutoff)

    const count = (db.prepare('SELECT COUNT(*) AS n FROM analytics_events').get() as { n: number }).n
    if (count > ANALYTICS_MAX_ROWS) {
      db.prepare(
        `DELETE FROM analytics_events WHERE id IN (
          SELECT id FROM analytics_events ORDER BY ts ASC LIMIT ?
        )`,
      ).run(count - ANALYTICS_MAX_ROWS)
    }
  })

  tx(events)
}

/* ─── Settings ─── */

const LEAD_NOTIFY_EMAILS_KEY = 'lead_notify_emails'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function metaGet(key: string) {
  return (getDb().prepare('SELECT value FROM meta WHERE key = ?').get(key) as { value: string } | undefined)
    ?.value
}

function metaSet(key: string, value: string) {
  getDb()
    .prepare(
      `INSERT INTO meta(key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    )
    .run(key, value)
}

function normalizeEmails(input: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const raw of input) {
    const email = raw.trim().toLowerCase()
    if (!email || !EMAIL_RE.test(email) || seen.has(email)) continue
    seen.add(email)
    out.push(email)
  }
  return out
}

function envFallbackEmails(): string[] {
  const raw = process.env.EMAIL_TO?.trim().replace(/^['"]|['"]$/g, '') || ''
  if (!raw) return []
  return normalizeEmails(raw.split(/[,;\s]+/))
}

export async function getLeadNotifyEmails(): Promise<string[]> {
  const raw = metaGet(LEAD_NOTIFY_EMAILS_KEY)
  if (raw == null) {
    const fallback = envFallbackEmails()
    if (fallback.length) metaSet(LEAD_NOTIFY_EMAILS_KEY, JSON.stringify(fallback))
    return fallback
  }
  try {
    const parsed = JSON.parse(raw) as unknown
    if (Array.isArray(parsed)) return normalizeEmails(parsed.map(String))
  } catch {
    /* ignore */
  }
  return normalizeEmails(raw.split(/[,;\s]+/))
}

export async function setLeadNotifyEmails(emails: string[]) {
  const next = normalizeEmails(emails)
  metaSet(LEAD_NOTIFY_EMAILS_KEY, JSON.stringify(next))
  return next
}

export function isValidEmail(email: string) {
  return EMAIL_RE.test(email.trim().toLowerCase())
}
