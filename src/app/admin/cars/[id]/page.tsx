import { notFound, redirect } from 'next/navigation'
import { getAdminSessionFromCookies } from '../../../lib/admin/auth'
import { getCar } from '../../../lib/admin/store'
import CarEditor from '../CarEditor'

export const dynamic = 'force-dynamic'

export default async function EditCarPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSessionFromCookies())) redirect('/admin/login')
  const car = await getCar((await params).id)
  if (!car) notFound()
  return <CarEditor mode="edit" initial={car} />
}
