import { NextResponse } from 'next/server'
import { getAdminSessionFromRequest } from '../../../lib/admin/auth'
import { getLeadNotifyEmails, setLeadNotifyEmails } from '../../../lib/admin/store'

export async function GET(request: Request) {
  if (!getAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({
    leadNotifyEmails: await getLeadNotifyEmails(),
  })
}

export async function PUT(request: Request) {
  if (!getAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json()) as { leadNotifyEmails?: unknown }
  if (!Array.isArray(body.leadNotifyEmails)) {
    return NextResponse.json({ error: 'leadNotifyEmails must be an array' }, { status: 400 })
  }

  const emails = await setLeadNotifyEmails(body.leadNotifyEmails.map(String))
  return NextResponse.json({ leadNotifyEmails: emails })
}
