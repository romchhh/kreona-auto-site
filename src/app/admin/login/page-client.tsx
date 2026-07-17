'use client'

import { FormEvent, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from '../admin.module.css'

export default function AdminLoginPage() {
  const router = useRouter()
  const search = useSearchParams()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Помилка входу')
        return
      }
      router.replace(search.get('next') || '/admin')
      router.refresh()
    } catch {
      setError('Не вдалося увійти')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginPage}>
      <form className={styles.loginCard} onSubmit={onSubmit}>
        <h1>KREONA Admin</h1>
        <p>Увійдіть, щоб керувати сайтом.</p>
        {error ? <p className={styles.error}>{error}</p> : null}
        <div className={styles.field}>
          <label htmlFor="admin-user">Логін</label>
          <input
            id="admin-user"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="admin-pass">Пароль</label>
          <input
            id="admin-pass"
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading}>
          {loading ? 'Вхід…' : 'Увійти'}
        </button>
      </form>
    </div>
  )
}
