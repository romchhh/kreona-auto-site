import { NextResponse } from 'next/server'

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
    result[key] = value || '—'
  }
  return result
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload
    const name = body.name?.trim()
    const contact = body.contact?.trim() || body.phone?.trim()
    const carSearch = body.carSearch?.trim() || '—'
    const comment = body.comment?.trim() || '—'
    const car = body.car
    const utm = normalizeUtm(body.utm)

    if (!name || !contact) {
      return NextResponse.json(
        { error: 'Імʼя та контакт обовʼязкові.' },
        { status: 400 },
      )
    }

    const token = getEnv('BOT_TOKEN')
    const chatId = getEnv('CHAT_ID')

    if (!token || !chatId) {
      console.error('[contact] Missing BOT_TOKEN or CHAT_ID in environment')
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

    const text = [
      '<b>Нова заявка — KREONA</b>',
      `<i>${sentAt}</i>`,
      '',
      ...(car?.label
        ? [
            `<b>Авто:</b> ${escapeHtml(car.label)}`,
            `<b>Ціна:</b> ${escapeHtml(car.price ?? '—')}`,
            `<b>Деталі:</b> ${escapeHtml(car.details ?? '—')}`,
            '',
          ]
        : []),
      `<b>Імʼя:</b> ${escapeHtml(name)}`,
      `<b>Контакт:</b> ${escapeHtml(contact)}`,
      `<b>Який автомобіль шукаєте:</b> ${escapeHtml(carSearch)}`,
      `<b>Коментар:</b> ${escapeHtml(comment)}`,
      '',
      '<b>UTM:</b>',
      `utm_source=${escapeHtml(utm.utm_source)}`,
      `utm_medium=${escapeHtml(utm.utm_medium)}`,
      `utm_campaign=${escapeHtml(utm.utm_campaign)}`,
      `utm_content=${escapeHtml(utm.utm_content)}`,
      `utm_term=${escapeHtml(utm.utm_term)}`,
    ].join('\n')

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      },
    )

    const telegramData = await telegramResponse.json().catch(() => null)

    if (!telegramResponse.ok || !telegramData?.ok) {
      console.error('[contact] Telegram API error:', telegramData)
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
