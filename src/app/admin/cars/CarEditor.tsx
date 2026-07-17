'use client'

import { FormEvent, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminShell from '../AdminShell'
import AdminHint from '../AdminHint'
import styles from '../admin.module.css'
import { emptyLocalized, type InventoryCarRecord, type LocaleCode, type LocalizedString } from '../../lib/admin/types'

type Props = {
  mode: 'create' | 'edit'
  initial?: InventoryCarRecord | null
}

export default function CarEditor({ mode, initial }: Props) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [lang, setLang] = useState<LocaleCode>('uk')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [form, setForm] = useState({
    make: initial?.make || '',
    model: initial?.model || '',
    year: initial?.year || new Date().getFullYear(),
    engine: initial?.engine || '',
    mileage: initial?.mileage || '',
    gearboxKey: initial?.gearboxKey || 'automatic',
    price: initial?.price || '',
    statusKey: initial?.statusKey || 'delivered',
    image: initial?.image || '',
    sortOrder: initial?.sortOrder ?? 1,
    published: initial?.published ?? true,
    route: initial?.route || emptyLocalized(),
    bodyClass: initial?.bodyClass || emptyLocalized('SUV'),
    description: initial?.description || emptyLocalized(),
  })

  const setLocalized = (key: 'route' | 'bodyClass' | 'description', value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: { ...prev[key], [lang]: value } as LocalizedString,
    }))
  }

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Оберіть файл зображення (JPG, PNG, WebP, GIF)')
      return
    }
    setUploading(true)
    setError('')
    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Помилка завантаження')
        return
      }
      setForm((prev) => ({ ...prev, image: data.url }))
    } catch {
      setError('Не вдалося завантажити зображення')
    } finally {
      setUploading(false)
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) void uploadFile(file)
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.image.trim()) {
      setError('Додайте зображення авто')
      return
    }
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/cars', {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: initial?.id,
          ...form,
          year: Number(form.year),
          sortOrder: Number(form.sortOrder),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Помилка збереження')
        return
      }
      router.push('/admin/cars')
      router.refresh()
    } catch {
      setError('Не вдалося зберегти')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminShell
      title={mode === 'create' ? 'Нове авто' : `Редагування: ${initial?.make} ${initial?.model}`}
      lead="Заповніть поля трьома мовами для route / class / description"
      actions={
        <Link href="/admin/cars" className={`${styles.btn} ${styles.btnGhost}`}>
          Назад
        </Link>
      }
    >
      <AdminHint title="Як заповнювати картку авто">
        <ul>
          <li>
            <strong>Фото</strong> — перетягніть файл у зону завантаження або вкажіть шлях `/cars/...`.
          </li>
          <li>
            <strong>Route / Class / Description</strong> — окремі тексти для UK, PL, EN; порожнє поле не
            покажеться на тій мові.
          </li>
          <li>
            Увімкніть <strong>Опубліковано</strong> лише коли картка готова до показу на сайті.
          </li>
        </ul>
      </AdminHint>

      <form className={styles.card} onSubmit={onSubmit}>
        {error ? <p className={styles.error}>{error}</p> : null}
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label>Марка</label>
            <input className={styles.input} value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} required />
          </div>
          <div className={styles.field}>
            <label>Модель</label>
            <input className={styles.input} value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required />
          </div>
          <div className={styles.field}>
            <label>Рік</label>
            <input
              className={styles.input}
              type="number"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
              required
            />
          </div>
          <div className={styles.field}>
            <label>Ціна</label>
            <input className={styles.input} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </div>
          <div className={styles.field}>
            <label>Двигун</label>
            <input className={styles.input} value={form.engine} onChange={(e) => setForm({ ...form, engine: e.target.value })} />
          </div>
          <div className={styles.field}>
            <label>Пробіг</label>
            <input className={styles.input} value={form.mileage} onChange={(e) => setForm({ ...form, mileage: e.target.value })} />
          </div>
          <div className={styles.field}>
            <label>КПП</label>
            <select
              className={styles.select}
              value={form.gearboxKey}
              onChange={(e) => setForm({ ...form, gearboxKey: e.target.value as 'automatic' | 'manual' })}
            >
              <option value="automatic">automatic</option>
              <option value="manual">manual</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Статус</label>
            <select
              className={styles.select}
              value={form.statusKey}
              onChange={(e) => setForm({ ...form, statusKey: e.target.value as 'delivered' | 'inTransit' })}
            >
              <option value="delivered">delivered</option>
              <option value="inTransit">inTransit</option>
            </select>
          </div>

          <div className={`${styles.field} ${styles.full}`}>
            <label>Зображення</label>
            <div
              className={`${styles.dropzone} ${dragOver ? styles.dropzoneActive : ''} ${form.image ? styles.dropzoneFilled : ''}`}
              onDragEnter={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={(e) => {
                e.preventDefault()
                setDragOver(false)
              }}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  fileInputRef.current?.click()
                }
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void uploadFile(file)
                  e.target.value = ''
                }}
              />
              {form.image ? (
                <div className={styles.dropPreview}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.image} alt="" />
                  <div className={styles.dropMeta}>
                    <strong>{uploading ? 'Завантаження…' : 'Зображення готове'}</strong>
                    <span>{form.image}</span>
                    <span className={styles.dropHint}>Перетягніть нове фото або натисніть, щоб замінити</span>
                  </div>
                </div>
              ) : (
                <div className={styles.dropEmpty}>
                  <strong>{uploading ? 'Завантаження…' : 'Перетягніть фото сюди'}</strong>
                  <span>або натисніть, щоб обрати файл · JPG, PNG, WebP до 8 МБ</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.field}>
            <label>Порядок сортування</label>
            <input
              className={styles.input}
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
            />
          </div>
          <div className={styles.field}>
            <label>Публікація</label>
            <select
              className={styles.select}
              value={form.published ? '1' : '0'}
              onChange={(e) => setForm({ ...form, published: e.target.value === '1' })}
            >
              <option value="1">На сайті</option>
              <option value="0">Приховано</option>
            </select>
          </div>

          <div className={`${styles.field} ${styles.full}`}>
            <label>Локалізовані поля</label>
            <div className={styles.langTabs}>
              {(['uk', 'pl', 'en'] as LocaleCode[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  className={lang === code ? styles.active : undefined}
                  onClick={() => setLang(code)}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label>Маршрут ({lang})</label>
                <input className={styles.input} value={form.route[lang]} onChange={(e) => setLocalized('route', e.target.value)} />
              </div>
              <div className={styles.field}>
                <label>Клас кузова ({lang})</label>
                <input
                  className={styles.input}
                  value={form.bodyClass[lang]}
                  onChange={(e) => setLocalized('bodyClass', e.target.value)}
                />
              </div>
              <div className={`${styles.field} ${styles.full}`}>
                <label>Опис ({lang})</label>
                <textarea
                  className={styles.textarea}
                  value={form.description[lang]}
                  onChange={(e) => setLocalized('description', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.toolbar} style={{ marginTop: 16 }}>
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={saving || uploading}>
            {saving ? 'Збереження…' : 'Зберегти'}
          </button>
        </div>
      </form>
    </AdminShell>
  )
}
