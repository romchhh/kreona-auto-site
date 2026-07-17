'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import AdminShell from '../AdminShell'
import AdminHint from '../AdminHint'
import styles from '../admin.module.css'
import type { InventoryCarRecord } from '../../lib/admin/types'

export default function AdminCarsPage() {
  const [cars, setCars] = useState<InventoryCarRecord[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/cars')
    const data = await res.json()
    setCars(data.cars || [])
    setLoading(false)
  }

  useEffect(() => {
    void load()
  }, [])

  const remove = async (id: string) => {
    if (!confirm('Видалити авто з бази?')) return
    await fetch(`/api/admin/cars?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
    void load()
  }

  const togglePublish = async (car: InventoryCarRecord) => {
    await fetch('/api/admin/cars', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...car, published: !car.published }),
    })
    void load()
  }

  return (
    <AdminShell
      title="База авто"
      lead="Автомобілі, які показуються на сайті (UK / PL / EN)"
      actions={
        <Link href="/admin/cars/new" className={`${styles.btn} ${styles.btnPrimary}`}>
          Додати авто
        </Link>
      }
    >
      <AdminHint title="База авто на сайті">
        <ul>
          <li>
            <strong>Опубліковано</strong> — авто видно в розділі «В наявності» і на головній.
          </li>
          <li>Чорновик (не опубліковано) зберігається в базі, але не показується відвідувачам.</li>
          <li>Тексти route / class / description заповнюйте трьома мовами (UK, PL, EN).</li>
        </ul>
      </AdminHint>

      <div className={styles.tableWrap}>
        {loading ? (
          <div className={styles.empty}>Завантаження…</div>
        ) : cars.length === 0 ? (
          <div className={styles.empty}>Авто ще немає — натисніть «Додати авто»</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Авто</th>
                <th>Ціна</th>
                <th>Статус</th>
                <th>Порядок</th>
                <th>Публікація</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id}>
                  <td>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={car.image}
                        alt=""
                        width={72}
                        height={48}
                        style={{ objectFit: 'cover', borderRadius: 8, background: '#eee' }}
                      />
                      <div>
                        <strong>
                          {car.make} {car.model} · {car.year}
                        </strong>
                        <div style={{ color: '#777' }}>{car.engine} · {car.mileage}</div>
                      </div>
                    </div>
                  </td>
                  <td>{car.price}</td>
                  <td>{car.statusKey}</td>
                  <td>{car.sortOrder}</td>
                  <td>
                    <button
                      type="button"
                      className={`${styles.btn} ${car.published ? styles.btnPrimary : styles.btnGhost}`}
                      onClick={() => void togglePublish(car)}
                    >
                      {car.published ? 'На сайті' : 'Приховано'}
                    </button>
                  </td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <Link href={`/admin/cars/${car.id}`} className={`${styles.btn} ${styles.btnGhost}`}>
                      Редагувати
                    </Link>
                    <button type="button" className={`${styles.btn} ${styles.btnDanger}`} onClick={() => void remove(car.id)}>
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
