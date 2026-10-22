import { useEffect, useState } from 'react'
import type { AgentDef } from '../../../shared/types'
import { api, isDemo } from '../api'
import { Empty, Panel } from '../components/ui'
import { timeAgo } from '../format'
import { useStore } from '../store'

const DAYS = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota']

/** "30 16 * * 1,3,5" na „pon., śr., pt. o 16:30” */
export function humanCron(c?: string): string {
  if (!c) return 'na żądanie'
  const [min, hour, , , dow] = c.split(/\s+/)
  const time = `${hour.padStart(2, '0')}:${min.padStart(2, '0')}`
  if (dow === '*') return `codziennie o ${time}`
  if (dow === '1-5') return `w dni robocze o ${time}`
  const days = dow.split(',').map((d) => DAYS[Number(d) % 7]).join(', ')
  return `${days} o ${time}`
}

export function Agents() {
  const s = useStore()
  const [list, setList] = useState<AgentDef[]>()
  const [busy, setBusy] = useState<string>()
  const load = (): void => void api.agents.list().then(setList)
  useEffect(() => {
    load()
    return api.agents.onFinished(() => load())
  }, [])

  return (
    <>
      <header className="view-head">
        <div>
          <h1 className="view-title">Agenci</h1>
          <p className="view-sub">
            Claude pracuje w tle według harmonogramu, na Twoim koncie, w Twoim folderze. Czyta wszystko, zapisuje tylko raporty i szkice w _SYSTEM/PULPIT. Nic nie wysyła.
          </p>
        </div>
      </header>
      <div className="grid">
        {!list && <Empty>Wczytuję agentów...</Empty>}
        {list?.map((a) => (
          <Panel
            className="span-6"
            key={a.id}
            title={a.name}
            note={humanCron(a.schedule)}
            action={
              <label className="row small" style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  id={`agent-${a.id}`}
                  checked={a.enabled}
                  onChange={(e) => void api.agents.setEnabled(a.id, e.target.checked).then(load)}
                />
                włączony
              </label>
            }
          >
            <p style={{ margin: '0 0 12px' }}>{a.description}</p>
            {a.lastRun && (
              <div className="li" style={{ marginBottom: 12 }}>
                <span className="small muted">Ostatnio {timeAgo(a.lastRun.at)}{isDemo ? ' (przykład)' : ''}</span>
                <span className="li-sub">{a.lastRun.output}</span>
              </div>
            )}
            <div className="row">
              <button
                className="btn small"
                disabled={busy === a.id}
                onClick={() => {
                  setBusy(a.id)
                  s.notify(`${a.name}: start. Wynik przyjdzie jako powiadomienie.`)
                  void api.agents.run(a.id).finally(() => (setBusy(undefined), load()))
                }}
              >
                {busy === a.id ? 'Pracuje...' : 'Uruchom teraz'}
              </button>
              {a.lastRun?.file && <button className="btn small ghost" onClick={() => api.workspace.openPath(a.lastRun!.file!)}>Otwórz raport</button>}
              <span className="small muted">konto: {s.settings?.profiles.find((p) => p.id === a.profileId)?.label ?? 'w użyciu'}</span>
            </div>
          </Panel>
        ))}
        <Panel className="span-12" title="Własny agent">
          <p className="small" style={{ margin: 0 }}>
            Dodaj plik .md do PROJEKTY GRAFICZNE/_SYSTEM/PULPIT/agenci: na górze nazwa, opis, harmonogram (cron), konto i gdzie wolno zapisywać, niżej polecenie po polsku. Ten sam plik nadpisuje agenta wbudowanego o tej samej nazwie.
          </p>
        </Panel>
      </div>
    </>
  )
}
