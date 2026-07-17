'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../AdminShell'
import AdminHint from '../AdminHint'
import styles from '../admin.module.css'

type Client = {
  contact: string
  name: string
  leads: number
  lastAt: string
  sources: string[]
  carSearches: string[]
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true)
      const res = await fetch(`/api/admin/leads?view=clients&q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setClients(data.clients || [])
      setLoading(false)
    }, 200)
    return () => clearTimeout(t)
  }, [q])

  const exportCsv = () => {
    const header = ['name', 'contact', 'leads', 'lastAt', 'sources', 'carSearches']
    const rows = clients.map((c) =>
      [c.name, c.contact, c.leads, c.lastAt, c.sources.join('|'), c.carSearches.join('|')]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(','),
    )
    const blob = new Blob([[header.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kreona-clients-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AdminShell
      title="База клієнтів"
      lead="Унікальні контакти з усіх заявок"
      actions={
        <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={exportCsv}>
          Експорт CSV
        </button>
      }
    >
      <AdminHint title="База клієнтів">
        <ul>
          <li>Клієнти збираються автоматично з унікальних контактів у заявках.</li>
          <li>Один телефон / Telegram = один клієнт; кілька заявок рахуються в колонці «Заявок».</li>
          <li>Експорт CSV зручний для CRM або розсилок.</li>
        </ul>
      </AdminHint>

      <div className={styles.toolbar}>
        <input
          className={styles.input}
          placeholder="Пошук клієнта…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className={styles.tableWrap}>
        {loading ? (
          <div className={styles.empty}>Завантаження…</div>
        ) : clients.length === 0 ? (
          <div className={styles.empty}>Клієнтів поки немає</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Клієнт</th>
                <th>Контакт</th>
                <th>Заявок</th>
                <th>Останній контакт</th>
                <th>Інтереси</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.contact}>
                  <td>
                    <strong>{c.name}</strong>
                    <div style={{ color: '#888' }}>{c.sources.join(', ')}</div>
                  </td>
                  <td>
                    <a href={c.contact.includes('@') ? `mailto:${c.contact}` : `tel:${c.contact}`}>{c.contact}</a>
                  </td>
                  <td>{c.leads}</td>
                  <td>{new Date(c.lastAt).toLocaleString('uk-UA')}</td>
                  <td>{c.carSearches.slice(0, 3).join(' · ') || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  )
}
