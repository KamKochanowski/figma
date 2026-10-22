import { useEffect, useState } from 'react'
import { BRAND_STATUS_LABEL, SOURCE_LABEL } from '../../../shared/status'
import type { MailItem } from '../../../shared/types'
import { api } from '../api'
import { Empty, Panel, Status, Swatch } from '../components/ui'
import { dayShort, money } from '../format'
import { useStore } from '../store'

export function Brands() {
  const s = useStore()
  const [sel, setSel] = useState<string | undefined>(s.brandId)
  const [filter, setFilter] = useState<'aktywne' | 'wszystkie'>('aktywne')
  const [mail, setMail] = useState<MailItem[]>([])
  const [newName, setNewName] = useState('')
  useEffect(() => setSel(s.brandId), [s.brandId])
  useEffect(() => void api.mail.list().then(setMail).catch(() => {}), [])
  if (!s.ws) return null
  const brands = s.ws.brands.filter((b) => filter === 'wszystkie' || b.status !== 'zamknieta')
  const b = s.brand(sel) ?? brands[0]
  const tasks = s.ws.tasks.filter((t) => t.brandId === b?.id).sort((x, y) => y.number - x.number)
  const active = s.ws.active.find((a) => a.brandId === b?.id)
  const waits = [...s.ws.waiting, ...s.ws.inquiries].filter((w) => w.brandId === b?.id)
  const income = s.ws.income.filter((i) => i.brandId === b?.id)
  const msgs = mail.filter((m) => m.brandId === b?.id).slice(0, 4)

  return (
    <>
      <header className="view-head">
        <div>
          <h1 className="view-title">Współprace</h1>
          <p className="view-sub">Z MARKI.md i MARKA.md. Kolory marek z ich plików.</p>
        </div>
        <div className="row" role="group" aria-label="Filtr">
          {(['aktywne', 'wszystkie'] as const).map((f) => (
            <button key={f} className={`btn small${filter === f ? ' primary' : ''}`} onClick={() => setFilter(f)}>{f === 'aktywne' ? 'Bez zamkniętych' : 'Wszystkie'}</button>
          ))}
        </div>
      </header>
      <div className="grid">
        <Panel className="span-7" title={`${brands.length} marek`}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Marka</th><th>Skąd</th><th>Status</th><th>Ostatnie zadanie</th></tr>
              </thead>
              <tbody>
                {brands.map((x) => (
                  <tr key={x.id} className={`clickable${x.id === b?.id ? ' sel' : ''}`} onClick={() => setSel(x.id)}>
                    <td><span className="row" style={{ flexWrap: 'nowrap' }}><Swatch brand={x} /><b>{x.name}</b></span></td>
                    <td className="muted">{SOURCE_LABEL[x.source]}</td>
                    <td>{BRAND_STATUS_LABEL[x.status] ?? x.status}</td>
                    <td className="muted small">{x.lastTask}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        {b && (
          <div className="span-5" style={{ display: 'grid', gap: 16 }}>
            <Panel title={b.name} action={<button className="btn small" onClick={() => api.workspace.openPath(b.folder)}>Otwórz folder</button>}>
              <div className="row" style={{ marginBottom: 10 }}>
                <span className="swatch" style={{ width: 40, height: 22, ['--sw' as string]: b.color ?? 'var(--sheet-2)' }} />
                <span className="small muted">{b.color ?? 'kolor do uzupełnienia w MARKA.md'}</span>
              </div>
              <p style={{ margin: '0 0 8px' }}>{b.who}</p>
              {b.summary && <p className="li-sub" style={{ margin: 0 }}>{b.summary}</p>}
              {active && (
                <div className="list" style={{ marginTop: 12 }}>
                  {active.lines.map((l, i) => (
                    <div className="li" key={i}>
                      {l.key && <span className="small muted">{l.key}</span>}
                      <span className="li-sub">{l.text}</span>
                    </div>
                  ))}
                </div>
              )}
              {waits.map((w, i) => (
                <p key={i} className="small" style={{ margin: '10px 0 0' }}><b>Czekam:</b> {w.waitingFor}{w.daysSilent !== undefined ? ` (${w.daysSilent} dni)` : ''}</p>
              ))}
            </Panel>
            <Panel title="Zadania">
              {tasks.length === 0 && <Empty>Brak folderów ZAD_ z ZADANIE.md.</Empty>}
              <div className="list">
                {tasks.map((t) => (
                  <div className="li" key={t.id}>
                    <div className="li-top">
                      <span className="li-title">ZAD_{String(t.number).padStart(2, '0')} {t.title}</span>
                      <Status status={t.status} />
                    </div>
                    <span className="li-sub small">
                      {[t.deadline && `termin ${dayShort(t.deadline)}`, t.amount && money(t.amount), t.estimate && `estymacja ${t.estimate}`].filter(Boolean).join(', ')}
                    </span>
                  </div>
                ))}
              </div>
              <form className="row" style={{ marginTop: 10 }} onSubmit={(e) => {
                e.preventDefault()
                if (!newName.trim()) return
                void api.workspace.newTask(b.id, newName.trim().replace(/\s+/g, '_')).then(() => (setNewName(''), s.notify('Założono folder zadania.')))
              }}>
                <input id="new-task" className="input" style={{ flex: 1 }} placeholder="Nowe zadanie, np. ulotka_A5" value={newName} onChange={(e) => setNewName(e.target.value)} />
                <button className="btn small" type="submit">Załóż</button>
              </form>
            </Panel>
            {(income.length > 0 || msgs.length > 0) && (
              <Panel title="Kasa i poczta">
                {income.map((i, k) => (
                  <div className="spread small" key={k} style={{ padding: '4px 0' }}><span className="muted">{i.task ?? i.month}</span><b>{money(i.amount)}</b></div>
                ))}
                {msgs.map((m) => (
                  <div className="li clickable" key={m.uid} onClick={() => api.mail.open(m)} style={{ padding: '8px 4px' }}>
                    <span className="li-title">{m.subject}</span>
                    <span className="li-sub small">{m.fromName}, {dayShort(m.date)}</span>
                  </div>
                ))}
              </Panel>
            )}
          </div>
        )}
      </div>
    </>
  )
}
