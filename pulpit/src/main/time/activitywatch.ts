// Prawdziwy czas pracy na markę z ActivityWatch (darmowy, lokalny, activitywatch.net).
// Illustrator, Photoshop, After Effects i Figma mają w tytule okna nazwę pliku, a pliki leżą
// w folderach marek, więc dopasowujemy tytuł do marki. Czas bezczynności (AFK) odpada.
import type { Brand, TimeByBrand } from '../../shared/types'
import { brandKeys, matchBrand } from '../workspace/parse'

const AW = 'http://localhost:5600/api/0'

export async function timeByBrand(brands: Brand[], days: number): Promise<TimeByBrand[]> {
  const buckets = (await (await fetch(`${AW}/buckets/`)).json()) as Record<string, unknown>
  const win = Object.keys(buckets).find((b) => b.startsWith('aw-watcher-window_'))
  const afk = Object.keys(buckets).find((b) => b.startsWith('aw-watcher-afk_'))
  if (!win || !afk) return []
  const end = new Date()
  const start = new Date(end.getTime() - days * 86400000)
  const query = [
    `win = query_bucket("${win}");`,
    `afk = filter_keyvals(query_bucket("${afk}"), "status", ["not-afk"]);`,
    'win = filter_period_intersect(win, afk);',
    'RETURN = merge_events_by_keys(win, ["app", "title"]);'
  ].join(' ')
  const res = await fetch(`${AW}/query/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ timeperiods: [`${start.toISOString()}/${end.toISOString()}`], query: [query] })
  })
  const [events] = (await res.json()) as { duration: number; data: { app: string; title: string } }[][]
  const keys = brandKeys(brands)
  const map = new Map<string, TimeByBrand>()
  for (const e of events ?? []) {
    const id = matchBrand(e.data.title.replace(/[_\\/.-]/g, ' '), keys)
    if (!id) continue
    const t = map.get(id) ?? { brandId: id, hours: 0, apps: {} }
    const h = e.duration / 3600
    t.hours += h
    const app = e.data.app.replace(/\.exe$/i, '')
    t.apps[app] = (t.apps[app] ?? 0) + h
    map.set(id, t)
  }
  return [...map.values()].sort((a, b) => b.hours - a.hours)
}
