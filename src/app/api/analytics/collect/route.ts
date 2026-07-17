import { NextResponse } from 'next/server'
import { addAnalyticsEvents } from '../../../lib/admin/store'
import type { AnalyticsEvent } from '../../../lib/admin/types'

type Incoming = Partial<Omit<AnalyticsEvent, 'id' | 'ts'>> & { type?: AnalyticsEvent['type'] }

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const items: Incoming[] = Array.isArray(body) ? body : Array.isArray(body?.events) ? body.events : [body]
    const events = items
      .filter((e) => e && (e.type === 'pageview' || e.type === 'click' || e.type === 'conversion'))
      .slice(0, 40)
      .map((e) => ({
        type: e.type as AnalyticsEvent['type'],
        path: String(e.path || '/').slice(0, 300),
        locale: String(e.locale || 'uk').slice(0, 8),
        referrer: String(e.referrer || '').slice(0, 400),
        country: String(e.country || 'Unknown').slice(0, 64),
        city: String(e.city || '').slice(0, 64),
        screenW: Number(e.screenW) || 0,
        screenH: Number(e.screenH) || 0,
        sessionId: String(e.sessionId || 'anon').slice(0, 64),
        x: e.x != null ? Number(e.x) : undefined,
        y: e.y != null ? Number(e.y) : undefined,
        label: e.label ? String(e.label).slice(0, 120) : undefined,
        utm_source: e.utm_source ? String(e.utm_source).slice(0, 80) : undefined,
        utm_medium: e.utm_medium ? String(e.utm_medium).slice(0, 80) : undefined,
        utm_campaign: e.utm_campaign ? String(e.utm_campaign).slice(0, 80) : undefined,
      }))

    if (events.length) await addAnalyticsEvents(events)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}
