import { redirect } from 'next/navigation'
import { getAdminSessionFromCookies } from '../../lib/admin/auth'
import { getDashboardStats } from '../../lib/admin/stats'
import { SITE_URL } from '../../seo'
import AdminShell from '../AdminShell'
import AdminHint from '../AdminHint'
import HeatmapViewer from '../HeatmapViewer'
import styles from '../admin.module.css'

export const dynamic = 'force-dynamic'

export default async function AdminHeatmapPage() {
  if (!(await getAdminSessionFromCookies())) redirect('/admin/login')

  const stats = await getDashboardStats(30)

  return (
    <AdminShell
      title="Хітмапа сайту"
      lead="Повна карта сторінок і кліків відвідувачів"
    >
      <AdminHint title="Як користуватись хітмапою">
        <ol>
          <li>Зверху — таблиця статистики по всіх сторінках (views, CTR, зони кліків).</li>
          <li>Оберіть рядок або сторінку зліва — справа desktop-превʼю 1440px з класичною heat-layer.</li>
          <li>Кольори: синій → зелений → жовтий → червоний (щільність кліків).</li>
          <li>Дані збираються на публічному сайті; після кліків оновіть цю сторінку.</li>
        </ol>
      </AdminHint>

      <div className={styles.gridStats}>
        <div className={styles.card}>
          <div className={styles.statLabel}>Сторінок у карті</div>
          <div className={styles.statValue}>{stats.totals.pagesTracked}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.statLabel}>Кліків за 30 днів</div>
          <div className={styles.statValue}>{stats.totals.clicks}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.statLabel}>Переглядів</div>
          <div className={styles.statValue}>{stats.totals.pageviews}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.statLabel}>Сесії</div>
          <div className={styles.statValue}>{stats.totals.sessions}</div>
        </div>
      </div>

      <HeatmapViewer pages={stats.siteMap} siteUrl={SITE_URL} />
    </AdminShell>
  )
}
