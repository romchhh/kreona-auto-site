'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

function getSessionId() {
  try {
    const key = 'kreona_sid'
    let id = localStorage.getItem(key)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(key, id)
    }
    return id
  } catch {
    return 'anon'
  }
}

function readUtm() {
  try {
    const raw = localStorage.getItem('kreona_utm')
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, string>
  } catch {
    return {}
  }
}

function guessCountry() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
    if (tz.includes('Warsaw') || tz.includes('Poland')) return 'Poland'
    if (tz.includes('Kyiv') || tz.includes('Ukraine')) return 'Ukraine'
    if (tz.includes('Berlin')) return 'Germany'
    if (tz.includes('London')) return 'United Kingdom'
    if (tz.startsWith('America/')) return 'USA/Canada'
    if (tz.startsWith('Europe/')) return 'Europe'
    return tz.split('/')[0] || 'Unknown'
  } catch {
    return 'Unknown'
  }
}

function localeFromPath(pathname: string) {
  const seg = pathname.split('/')[1]
  if (seg === 'uk' || seg === 'pl' || seg === 'en') return seg
  return 'uk'
}

function send(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload)
  try {
    void fetch('/api/analytics/collect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    })
  } catch {
    try {
      navigator.sendBeacon?.('/api/analytics/collect', new Blob([body], { type: 'application/json' }))
    } catch {
      /* ignore */
    }
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const lastPath = useRef('')
  const lastClickAt = useRef(0)

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return
    if (typeof window !== 'undefined' && window.self !== window.top) return
    if (lastPath.current === pathname) return
    lastPath.current = pathname

    const utm = readUtm()
    send({
      type: 'pageview',
      path: pathname,
      locale: localeFromPath(pathname),
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      country: guessCountry(),
      city: '',
      screenW: window.innerWidth,
      screenH: window.innerHeight,
      sessionId: getSessionId(),
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
    })
  }, [pathname])

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return
    if (typeof window !== 'undefined' && window.self !== window.top) return

    const onClick = (event: MouseEvent) => {
      const now = Date.now()
      if (now - lastClickAt.current < 80) return
      lastClickAt.current = now

      const target = event.target as HTMLElement | null
      if (!target) return

      const doc = document.documentElement
      const docW = Math.max(doc.scrollWidth, doc.clientWidth, window.innerWidth, 1)
      const docH = Math.max(doc.scrollHeight, doc.clientHeight, window.innerHeight, 1)
      const pageX = event.clientX + window.scrollX
      const pageY = event.clientY + window.scrollY
      const x = Math.min(100, Math.max(0, Math.round((pageX / docW) * 1000) / 10))
      const y = Math.min(100, Math.max(0, Math.round((pageY / docH) * 1000) / 10))
      const label =
        target.closest('a,button,[role="button"]')?.textContent?.trim().replace(/\s+/g, ' ').slice(0, 80) ||
        target.tagName

      const utm = readUtm()
      send({
        type: 'click',
        path: pathname,
        locale: localeFromPath(pathname),
        referrer: document.referrer || '',
        country: guessCountry(),
        city: '',
        screenW: window.innerWidth,
        screenH: window.innerHeight,
        sessionId: getSessionId(),
        x,
        y,
        label,
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
      })
    }

    window.addEventListener('click', onClick, { passive: true, capture: true })
    return () => window.removeEventListener('click', onClick, true)
  }, [pathname])

  return null
}
