import { Suspense } from 'react'
import AdminLoginPage from './page-client'

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Loading…</div>}>
      <AdminLoginPage />
    </Suspense>
  )
}
