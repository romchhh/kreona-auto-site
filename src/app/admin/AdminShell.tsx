'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from './admin.module.css'

const LINKS = [
  { href: '/admin', label: 'Дашборд' },
  { href: '/admin/heatmap', label: 'Хітмапа' },
  { href: '/admin/leads', label: 'Заявки' },
  { href: '/admin/clients', label: 'Клієнти' },
  { href: '/admin/cars', label: 'База авто' },
  { href: '/admin/settings', label: 'Налаштування' },
]

export default function AdminShell({
  children,
  title,
  lead,
  actions,
}: {
  children: React.ReactNode
  title: string
  lead?: string
  actions?: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/admin/login')
    router.refresh()
  }

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <div className={styles.shell}>
      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
        <div className={styles.brand}>
          <div className={styles.brandName}>KREONA</div>
          <div className={styles.brandSub}>Admin panel</div>
        </div>
        <nav className={styles.nav}>
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(link.href) ? styles.active : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button type="button" className={styles.logoutBtn} onClick={logout}>
          Вийти
        </button>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <button type="button" className={styles.menuBtn} onClick={() => setOpen((v) => !v)} aria-label="Меню">
              ☰
            </button>
            <div>
              <h1 className={styles.pageTitle}>{title}</h1>
              {lead ? <p className={styles.pageLead}>{lead}</p> : null}
            </div>
          </div>
          <div className={styles.toolbar}>{actions}</div>
        </header>

        <div className={styles.mobileNav}>
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={isActive(link.href) ? styles.active : undefined}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className={styles.content}>{children}</div>
      </div>

      {open ? (
        <button
          type="button"
          aria-label="Закрити меню"
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            border: 'none',
            zIndex: 40,
          }}
        />
      ) : null}
    </div>
  )
}
