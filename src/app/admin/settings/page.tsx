'use client'

import { FormEvent, useEffect, useState } from 'react'
import AdminShell from '../AdminShell'
import AdminHint from '../AdminHint'
import styles from '../admin.module.css'

export default function AdminSettingsPage() {
  const [emails, setEmails] = useState<string[]>([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Помилка завантаження')
      setEmails(data.leadNotifyEmails || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Помилка')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const addEmail = (e?: FormEvent) => {
    e?.preventDefault()
    const next = draft.trim().toLowerCase()
    setError('')
    setOk('')
    if (!next) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next)) {
      setError('Некоректна адреса email')
      return
    }
    if (emails.includes(next)) {
      setError('Ця адреса вже в списку')
      return
    }
    setEmails((list) => [...list, next])
    setDraft('')
  }

  const removeEmail = (email: string) => {
    setOk('')
    setEmails((list) => list.filter((x) => x !== email))
  }

  const save = async () => {
    setSaving(true)
    setError('')
    setOk('')
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadNotifyEmails: emails }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Не вдалося зберегти')
      setEmails(data.leadNotifyEmails || [])
      setOk('Збережено. Нові заявки підуть на ці адреси.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Помилка збереження')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminShell title="Налаштування" lead="Сповіщення про нові заявки">
      <AdminHint title="Кому слати ліди">
        <ul>
          <li>Додайте одну або кілька email-адрес — кожна отримає лист про нову заявку.</li>
          <li>Після змін натисніть «Зберегти».</li>
          <li>
            Для відправки потрібні <code>RESEND_API_KEY</code> і <code>EMAIL_FROM</code> у `.env`.
          </li>
        </ul>
      </AdminHint>

      <div className={styles.card} style={{ maxWidth: 640 }}>
        <h2 className={styles.panelTitle}>Email для сповіщень про ліди</h2>

        {loading ? <div className={styles.empty}>Завантаження…</div> : null}
        {error ? <p className={styles.error}>{error}</p> : null}
        {ok ? <p className={styles.success}>{ok}</p> : null}

        {!loading ? (
          <>
            <ul className={styles.emailList}>
              {emails.length === 0 ? (
                <li className={styles.empty}>Поки немає адрес — додайте хоча б одну.</li>
              ) : (
                emails.map((email) => (
                  <li key={email} className={styles.emailRow}>
                    <span>{email}</span>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnGhost}`}
                      onClick={() => removeEmail(email)}
                    >
                      Видалити
                    </button>
                  </li>
                ))
              )}
            </ul>

            <form className={styles.emailAddRow} onSubmit={addEmail}>
              <input
                className={styles.input}
                type="email"
                placeholder="email@example.com"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                autoComplete="email"
              />
              <button type="submit" className={`${styles.btn} ${styles.btnGhost}`}>
                Додати
              </button>
            </form>

            <div style={{ marginTop: 16 }}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={() => void save()}
                disabled={saving}
              >
                {saving ? 'Збереження…' : 'Зберегти'}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </AdminShell>
  )
}
