'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminShell from '../AdminShell'
import AdminHint from '../AdminHint'
import styles from '../admin.module.css'
import type { LeadRecord, LeadStatus } from '../../lib/admin/types'

const STATUS_CLASS: Record<LeadStatus, string> = {
  new: styles.badgeNew,
  in_progress: styles.badgeProgress,
  done: styles.badgeDone,
  spam: styles.badgeSpam,
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([])
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState('newest')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ q, status, sort })
    const res = await fetch(`/api/admin/leads?${params}`)
    const data = await res.json()
    setLeads(data.leads || [])
    setLoading(false)
  }, [q, status, sort])

  useEffect(() => {
    void load()
  }, [load])

  const exportCsv = () => {
    const header = ['createdAt', 'name', 'contact', 'source', 'status', 'carSearch', 'comment', 'car', 'utm_source']
    const rows = leads.map((l) =>
      [
        l.createdAt,
        l.name,
        l.contact,
        l.source,
        l.status,
        l.carSearch,
        l.comment,
        l.car?.label || '',
        l.utm?.utm_source || '',
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(','),
    )
    const blob = new Blob([[header.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kreona-leads-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const patch = async (id: string, patchBody: Partial<LeadRecord>) => {
    await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...patchBody }),
    })
    void load()
  }

  const remove = async (id: string) => {
    if (!confirm('Видалити заявку?')) return
    await fetch(`/api/admin/leads?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
    void load()
  }

  const count = useMemo(() => leads.length, [leads])

  return (
    <AdminShell
      title="Заявки"
      lead={`${count} записів · сортування, статуси, експорт CSV`}
      actions={
        <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={exportCsv}>
          Експорт CSV
        </button>
      }
    >
      <AdminHint title="Робота із заявками">
        <ul>
          <li>
            <strong>new</strong> — нова заявка · <strong>in progress</strong> — в роботі ·{' '}
            <strong>done</strong> — закрита · <strong>spam</strong> — сміття.
          </li>
          <li>Нотатки зберігаються одразу після зміни (blur / Enter).</li>
          <li>CSV — для Excel / Google Sheets; фільтри застосовуються до експорту.</li>
        </ul>
      </AdminHint>

      <div className={styles.toolbar}>
        <input
          className={styles.input}
          placeholder="Пошук: імʼя, телефон, авто…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Усі статуси</option>
          <option value="new">Нові</option>
          <option value="in_progress">В роботі</option>
          <option value="done">Завершені</option>
          <option value="spam">Спам</option>
        </select>
        <select className={styles.select} value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Спочатку нові</option>
          <option value="oldest">Спочатку старі</option>
          <option value="name">За іменем</option>
        </select>
      </div>

      <div className={styles.tableWrap}>
        {loading ? (
          <div className={styles.empty}>Завантаження…</div>
        ) : leads.length === 0 ? (
          <div className={styles.empty}>Заявок поки немає</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Клієнт</th>
                <th>Запит</th>
                <th>Статус</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    {new Date(lead.createdAt).toLocaleString('uk-UA')}
                    <div style={{ color: '#888', marginTop: 4 }}>{lead.source}</div>
                  </td>
                  <td>
                    <strong>{lead.name}</strong>
                    <div>
                      <a href={lead.contact.includes('@') ? `mailto:${lead.contact}` : `tel:${lead.contact}`}>
                        {lead.contact}
                      </a>
                    </div>
                  </td>
                  <td>
                    <div>{lead.car?.label || lead.carSearch || '—'}</div>
                    <div style={{ color: '#666', marginTop: 4 }}>{lead.comment}</div>
                    <textarea
                      className={styles.textarea}
                      style={{ marginTop: 8, minHeight: 56 }}
                      defaultValue={lead.notes}
                      placeholder="Нотатки менеджера"
                      onBlur={(e) => {
                        if (e.target.value !== lead.notes) void patch(lead.id, { notes: e.target.value })
                      }}
                    />
                  </td>
                  <td>
                    <select
                      className={styles.select}
                      value={lead.status}
                      onChange={(e) => void patch(lead.id, { status: e.target.value as LeadStatus })}
                    >
                      <option value="new">new</option>
                      <option value="in_progress">in_progress</option>
                      <option value="done">done</option>
                      <option value="spam">spam</option>
                    </select>
                    <div style={{ marginTop: 8 }}>
                      <span className={`${styles.badge} ${STATUS_CLASS[lead.status]}`}>{lead.status}</span>
                    </div>
                  </td>
                  <td>
                    <button type="button" className={`${styles.btn} ${styles.btnDanger}`} onClick={() => void remove(lead.id)}>
                      Видалити
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  )
}
