import { isDemo } from '../api'
import { HBars, MonthBars } from '../components/charts'
import { DemoTag, Empty, Panel } from '../components/ui'
import { DEMO_MONTHS } from '../demo'
import { money } from '../format'
import { useStore } from '../store'
import { SOURCE_LABEL } from '../../../shared/status'

export function Finance() {
  const s = useStore()
  if (!s.ws) return null
  const ws = s.ws
  const now = new Date().toISOString().slice(0, 7)
  const byMonth = new Map<string, number>()
  for (const i of ws.income) byMonth.set(i.month, (byMonth.get(i.month) ?? 0) + i.amount)
  const months = isDemo
    ? [...DEMO_MONTHS, { month: now, amount: byMonth.get(now) ?? 0, example: false }]
    : lastMonths(12, now).map((m) => ({ month: m, amount: byMonth.get(m) ?? 0 }))
  const thisMonth = byMonth.get(now) ?? 0
  const year = [...byMonth.entries()].filter(([m]) => m.startsWith(now.slice(0, 4))).reduce((a, [, v]) => a + v, 0)
  const toBill = ws.tasks.filter((t) => t.status === 'do_rozliczenia').reduce((a, t) => a + (t.amount ?? 0), 0)
  const goal = s.settings?.monthlyGoal ?? 0

  const clients = new Map<string, number>()
  for (const i of ws.income) clients.set(i.brandId ?? i.client, (clients.get(i.brandId ?? i.client) ?? 0) + i.amount)
  const clientRows = [...clients.entries()].sort((a, b) => b[1] - a[1]).map(([id, v]) => ({ label: s.brand(id)?.name ?? id, value: v, color: s.brand(id)?.color }))

  const sources = new Map<string, number>()
  for (const i of ws.income) {
    const src = s.brand(i.brandId)?.source ?? 'inne'
    sources.set(src, (sources.get(src) ?? 0) + i.amount)
  }
  const top = clientRows[0]
  const share = top && year ? Math.round((top.value / Math.max(year, 1)) * 100) : 0

  return (
    <>
      <header className="view-head">
        <div>
          <h1 className="view-title">Finanse</h1>
          <p className="view-sub">Kwoty netto z ZAROBKI.md i WYCENY.md. Stawka bazowa {s.settings?.rate.min}-{s.settings?.rate.max} zł/h.</p>
        </div>
        {isDemo && <p className="small muted" style={{ maxWidth: 380 }}>Październik ze znanych kwot w AKTUALNE_WSPOLPRACE.md. Wcześniejsze miesiące są przykładowe <DemoTag />, w aplikacji przyjdą z ZAROBKI.md.</p>}
      </header>
      <div className="grid">
        <div className="panel span-12">
          <div className="kpis">
            <div><div className="kpi-label">Ten miesiąc</div><div className="figure">{money(thisMonth)}</div></div>
            <div><div className="kpi-label">Do rozliczenia</div><div className="figure">{money(toBill)}</div></div>
            <div><div className="kpi-label">Do celu miesiąca</div><div className="figure">{money(Math.max(0, goal - thisMonth))}</div></div>
            <div><div className="kpi-label">Od początku roku</div><div className="figure">{money(year)}</div></div>
          </div>
        </div>
        <Panel className="span-8" title="Przychód netto, ostatnie 12 miesięcy" note="przerywana linia to cel">
          <MonthBars data={months} goal={goal} current={now} />
        </Panel>
        <Panel className="span-4" title="Źródła">
          {sources.size === 0 ? <Empty>Brak wpisów w ZAROBKI.md.</Empty> : (
            <HBars rows={[...sources.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ label: SOURCE_LABEL[k as keyof typeof SOURCE_LABEL] ?? k, value: v }))} />
          )}
          <p className="small muted" style={{ marginTop: 12 }}>
            Faktury z działalności idą przez KSeF. Mikrofirmy do 10 tys. zł brutto sprzedaży miesięcznie mają czas do 1.01.2027.
          </p>
        </Panel>
        <Panel className="span-6" title="Klienci" note={share >= 40 ? `${top?.label}: ${share}% przychodu w tym roku` : undefined}>
          {clientRows.length === 0 ? <Empty>Brak wpisów.</Empty> : <HBars rows={clientRows} />}
        </Panel>
        <Panel className="span-6" title="Wpisy">
          <div className="table-wrap">
            <table>
              <thead><tr><th>Miesiąc</th><th>Klient</th><th>Zlecenie</th><th className="num">Kwota</th><th>Płatność</th></tr></thead>
              <tbody>
                {ws.income.slice().reverse().map((i, k) => (
                  <tr key={k}><td className="muted">{i.month}</td><td>{i.client}</td><td className="muted small">{i.task}</td><td className="num">{money(i.amount)}</td><td className="small">{i.paid}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </>
  )
}

function lastMonths(n: number, now: string): string[] {
  const [y, m] = now.split('-').map(Number)
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(y, m - 1 - (n - 1 - i), 1)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })
}
