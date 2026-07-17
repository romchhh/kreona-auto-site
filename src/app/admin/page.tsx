import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getAdminSessionFromCookies } from '../lib/admin/auth'
import { getDashboardStats } from '../lib/admin/stats'
import AdminShell from './AdminShell'
import AdminHint from './AdminHint'
import styles from './admin.module.css'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  if (!getAdminSessionFromCookies()) redirect('/admin/login')

  const stats = await getDashboardStats(30)
  const maxViews = Math.max(1, ...stats.byDay.map((d) => d.views))
  const maxCountry = Math.max(1, ...stats.countries.map(([, n]) => n))
  const topHeat = stats.siteMap.find((p) => p.clicks > 0) || stats.siteMap[0]

  return (
    <AdminShell title="Дашборд" lead="Аналітика сайту за останні 30 днів">
      <AdminHint title="Швидкий старт">
        <ul>
          <li>
            <strong>Заявки</strong> — усі форми з сайту: змінюйте статус, додавайте нотатки, експортуйте CSV.
          </li>
          <li>
            <strong>База авто</strong> — додавайте / редагуйте авто; «Опубліковано» показує картку на сайті.
          </li>
          <li>
            <strong>Хітмапа</strong> — повна карта сторінок і кліків відвідувачів.
          </li>
        </ul>
      </AdminHint>

      <div className={styles.gridStats}>
        <div className={styles.card}>
          <div className={styles.statLabel}>Відвідування</div>
          <div className={styles.statValue}>{stats.totals.pageviews}</div>
          <div className={styles.statHint}>Сьогодні: {stats.totals.todayViews}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.statLabel}>Сесії</div>
          <div className={styles.statValue}>{stats.totals.sessions}</div>
          <div className={styles.statHint}>Унікальні відвідувачі (approx.)</div>
        </div>
        <div className={styles.card}>
          <div className={styles.statLabel}>Заявки</div>
          <div className={styles.statValue}>{stats.totals.leads}</div>
          <div className={styles.statHint}>Нових: {stats.totals.newLeads} · сьогодні: {stats.totals.todayLeads}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.statLabel}>Конверсія</div>
          <div className={styles.statValue}>{stats.totals.conversionRate}%</div>
          <div className={styles.statHint}>Заявки / сесії</div>
        </div>
      </div>

      <div className={styles.panelGrid}>
        <div className={styles.card}>
          <h2 className={styles.panelTitle}>Трафік по днях</h2>
          <div className={styles.bars}>
            {stats.byDay.map((day) => (
              <div key={day.date} className={styles.barCol} title={`${day.date}: ${day.views}`}>
                <div className={styles.bar} style={{ height: `${Math.max(6, (day.views / maxViews) * 100)}%` }} />
                <span className={styles.barLabel}>{day.date.slice(8)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.panelTitle}>Країни / регіони</h2>
          <div className={styles.listRows}>
            {stats.countries.length === 0 ? (
              <div className={styles.empty}>Поки немає даних</div>
            ) : (
              stats.countries.map(([country, count]) => (
                <div key={country} className={styles.listRow}>
                  <strong style={{ minWidth: 90 }}>{country}</strong>
                  <div className={styles.meter}>
                    <span style={{ width: `${(count / maxCountry) * 100}%` }} />
                  </div>
                  <span>{count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className={styles.panelGrid}>
        <div className={styles.card}>
          <h2 className={styles.panelTitle}>Топ сторінок</h2>
          <div className={styles.listRows}>
            {stats.topPages.length === 0 ? (
              <div className={styles.empty}>Поки немає даних</div>
            ) : (
              stats.topPages.map(([path, count]) => (
                <div key={path} className={styles.listRow}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{path}</span>
                  <strong>{count}</strong>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.panelTitle}>Мови / джерела</h2>
          <div className={styles.listRows}>
            {stats.locales.map(([locale, count]) => (
              <div key={locale} className={styles.listRow}>
                <span>Мова: {locale}</span>
                <strong>{count}</strong>
              </div>
            ))}
            {stats.referrers.slice(0, 5).map(([ref, count]) => (
              <div key={ref} className={styles.listRow}>
                <span>{ref}</span>
                <strong>{count}</strong>
              </div>
            ))}
            {stats.utmSources.slice(0, 5).map(([src, count]) => (
              <div key={src} className={styles.listRow}>
                <span>utm: {src}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.panelGrid}>
        <div className={styles.card}>
          <h2 className={styles.panelTitle}>Хітмапа сайту</h2>
          <p className={styles.heatPreviewLead}>
            Повна інтерактивна карта всіх сторінок і кліків — не сітка, а живий превʼю сайту.
          </p>
          <div className={styles.heatPreviewMeta}>
            <span>{stats.totals.pagesTracked} сторінок</span>
            <span>{stats.totals.clicks} кліків</span>
            {topHeat ? <span>Топ: {topHeat.path}</span> : null}
          </div>
          <Link href="/admin/heatmap" className={`${styles.btn} ${styles.btnPrimary}`}>
            Відкрити хітмапу
          </Link>
        </div>

        <div className={styles.card}>
          <h2 className={styles.panelTitle}>Статуси заявок</h2>
          <div className={styles.listRows}>
            <div className={styles.listRow}>
              <span className={`${styles.badge} ${styles.badgeNew}`}>new</span>
              <strong>{stats.leadsByStatus.new}</strong>
            </div>
            <div className={styles.listRow}>
              <span className={`${styles.badge} ${styles.badgeProgress}`}>in progress</span>
              <strong>{stats.leadsByStatus.in_progress}</strong>
            </div>
            <div className={styles.listRow}>
              <span className={`${styles.badge} ${styles.badgeDone}`}>done</span>
              <strong>{stats.leadsByStatus.done}</strong>
            </div>
            <div className={styles.listRow}>
              <span className={`${styles.badge} ${styles.badgeSpam}`}>spam</span>
              <strong>{stats.leadsByStatus.spam}</strong>
            </div>
            <div className={styles.listRow}>
              <span>Кліки на сайті</span>
              <strong>{stats.totals.clicks}</strong>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
