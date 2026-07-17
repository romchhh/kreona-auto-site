import { getDb } from './db'
import { getKnownSitePaths } from './sitePaths'
import type { LeadRecord } from './types'

export { getKnownSitePaths } from './sitePaths'

function startOfDayIso(d = new Date()) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  return x.toISOString()
}

function sinceIso(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

function hostFromReferrer(ref: string) {
  if (!ref || ref === 'Direct') return 'Direct'
  try {
    if (ref.startsWith('http')) return new URL(ref).hostname
  } catch {
    /* keep */
  }
  return ref
}

export async function getDashboardStats(days = 30) {
  const db = getDb()
  const since = sinceIso(days)
  const today = startOfDayIso()

  const countType = (type: string) =>
    (db.prepare(`SELECT COUNT(*) AS n FROM analytics_events WHERE type = ? AND ts >= ?`).get(type, since) as {
      n: number
    }).n

  const pageviews = countType('pageview')
  const clicks = countType('click')
  const conversions = countType('conversion')

  const sessions = (
    db
      .prepare(
        `SELECT COUNT(DISTINCT session_id) AS n
         FROM analytics_events
         WHERE type = 'pageview' AND ts >= ?`,
      )
      .get(since) as { n: number }
  ).n

  const leadsRecent = (
    db.prepare(`SELECT COUNT(*) AS n FROM leads WHERE created_at >= ?`).get(since) as { n: number }
  ).n

  const todayViews = (
    db
      .prepare(`SELECT COUNT(*) AS n FROM analytics_events WHERE type = 'pageview' AND ts >= ?`)
      .get(today) as { n: number }
  ).n

  const todayLeads = (
    db.prepare(`SELECT COUNT(*) AS n FROM leads WHERE created_at >= ?`).get(today) as { n: number }
  ).n

  const newLeads = (
    db.prepare(`SELECT COUNT(*) AS n FROM leads WHERE status = 'new'`).get() as { n: number }
  ).n

  const statusRows = db
    .prepare(`SELECT status, COUNT(*) AS n FROM leads GROUP BY status`)
    .all() as { status: string; n: number }[]
  const leadsByStatus = {
    new: 0,
    in_progress: 0,
    done: 0,
    spam: 0,
  }
  for (const row of statusRows) {
    if (row.status in leadsByStatus) {
      leadsByStatus[row.status as keyof typeof leadsByStatus] = row.n
    }
  }

  // Fill day buckets in JS (small fixed 30/90 rows), fill from SQL aggregates
  const byDayMap = new Map<string, { views: number; sessions: number; conversions: number; leads: number }>()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    byDayMap.set(d.toISOString().slice(0, 10), { views: 0, sessions: 0, conversions: 0, leads: 0 })
  }

  const viewsByDay = db
    .prepare(
      `SELECT substr(ts, 1, 10) AS day, COUNT(*) AS views, COUNT(DISTINCT session_id) AS sessions
       FROM analytics_events
       WHERE type = 'pageview' AND ts >= ?
       GROUP BY day`,
    )
    .all(since) as { day: string; views: number; sessions: number }[]
  for (const row of viewsByDay) {
    const bucket = byDayMap.get(row.day)
    if (bucket) {
      bucket.views = row.views
      bucket.sessions = row.sessions
    }
  }

  const convByDay = db
    .prepare(
      `SELECT substr(ts, 1, 10) AS day, COUNT(*) AS n
       FROM analytics_events
       WHERE type = 'conversion' AND ts >= ?
       GROUP BY day`,
    )
    .all(since) as { day: string; n: number }[]
  for (const row of convByDay) {
    const bucket = byDayMap.get(row.day)
    if (bucket) bucket.conversions = row.n
  }

  const leadsByDay = db
    .prepare(
      `SELECT substr(created_at, 1, 10) AS day, COUNT(*) AS n
       FROM leads
       WHERE created_at >= ?
       GROUP BY day`,
    )
    .all(since) as { day: string; n: number }[]
  for (const row of leadsByDay) {
    const bucket = byDayMap.get(row.day)
    if (bucket) bucket.leads = row.n
  }

  const topPages = (
    db
      .prepare(
        `SELECT path, COUNT(*) AS n
         FROM analytics_events
         WHERE type = 'pageview' AND ts >= ?
         GROUP BY path
         ORDER BY n DESC
         LIMIT 10`,
      )
      .all(since) as { path: string; n: number }[]
  ).map((r) => [r.path, r.n] as [string, number])

  const countries = (
    db
      .prepare(
        `SELECT COALESCE(NULLIF(country, ''), 'Unknown') AS country, COUNT(*) AS n
         FROM analytics_events
         WHERE type = 'pageview' AND ts >= ?
         GROUP BY country
         ORDER BY n DESC
         LIMIT 10`,
      )
      .all(since) as { country: string; n: number }[]
  ).map((r) => [r.country, r.n] as [string, number])

  const locales = (
    db
      .prepare(
        `SELECT COALESCE(NULLIF(locale, ''), 'uk') AS locale, COUNT(*) AS n
         FROM analytics_events
         WHERE type = 'pageview' AND ts >= ?
         GROUP BY locale
         ORDER BY n DESC
         LIMIT 10`,
      )
      .all(since) as { locale: string; n: number }[]
  ).map((r) => [r.locale, r.n] as [string, number])

  const referrerRows = db
    .prepare(
      `SELECT CASE WHEN referrer IS NULL OR referrer = '' THEN 'Direct' ELSE referrer END AS referrer,
              COUNT(*) AS n
       FROM analytics_events
       WHERE type = 'pageview' AND ts >= ?
       GROUP BY referrer
       ORDER BY n DESC
       LIMIT 25`,
    )
    .all(since) as { referrer: string; n: number }[]
  const referrerMap = new Map<string, number>()
  for (const row of referrerRows) {
    const host = hostFromReferrer(row.referrer)
    referrerMap.set(host, (referrerMap.get(host) || 0) + row.n)
  }
  const referrers = Array.from(referrerMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  const utmSources = (
    db
      .prepare(
        `SELECT COALESCE(NULLIF(utm_source, ''), '(none)') AS src, COUNT(*) AS n
         FROM analytics_events
         WHERE type = 'pageview' AND ts >= ?
         GROUP BY src
         ORDER BY n DESC
         LIMIT 10`,
      )
      .all(since) as { src: string; n: number }[]
  ).map((r) => [r.src, r.n] as [string, number])

  // Site map / heatmap: path aggregates in SQL; click points loaded once (bounded)
  const pathStats = db
    .prepare(
      `SELECT
         path,
         SUM(CASE WHEN type = 'pageview' THEN 1 ELSE 0 END) AS views,
         SUM(CASE WHEN type = 'click' AND x IS NOT NULL AND y IS NOT NULL THEN 1 ELSE 0 END) AS clicks,
         COUNT(DISTINCT CASE WHEN type = 'pageview' THEN session_id END) AS sessions,
         COUNT(DISTINCT CASE WHEN type = 'click' AND x IS NOT NULL AND y IS NOT NULL THEN session_id END) AS click_sessions
       FROM analytics_events
       WHERE ts >= ?
         AND path NOT LIKE '/admin%'
         AND path NOT LIKE '/api%'
       GROUP BY path`,
    )
    .all(since) as {
    path: string
    views: number
    clicks: number
    sessions: number
    click_sessions: number
  }[]

  const pathMap = new Map(pathStats.map((r) => [r.path, r]))
  const allPaths = new Set<string>([...getKnownSitePaths(), ...Array.from(pathMap.keys())])

  const clickRows = db
    .prepare(
      `SELECT path, x, y, label, ts, session_id
       FROM analytics_events
       WHERE type = 'click' AND ts >= ? AND x IS NOT NULL AND y IS NOT NULL
         AND path NOT LIKE '/admin%'
         AND path NOT LIKE '/api%'
       ORDER BY ts DESC
       LIMIT 40000`,
    )
    .all(since) as {
    path: string
    x: number
    y: number
    label: string | null
    ts: string
    session_id: string
  }[]

  const pointsByPath = new Map<
    string,
    { x: number; y: number; label?: string; ts: string; sessionId: string }[]
  >()
  for (const row of clickRows) {
    const list = pointsByPath.get(row.path) || []
    if (list.length >= 2000) continue
    list.push({
      x: row.x,
      y: row.y,
      label: row.label || undefined,
      ts: row.ts,
      sessionId: row.session_id,
    })
    pointsByPath.set(row.path, list)
  }

  const siteMap = Array.from(allPaths)
    .filter((path) => !path.startsWith('/admin') && !path.startsWith('/api'))
    .map((path) => {
      const agg = pathMap.get(path)
      const views = agg?.views || 0
      const clicksCount = agg?.clicks || 0
      const pageSessions = agg?.sessions || 0
      const clickSessions = agg?.click_sessions || 0
      const points = pointsByPath.get(path) || []

      const labelCounts = new Map<string, number>()
      const zones = { hero: 0, middle: 0, bottom: 0 }
      for (const p of points) {
        const label = (p.label || 'click').trim() || 'click'
        labelCounts.set(label, (labelCounts.get(label) || 0) + 1)
        if (p.y < 33) zones.hero += 1
        else if (p.y < 66) zones.middle += 1
        else zones.bottom += 1
      }

      const topElements = Array.from(labelCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([label, count]) => ({ label, count }))

      const ctr = views ? Math.round((clicksCount / views) * 1000) / 10 : 0

      return {
        path,
        views,
        clicks: clicksCount,
        sessions: pageSessions,
        clickSessions,
        ctr,
        zones,
        topElements,
        points: points.map(({ x, y, label, ts }) => ({ x, y, label, ts })),
      }
    })
    .sort((a, b) => b.views - a.views || b.clicks - a.clicks || a.path.localeCompare(b.path))

  const conversionRate = sessions ? (leadsRecent / sessions) * 100 : 0

  return {
    days,
    totals: {
      pageviews,
      sessions,
      clicks,
      conversions: conversions + leadsRecent,
      leads: leadsRecent,
      todayViews,
      todayLeads,
      conversionRate: Math.round(conversionRate * 10) / 10,
      newLeads,
      pagesTracked: siteMap.length,
    },
    byDay: Array.from(byDayMap.entries()).map(([date, row]) => ({
      date,
      views: row.views,
      sessions: row.sessions,
      conversions: row.conversions,
      leads: row.leads,
    })),
    topPages,
    countries,
    locales,
    referrers,
    utmSources,
    siteMap,
    leadsByStatus,
  }
}

/** @deprecated Prefer listClients() from store */
export function buildClientsFromLeads(leads: LeadRecord[]) {
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

  for (const lead of leads) {
    const key = lead.contact.trim().toLowerCase()
    if (!key) continue
    const existing = map.get(key)
    if (!existing) {
      map.set(key, {
        contact: lead.contact,
        name: lead.name,
        leads: 1,
        lastAt: lead.createdAt,
        sources: [lead.source],
        carSearches: lead.carSearch && lead.carSearch !== '-' ? [lead.carSearch] : [],
      })
    } else {
      existing.leads += 1
      if (lead.createdAt > existing.lastAt) {
        existing.lastAt = lead.createdAt
        existing.name = lead.name || existing.name
      }
      if (!existing.sources.includes(lead.source)) existing.sources.push(lead.source)
      if (lead.carSearch && lead.carSearch !== '-' && !existing.carSearches.includes(lead.carSearch)) {
        existing.carSearches.push(lead.carSearch)
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => b.lastAt.localeCompare(a.lastAt))
}
