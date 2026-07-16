import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const

type UtmKey = (typeof UTM_KEYS)[number]
type UtmParams = Partial<Record<UtmKey, string>>

type ContactPayload = {
  name?: string
  contact?: string
  phone?: string
  carSearch?: string
  comment?: string
  car?: {
    id?: string
    label?: string
    price?: string
    details?: string
  }
  utm?: UtmParams
}

function getEnv(name: string) {
  const value = process.env[name]?.trim()
  if (!value) return undefined
  return value.replace(/^['"]|['"]$/g, '')
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function normalizeUtm(utm: UtmParams | undefined): Record<UtmKey, string> {
  const result = {} as Record<UtmKey, string>
  for (const key of UTM_KEYS) {
    const value = utm?.[key]?.trim()
    result[key] = value || '-'
  }
  return result
}

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:8px 12px;color:#666;vertical-align:top;white-space:nowrap;">${label}</td>
    <td style="padding:8px 12px;color:#111;font-weight:600;">${escapeHtml(value)}</td>
  </tr>`
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload
    const name = body.name?.trim()
    const contact = body.contact?.trim() || body.phone?.trim()
    const carSearch = body.carSearch?.trim() || '-'
    const comment = body.comment?.trim() || '-'
    const car = body.car
    const utm = normalizeUtm(body.utm)

    if (!name || !contact) {
      return NextResponse.json(
        { error: 'Імʼя та контакт обовʼязкові.' },
        { status: 400 },
      )
    }

    const apiKey = getEnv('RESEND_API_KEY')
    const emailFrom = getEnv('EMAIL_FROM')
    const emailTo = getEnv('EMAIL_TO')

    if (!apiKey || !emailFrom || !emailTo) {
      console.error('[contact] Missing RESEND_API_KEY, EMAIL_FROM or EMAIL_TO')
      return NextResponse.json(
        { error: 'Сервіс тимчасово недоступний.' },
        { status: 503 },
      )
    }

    const sentAt = new Date().toLocaleString('uk-UA', {
      timeZone: 'Europe/Warsaw',
      dateStyle: 'short',
      timeStyle: 'short',
    })

    const subject = car?.label
      ? `Заявка KREONA - ${car.label}`
      : `Нова заявка KREONA - ${name}`

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#111;">
        <h2 style="margin:0 0 4px;font-size:20px;">Нова заявка - KREONA</h2>
        <p style="margin:0 0 20px;color:#666;font-size:13px;">${escapeHtml(sentAt)}</p>
        <table style="width:100%;border-collapse:collapse;background:#f7f7f5;border-radius:12px;overflow:hidden;">
          ${car?.label ? row('Авто', car.label) : ''}
          ${car?.price ? row('Ціна', car.price) : ''}
          ${car?.details ? row('Деталі', car.details) : ''}
          ${row("Імʼя", name)}
          ${row('Контакт', contact)}
          ${row('Що шукає', carSearch)}
          ${row('Коментар', comment)}
        </table>
        <p style="margin:20px 0 8px;font-size:13px;color:#666;font-weight:700;">UTM</p>
        <pre style="margin:0;padding:12px;background:#f0f0ec;border-radius:8px;font-size:12px;color:#333;white-space:pre-wrap;">utm_source=${escapeHtml(utm.utm_source)}
utm_medium=${escapeHtml(utm.utm_medium)}
utm_campaign=${escapeHtml(utm.utm_campaign)}
utm_content=${escapeHtml(utm.utm_content)}
utm_term=${escapeHtml(utm.utm_term)}</pre>
      </div>
    `

    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: emailFrom,
      to: [emailTo],
      replyTo: contact.includes('@') ? contact : undefined,
      subject,
      html,
    })

    if (error) {
      console.error('[contact] Resend error:', error)
      return NextResponse.json(
        { error: 'Не вдалося надіслати заявку. Спробуйте пізніше.' },
        { status: 502 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[contact] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Сталася помилка. Спробуйте ще раз.' },
      { status: 500 },
    )
  }
}
