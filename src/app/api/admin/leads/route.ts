import { NextResponse } from 'next/server'
import { getAdminSessionFromRequest } from '../../../lib/admin/auth'
import { countLeads, deleteLead, listClients, listLeads, updateLead } from '../../../lib/admin/store'
import type { LeadStatus } from '../../../lib/admin/types'

export async function GET(request: Request) {
  if (!getAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const url = new URL(request.url)
  const q = url.searchParams.get('q') || ''
  const status = url.searchParams.get('status') || 'all'
  const sort = (url.searchParams.get('sort') || 'newest') as 'newest' | 'oldest' | 'name'
  const view = url.searchParams.get('view') || 'leads'

  if (view === 'clients') {
    return NextResponse.json({ clients: await listClients(q) })
  }

  const [leads, total] = await Promise.all([
    listLeads({ q, status, sort }),
    countLeads('all'),
  ])

  return NextResponse.json({ leads, total })
}

export async function PATCH(request: Request) {
  if (!getAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = (await request.json()) as {
    id?: string
    status?: LeadStatus
    notes?: string
  }
  if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const updated = await updateLead(body.id, {
    ...(body.status ? { status: body.status } : {}),
    ...(body.notes !== undefined ? { notes: body.notes } : {}),
  })
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ lead: updated })
}

export async function DELETE(request: Request) {
  if (!getAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const url = new URL(request.url)
  const id = url.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await deleteLead(id)
  return NextResponse.json({ ok: true })
}
