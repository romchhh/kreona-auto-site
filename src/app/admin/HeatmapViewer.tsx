'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styles from './admin.module.css'

export type HeatClick = {
  x: number
  y: number
  label?: string
  ts?: string
}

export type HeatPage = {
  path: string
  views: number
  clicks: number
  sessions?: number
  clickSessions?: number
  ctr?: number
  zones?: { hero: number; middle: number; bottom: number }
  topElements?: { label: string; count: number }[]
  points: HeatClick[]
}

type Props = {
  pages: HeatPage[]
  siteUrl?: string
}

/** Canonical desktop capture size used by heatmap tools (Hotjar / Clarity style). */
const DEVICE_W = 1440
const DEVICE_VH = 900

function pageLabel(path: string) {
  if (path === '/' || /^\/(uk|pl|en)$/.test(path)) return 'Головна'
  if (path.includes('/avto')) return 'Авто в наявності'
  if (path.includes('/kontakty')) return 'Контакти'
  if (path.includes('/pidbir')) return 'Підбір'
  if (path.includes('/vodnyy')) return 'Водний транспорт'
  if (path.includes('/gabaryt')) return 'Габарит'
  if (path.includes('/polityka')) return 'Політика'
  return path
}

function localeOf(path: string) {
  const seg = path.split('/')[1]
  if (seg === 'uk' || seg === 'pl' || seg === 'en') return seg
  return '—'
}

function heatColor(t: number): [number, number, number, number] {
  // Classic heat ramp: transparent → blue → cyan → green → yellow → red
  const stops: [number, number, number, number, number][] = [
    [0, 0, 0, 0, 0],
    [0.15, 30, 80, 220, 90],
    [0.35, 0, 200, 200, 130],
    [0.55, 40, 200, 40, 160],
    [0.75, 240, 220, 20, 190],
    [1, 240, 40, 10, 220],
  ]
  let i = 1
  while (i < stops.length - 1 && t > stops[i][0]) i += 1
  const a = stops[i - 1]
  const b = stops[i]
  const span = b[0] - a[0] || 1
  const u = (t - a[0]) / span
  return [
    Math.round(a[1] + (b[1] - a[1]) * u),
    Math.round(a[2] + (b[2] - a[2]) * u),
    Math.round(a[3] + (b[3] - a[3]) * u),
    Math.round(a[4] + (b[4] - a[4]) * u),
  ]
}

function drawHeatmap(
  canvas: HTMLCanvasElement,
  points: HeatClick[],
  width: number,
  height: number,
) {
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)
  if (!points.length) return

  const intensity = document.createElement('canvas')
  intensity.width = width
  intensity.height = height
  const ictx = intensity.getContext('2d')
  if (!ictx) return

  const radius = Math.max(48, Math.min(width, height) * 0.045)
  for (const p of points) {
    const x = (p.x / 100) * width
    const y = (p.y / 100) * height
    const g = ictx.createRadialGradient(x, y, 0, x, y, radius)
    g.addColorStop(0, 'rgba(0,0,0,0.55)')
    g.addColorStop(0.45, 'rgba(0,0,0,0.18)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ictx.fillStyle = g
    ictx.beginPath()
    ictx.arc(x, y, radius, 0, Math.PI * 2)
    ictx.fill()
  }

  const img = ictx.getImageData(0, 0, width, height)
  const out = ctx.createImageData(width, height)
  let maxA = 1
  for (let i = 3; i < img.data.length; i += 4) {
    if (img.data[i] > maxA) maxA = img.data[i]
  }
  for (let i = 0; i < img.data.length; i += 4) {
    const t = img.data[i + 3] / maxA
    if (t < 0.04) continue
    const [r, g, b, a] = heatColor(t)
    out.data[i] = r
    out.data[i + 1] = g
    out.data[i + 2] = b
    out.data[i + 3] = a
  }
  ctx.putImageData(out, 0, 0)
}

function prepareIframeDocument(doc: Document) {
  const style = doc.createElement('style')
  style.setAttribute('data-kreona-heatmap', '1')
  style.textContent = `
    html, body {
      height: auto !important;
      min-height: 0 !important;
      overflow-x: hidden !important;
      overflow-y: visible !important;
    }
    /* Freeze 100vh to capture viewport — prevents hero from swallowing the page */
    #hero,
    .hero,
    [class*="Hero_hero"] {
      height: ${DEVICE_VH}px !important;
      min-height: ${DEVICE_VH}px !important;
      max-height: ${DEVICE_VH}px !important;
    }
    [class*="FloatingCtaButton"] {
      display: none !important;
    }
  `
  doc.head.appendChild(style)
}

