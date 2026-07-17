'use client'

import styles from './admin.module.css'

export default function AdminHint({
  title,
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  return (
    <aside className={styles.hint}>
      {title ? <strong className={styles.hintTitle}>{title}</strong> : null}
      <div className={styles.hintBody}>{children}</div>
    </aside>
  )
}
