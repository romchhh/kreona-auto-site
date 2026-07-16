/** Formats Polish phone as +48 XXX XXX XXX */
export function formatPlPhone(input: string): string {
  let digits = input.replace(/\D/g, '')

  if (digits.startsWith('48')) {
    digits = digits.slice(0, 11)
  } else if (digits.length > 0) {
    digits = (`48${digits}`).slice(0, 11)
  } else {
    return ''
  }

  const rest = digits.slice(2)
  let result = '+48'

  if (rest.length === 0) return result

  result += ` ${rest.slice(0, Math.min(3, rest.length))}`
  if (rest.length <= 3) return result

  result += ` ${rest.slice(3, Math.min(6, rest.length))}`
  if (rest.length <= 6) return result

  result += ` ${rest.slice(6, Math.min(9, rest.length))}`
  return result
}

export function isCompletePlPhone(phone: string): boolean {
  return phone.replace(/\D/g, '').length === 11
}
