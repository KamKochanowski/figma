import type { CSSProperties } from 'react'
import { TASK_FLOW } from '../../../shared/status'
import type { TaskStatus } from '../../../shared/types'
import { api } from '../api'
import { dayShort, daysUntil, money } from '../format'
import { useStore } from '../store'

// Kolumny według farb: cyjan pracuje, magenta czeka na Kamila, żółty na klienta, potem rozliczenie i zamknięte
const COLUMNS: { title: string; ink: string; statuses: TaskStatus[] }[] = [
  { title: 'W pracy', ink: 'c', statuses: ['w_trakcie', 'do_sprawdzenia'] },
  { title: 'Twój ruch', ink: 'm', statuses: ['do_akceptacji', 'do_wyslania'] },
  { title: 'Czeka na klienta', ink: 'y', statuses: ['wyslane', 'czeka_na_klienta', 'rekrutacja'] },
  { title: 'Do rozliczenia', ink: 'paper', statuses: ['do_rozliczenia'] },
  { title: 'Zamknięte', ink: 'k', statuses: ['zamkniete'] }
]

export function Board() {
  const s = useStore()
  if (!s.ws) return null
  return (
    <>
      <header className="view-head">
        <div>
          <h1 className="view-title">Zlecenia</h1>
          <p className="view-sub">Status z nagłówka ZADANIE.md. Zmiana tutaj zapisuje się w pliku (z kopią w _SYSTEM/PULPIT/kopie).</p>
        </div>
      </header>
      <div className="board">
        {COLUMNS.map((c) => {
          const tasks = s.ws!.tasks.filter((t) => c.statuses.includes(t.status as TaskStatus))
          return (
            <section className="col" key={c.title} aria-label={c.title}>
              <div className="col-head">
                <span className="status" data-ink={c.ink}><i />{c.title}</span>
                <span className="small muted">{tasks.length}</span>
              </div>
              {tasks.map((t) => {
                const b = s.brand(t.brandId)
                const d = t.deadline ? daysUntil(t.deadline) : undefined
                return (
                  <article className="card" key={t.id} style={{ '--sw': b?.color } as CSSProperties}>
                    <div className="card-brand">
                      <span>{b?.name ?? t.brandId}</span>
                      <span>ZAD_{String(t.number).padStart(2, '0')}</span>
                    </div>
                    <div className="card-title">{t.title}</div>
                    {(t.deadline || t.amount) && (
                      <div className="small muted">
                        {t.deadline && <span style={{ color: d !== undefined && d <= 3 ? 'var(--bad)' : undefined }}>termin {dayShort(t.deadline)}</span>}
                        {t.deadline && t.amount ? ', ' : ''}
                        {t.amount ? money(t.amount) : ''}
                      </div>
                    )}
                    <select
                        aria-label={`Zmień status: ${t.title}`}
                        value={t.status}
                        onChange={(e) => api.workspace.setTaskStatus(t.id, e.target.value as TaskStatus).catch((err: Error) => s.notify(err.message))}
                      >
                        {TASK_FLOW.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
                      </select>
                  </article>
                )
              })}
            </section>
          )
        })}
      </div>
    </>
  )
}