export default function HeatmapViewer({ pages, siteUrl = '' }: Props) {
  const ranked = useMemo(
    () => [...pages].sort((a, b) => b.clicks - a.clicks || b.views - a.views || a.path.localeCompare(b.path)),
    [pages],
  )
  const [localeFilter, setLocaleFilter] = useState<'all' | 'uk' | 'pl' | 'en'>('all')
  const filtered = useMemo(
    () => (localeFilter === 'all' ? ranked : ranked.filter((p) => localeOf(p.path) === localeFilter)),
    [ranked, localeFilter],
  )
  const [path, setPath] = useState(filtered[0]?.path || '/uk')
  const [contentH, setContentH] = useState(DEVICE_VH)
  const [iframeH, setIframeH] = useState(DEVICE_VH)
  const [scale, setScale] = useState(0.5)
  const [loading, setLoading] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)
  const active = filtered.find((p) => p.path === path) || filtered[0]
  const maxViews = Math.max(1, ...filtered.map((p) => p.views))
  const points = active?.points || []

  useEffect(() => {
    if (!filtered.some((p) => p.path === path) && filtered[0]) {
      setPath(filtered[0].path)
    }
  }, [filtered, path])

  useEffect(() => {
    setLoading(true)
    setIframeH(DEVICE_VH)
    setContentH(DEVICE_VH)
  }, [path])

  useEffect(() => {
    const el = shellRef.current
    if (!el) return
    const update = () => {
      const w = el.clientWidth || DEVICE_W
      setScale(Math.min(1, w / DEVICE_W))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const paint = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawHeatmap(canvas, points, DEVICE_W, contentH)
  }, [points, contentH])

  useEffect(() => {
    paint()
  }, [paint])

  const onFrameLoad = () => {
    const doc = iframeRef.current?.contentDocument
    if (!doc) {
      setLoading(false)
      setIframeH(2800)
      setContentH(2800)
      return
    }

    try {
      if (!doc.head.querySelector('[data-kreona-heatmap]')) {
        prepareIframeDocument(doc)
      }

      // Measure while iframe viewport is still DEVICE_VH so 100vh ≈ desktop fold.
      const measure = () => {
        const h = Math.max(
          doc.documentElement?.scrollHeight || 0,
          doc.body?.scrollHeight || 0,
          DEVICE_VH + 400,
        )
        const next = Math.min(h + 24, 12000)
        setIframeH(next)
        setContentH(next)
        setLoading(false)
      }

      requestAnimationFrame(() => requestAnimationFrame(measure))
    } catch {
      setIframeH(2800)
      setContentH(2800)
      setLoading(false)
    }
  }

  // After expanding iframe height, remeasure once (layout may settle).
  useEffect(() => {
    if (iframeH <= DEVICE_VH) return
    const t = window.setTimeout(() => {
      try {
        const doc = iframeRef.current?.contentDocument
        if (!doc) return
        const h = Math.max(
          doc.documentElement?.scrollHeight || 0,
          doc.body?.scrollHeight || 0,
          contentH,
        )
        const next = Math.min(h + 24, 12000)
        if (Math.abs(next - contentH) > 120) {
          setIframeH(next)
          setContentH(next)
        }
      } catch {
        /* ignore */
      }
    }, 400)
    return () => window.clearTimeout(t)
  }, [iframeH, contentH, path])

  const previewUrl = `${siteUrl}${path}`
  const zones = active?.zones || { hero: 0, middle: 0, bottom: 0 }
  const zoneTotal = Math.max(1, zones.hero + zones.middle + zones.bottom)

  return (
    <div className={styles.heatStack}>
      <div className={styles.card}>
        <h2 className={styles.panelTitle}>Статистика по всіх сторінках</h2>
        <p className={styles.heatSideLead}>
          CTR = кліки / перегляди. Зони: верх (hero) / середина / низ сторінки.
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Сторінка</th>
                <th>Мова</th>
                <th>Views</th>
                <th>Sessions</th>
                <th>Clicks</th>
                <th>CTR</th>
                <th>Hero</th>
                <th>Mid</th>
                <th>Bottom</th>
                <th>Топ елемент</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((page) => {
                const z = page.zones || { hero: 0, middle: 0, bottom: 0 }
                const top = page.topElements?.[0]
                return (
                  <tr
                    key={page.path}
                    className={page.path === active?.path ? styles.heatRowActive : undefined}
                    onClick={() => setPath(page.path)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <strong>{pageLabel(page.path)}</strong>
                      <div className={styles.heatPagePath}>{page.path}</div>
                    </td>
                    <td>{localeOf(page.path)}</td>
                    <td>{page.views}</td>
                    <td>{page.sessions || 0}</td>
                    <td>{page.clicks}</td>
                    <td>{page.ctr || 0}%</td>
                    <td>{z.hero}</td>
                    <td>{z.middle}</td>
                    <td>{z.bottom}</td>
                    <td>{top ? `${top.label.slice(0, 32)} (${top.count})` : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.heatLayout}>
        <aside className={styles.heatSidebar}>
          <h2 className={styles.panelTitle}>Карта сайту</h2>
          <p className={styles.heatSideLead}>
            Превʼю в розмірі desktop {DEVICE_W}×{DEVICE_VH}, масштабоване під панель.
          </p>

          <div className={styles.heatLocaleTabs}>
            {(['all', 'uk', 'pl', 'en'] as const).map((loc) => (
              <button
                key={loc}
                type="button"
                className={localeFilter === loc ? styles.heatLocaleActive : undefined}
                onClick={() => setLocaleFilter(loc)}
              >
                {loc === 'all' ? 'Усі' : loc.toUpperCase()}
              </button>
            ))}
          </div>

          <div className={styles.heatPageList}>
            {filtered.map((page) => (
              <button
                key={page.path}
                type="button"
                className={`${styles.heatPageBtn} ${page.path === active?.path ? styles.heatPageBtnActive : ''}`}
                onClick={() => setPath(page.path)}
              >
                <span className={styles.heatPageName}>
                  {pageLabel(page.path)}
                  <span className={styles.heatLocaleTag}>{localeOf(page.path)}</span>
                </span>
                <span className={styles.heatPagePath}>{page.path}</span>
                <span className={styles.heatPageMeta}>
                  {page.views} views · {page.clicks} clicks · CTR {page.ctr || 0}%
                </span>
                <span className={styles.heatPageBar}>
                  <span style={{ width: `${(page.views / maxViews) * 100}%` }} />
                </span>
              </button>
            ))}
          </div>
        </aside>

        <div className={styles.heatStage}>
          <div className={styles.heatToolbar}>
            <div>
              <strong>{pageLabel(active?.path || path)}</strong>
              <span className={styles.heatToolbarPath}>{active?.path || path}</span>
            </div>
            <div className={styles.heatToolbarStats}>
              <span>{active?.views || 0} views</span>
              <span>{active?.sessions || 0} sessions</span>
              <span>{points.length} clicks</span>
              <span>CTR {active?.ctr || 0}%</span>
              <a href={previewUrl || path} target="_blank" rel="noopener noreferrer" className={`${styles.btn} ${styles.btnGhost}`}>
                Відкрити
              </a>
            </div>
          </div>

          <div className={styles.heatPageStats}>
            <div>
              <span className={styles.statLabel}>Зона hero</span>
              <strong>{Math.round((zones.hero / zoneTotal) * 100)}%</strong>
              <span className={styles.statHint}>{zones.hero} кліків</span>
            </div>
            <div>
              <span className={styles.statLabel}>Середина</span>
              <strong>{Math.round((zones.middle / zoneTotal) * 100)}%</strong>
              <span className={styles.statHint}>{zones.middle} кліків</span>
            </div>
            <div>
              <span className={styles.statLabel}>Низ</span>
              <strong>{Math.round((zones.bottom / zoneTotal) * 100)}%</strong>
              <span className={styles.statHint}>{zones.bottom} кліків</span>
            </div>
            <div>
              <span className={styles.statLabel}>Унікальні клікери</span>
              <strong>{active?.clickSessions || 0}</strong>
              <span className={styles.statHint}>сесії з кліком</span>
            </div>
          </div>

          {(active?.topElements?.length || 0) > 0 ? (
            <div className={styles.heatTopElements}>
              {active!.topElements!.map((el) => (
                <span key={el.label} className={styles.heatChip}>
                  {el.label.slice(0, 40)} · {el.count}
                </span>
              ))}
            </div>
          ) : null}

          <div className={styles.heatLegend}>
            <span>Холодніше</span>
            <span className={styles.heatLegendBar} aria-hidden="true" />
            <span>Гарячіше</span>
          </div>

          <div className={styles.heatViewport} ref={shellRef}>
            {loading ? <div className={styles.heatLoading}>Завантаження desktop-превʼю…</div> : null}
            <div className={styles.heatScaleOuter} style={{ height: contentH * scale }}>
              <div
                className={styles.heatScaleInner}
                style={{
                  width: DEVICE_W,
                  height: contentH,
                  transform: `scale(${scale})`,
                }}
              >
                <iframe
                  ref={iframeRef}
                  key={path}
                  src={`${path}${path.includes('?') ? '&' : '?'}heatmap_preview=1`}
                  title={`Heatmap ${path}`}
                  className={styles.heatFrame}
                  onLoad={onFrameLoad}
                  width={DEVICE_W}
                  height={iframeH}
                />
                <canvas ref={canvasRef} className={styles.heatCanvasLayer} aria-hidden="true" />
              </div>
            </div>
          </div>

          {points.length === 0 ? (
            <p className={styles.heatEmptyNote}>
              Для цієї сторінки ще немає кліків. Відкрийте публічний сайт у новій вкладці, поклацайте
              елементи — потім оновіть хітмапу.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
