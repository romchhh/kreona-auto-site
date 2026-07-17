import { NextResponse } from 'next/server'
import { getAdminSessionFromRequest } from '../../../lib/admin/auth'
import { getDashboardStats } from '../../../lib/admin/stats'

export async function GET(request: Request) {
  if (!getAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const url = new URL(request.url)
  const days = Math.min(90, Math.max(7, Number(url.searchParams.get('days') || 30)))
  return NextResponse.json(await getDashboardStats(days))
}
