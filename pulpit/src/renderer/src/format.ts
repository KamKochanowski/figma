const zl = new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 0 })

export const money = (n: number): string => `${zl.format(n)} zł`
export const num = (n: number): string => zl.format(n)

export function dayLong(d: Date): string {
  const s = d.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function dayShort(iso: string): string {
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso)
  return d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })
}

export function timeAgo(iso: string, now = Date.now()): string {
  const min = Math.round((now - Date.parse(iso)) / 60000)
  if (min < 1) return 'przed chwilą'
  if (min < 60) return `${min} min temu`
  const h = Math.round(min / 60)
  if (h < 24) return `${h} h temu`
  const d = Math.round(h / 24)
  return d === 1 ? 'wczoraj' : `${d} dni temu`
}

export function untilReset(unixSec: number, now = Date.now()): string {
  const min = Math.max(0, Math.round((unixSec * 1000 - now) / 60000))
  if (min < 60) return `reset za ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `reset za ${h} h ${min % 60} min`
  return `reset ${new Date(unixSec * 1000).toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'numeric' })}`
}

export function daysUntil(iso: string, now = new Date()): number {
  const a = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  return Math.round((Date.UTC(y, m - 1, d) - a) / 86400000)
}

export function monthLabel(key: string, short = true): string {
  const [y, m] = key.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString('pl-PL', short ? { month: 'short' } : { month: 'long', year: 'numeric' })
}

export function plural(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one
  const d = n % 10
  const t = n % 100
  return d >= 2 && d <= 4 && (t < 12 || t > 14) ? few : many
}
