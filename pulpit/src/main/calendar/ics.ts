// Kalendarz Google bez logowania: „Tajny adres w formacie iCal” z ustawień kalendarza.
// Do tego terminy z ZADANIE.md (pole termin) jako wydarzenia całodniowe.
import ical from 'node-ical'
import type { CalEvent, Task } from '../../shared/types'

export async function fetchCalendars(urls: { label: string; url: string }[], days: number): Promise<CalEvent[]> {
  const now = Date.now()
  const until = now + days * 86400000
  const out: CalEvent[] = []
  for (const c of urls) {
    try {
      const data = await ical.async.fromURL(c.url)
      for (const ev of Object.values(data)) {
        if (!ev || ev.type !== 'VEVENT') continue
        const starts: Date[] = ev.rrule ? ev.rrule.between(new Date(now - 86400000), new Date(until), true) : [ev.start]
        for (const s of starts) {
          const t = s.getTime()
          if (t < now - 86400000 || t > until) continue
          out.push({
            id: `${ev.uid}-${t}`,
            title: typeof ev.summary === 'string' ? ev.summary : String(ev.summary?.val ?? ''),
            start: s.toISOString(),
            end: ev.end?.toISOString(),
            allDay: ev.datetype === 'date',
            source: 'kalendarz'
          })
        }
      }
    } catch {
      // zły albo nieaktualny adres: pomijamy, Ustawienia pokażą pusty kalendarz
    }
  }
  return out
}

export function deadlinesFromTasks(tasks: Task[], days: number): CalEvent[] {
  const until = Date.now() + days * 86400000
  return tasks
    .filter((t) => t.deadline && /^\d{4}-\d{2}-\d{2}/.test(t.deadline) && t.status !== 'zamkniete')
    .filter((t) => Date.parse(t.deadline!) <= until)
    .map((t) => ({
      id: `termin-${t.id}`,
      title: `${t.brandId.replace(/_/g, ' ')}: ${t.title}`,
      start: t.deadline!.slice(0, 10),
      allDay: true,
      source: 'termin' as const,
      brandId: t.brandId
    }))
}
