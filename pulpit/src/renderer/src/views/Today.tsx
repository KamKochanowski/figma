import { useEffect, useState } from 'react'
import type { AgentDef, CalEvent, WaitingItem } from '../../../shared/types'
import { SILENCE_DAYS } from '../../../shared/status'
import { api, isDemo } from '../api'
import { DemoTag, Empty, Meter, Panel, Swatch } from '../components/ui'
import { dayLong, dayShort, daysUntil, money, plural, timeAgo } from '../format'
import { useStore } from '../store'

export function Today() {
  const s = useStore()
  const [events, setEvents] = useState<CalEvent[]>([])
  const [agents, setAgents] = useState<AgentDef[]>([])
  useEffect(() => {
    void api.calendar.list(30).then(setEvents)
    void api.agents.list().then(setAgents)
  }, [])
  if (!s.ws) return <Empty>Czytam folder PROJEKTY GRAFICZNE...</Empty>
  const ws = s.ws
  const open = ws.todos.filter((t) => !t.done)
  const done = ws.todos.filter((t) => t.done)
  const waiting = [...ws.waiting, ...ws.inquiries].sort((a, b) => (b.daysSilent ?? -1) - (a.daysSilent ?? -1))
  const month = new Date().toISOString().slice(0, 7)
  const monthIncome = ws.income.filter((i) => i.month === month).reduce((a, i) => a + i.amount, 0)
  const toBill = ws.tasks.filter((t) => t.status === 'do_rozliczenia').reduce((a, t) => a + (t.amount ?? 0), 0)
  const goal = s.settings?.monthlyGoal ?? 0
  const best = [...s.limits].sort((a, b) => (a.fiveHour?.usedPct ?? 0) - (b.fiveHour?.usedPct ?? 0))[0]

  return (
    <>
      <header className="view-head">
        <div>
          <h1 className="view-title">{dayLong(new Date())}</h1>
          <p className="view-sub">
            {open.length} {plural(open.length, 'rzecz', 'rzeczy', 'rzeczy')} na liście, {waiting.filter((w) => (w.daysSilent ?? 0) >= SILENCE_DAYS).length} klientów milczy dłużej niż {SILENCE_DAYS} dni.
            {ws.lastUpdate && ` AKTUALNE_WSPOLPRACE.md z ${dayShort(ws.lastUpdate)}.`}
          </p>
        </div>
        {ws.warnings.length > 0 && <p className="small muted" style={{ maxWidth: 420 }}>{ws.warnings[0]}</p>}
      </header>

      <div className="grid">
        <Panel className="span-7" title="Na wieczór" note={`z AKTUALNE_WSPOLPRACE.md`}>
          {open.length === 0 && <Empty>Lista pusta. Dopisz zadania w AKTUALNE_WSPOLPRACE.md albo poproś Claude o plan.</Empty>}
          <div className="list">
            {[...open, ...done].map((t) => (
              <div key={t.id} className={`todo${t.done ? ' done' : ''}`}>
                <input
                  type="checkbox"
                  id={`todo-${t.id}`}
                  checked={t.done}
                  onChange={() => api.workspace.toggleTodo(t.id).catch((e: Error) => s.notify(e.message))}
                  aria-label={`Odhacz: ${t.label ?? t.text}`}
                />
                <label htmlFor={`todo-${t.id}`} style={{ cursor: 'pointer', minWidth: 0 }}>
                  <span className="todo-label">
                    {t.brandId && <Swatch brand={s.brand(t.brandId)} />}
                    {t.label ?? 'Zadanie'}
                  </span>
                  <span className="todo-text" style={{ display: 'block' }}>{t.text}</span>
                </label>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          className="span-5"
          title="Konta Claude"
          note={isDemo ? <DemoTag /> : undefined}
          action={<button className="btn small ghost" onClick={() => void s.refreshLimits()}>Odśwież</button>}
        >
          {s.settings?.profiles.map((p) => {
            const l = s.limits.find((x) => x.profileId === p.id)
            const isActive = s.settings?.activeProfile === p.id
            return (
              <div className="account" key={p.id}>
                <div className="spread">
                  <span className="account-name">{p.label}</span>
                  <span className="row">
                    {best?.profileId === p.id && s.limits.length > 1 && <span className="pill">więcej zapasu</span>}
                    {isActive ? (
                      <span className="pill on">w użyciu</span>
                    ) : (
                      <button className="btn small" onClick={() => void s.setSettings({ activeProfile: p.id })}>Używaj</button>
                    )}
                  </span>
                </div>
                <Meter label="Okno 5 h" w={l?.fiveHour} />
                <Meter label="Tydzień" w={l?.sevenDay} />
                {l?.updatedAt && <span className="small muted">Dane {timeAgo(new Date(l.updatedAt).toISOString())}{l.model ? `, model ${l.model}` : ''}</span>}
              </div>
            )
          })}
        </Panel>

        <Panel className="span-4" title="Czekam na klienta" note="dni ciszy">
          <WaitingList items={waiting} />
        </Panel>

        <Panel className="span-4" title="Terminy" note="30 dni">
          {events.length === 0 && <Empty>Brak terminów. Wpisz pole termin w ZADANIE.md albo dodaj kalendarz w Ustawieniach.</Empty>}
          <div className="list">
            {events.slice(0, 7).map((e) => {
              const d = daysUntil(e.start)
              return (
                <div className="li" key={e.id}>
                  <div className="li-top">
                    <span className="li-title">{e.title}</span>
                    <span className="days" data-level={d <= 3 ? 'bad' : d <= 7 ? 'warn' : undefined}>{d === 0 ? 'dziś' : d}</span>
                  </div>
                  <span className="li-sub">{dayShort(e.start)}{d > 0 ? `, za ${d} ${plural(d, 'dzień', 'dni', 'dni')}` : ''}</span>
                </div>
              )
            })}
          </div>
        </Panel>

        <Panel className="span-4" title="Kasa w tym miesiącu" note={isDemo ? 'ze znanych kwot z 22.10' : 'z ZAROBKI.md'}>
          <div className="figure">{money(monthIncome)}</div>
          <p className="small muted" style={{ margin: '8px 0 14px' }}>
            {goal ? `${Math.round((monthIncome / goal) * 100)}% celu ${money(goal)}` : 'Ustaw cel w Ustawieniach'}
          </p>
          <div className="spread small"><span className="muted">Do rozliczenia</span><b>{money(toBill)}</b></div>
          <button className="btn small" style={{ marginTop: 12 }} onClick={() => s.go('finanse')}>Finanse</button>
        </Panel>

        <Panel className="span-6" title="Ostatnio zrobione" note="dziennik zmian">
          <div className="list">
            {ws.log.slice(0, 7).map((l, i) => (
              <div className="li" key={i}>
                <span className="small muted">{dayShort(l.date)}</span>
                <span className="li-sub">{l.text}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="span-6" title="Agenci" action={<button className="btn small ghost" onClick={() => s.go('agenci')}>Wszyscy</button>}>
          <div className="list">
            {agents.slice(0, 5).map((a) => (
              <div className="li" key={a.id}>
                <div className="li-top">
                  <span className="li-title">{a.name}</span>
                  <span className="small muted">{a.lastRun ? timeAgo(a.lastRun.at) : a.schedule ? 'czeka na swoją porę' : 'na żądanie'}</span>
                </div>
                <span className="li-sub">{a.lastRun?.output ?? a.description}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  )
}

export function WaitingList({ items }: { items: WaitingItem[] }) {
  const s = useStore()
  if (items.length === 0) return <Empty>Nikt nie milczy. Dobra robota.</Empty>
  return (
    <div className="list">
      {items.map((w, i) => (
        <div className="li clickable" key={i} onClick={() => w.brandId && s.go('wspolprace', w.brandId)} style={{ padding: '9px 6px' }}>
          <div className="li-top">
            <span className="li-title row" style={{ flexWrap: 'nowrap' }}>
              {w.brandId && <Swatch brand={s.brand(w.brandId)} />}
              {w.client}
            </span>
            {w.daysSilent !== undefined && (
              <span className="days" data-level={w.daysSilent >= 10 ? 'bad' : w.daysSilent >= SILENCE_DAYS ? 'warn' : undefined} title="dni od wysłania">
                {w.daysSilent}
              </span>
            )}
          </div>
          <span className="li-sub">{w.waitingFor}</span>
        </div>
      ))}
    </div>
  )
}
