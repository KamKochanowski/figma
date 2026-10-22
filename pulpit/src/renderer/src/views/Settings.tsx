import { useEffect, useState } from 'react'
import type { Settings } from '../../../shared/types'
import { api } from '../api'
import { Panel } from '../components/ui'
import { useStore } from '../store'

export function SettingsView() {
  const s = useStore()
  const [draft, setDraft] = useState<Settings | undefined>(s.settings)
  const [pass, setPass] = useState<Record<string, string>>({})
  useEffect(() => setDraft(s.settings), [s.settings])
  if (!draft) return null
  const set = (patch: Partial<Settings>): void => setDraft({ ...draft, ...patch })

  return (
    <>
      <header className="view-head">
        <div>
          <h1 className="view-title">Ustawienia</h1>
          <p className="view-sub">Zapisane na tym komputerze. Hasła do poczty szyfruje Windows.</p>
        </div>
        <button className="btn primary" onClick={() => void s.setSettings(draft).then(() => s.notify('Zapisane.'))}>Zapisz</button>
      </header>
      <div className="grid">
        <Panel className="span-6" title="Folder i kasa">
          <div style={{ display: 'grid', gap: 12 }}>
            <div className="field">
              <label htmlFor="set-root">Folder PROJEKTY GRAFICZNE</label>
              <input id="set-root" className="input" value={draft.projectsRoot} onChange={(e) => set({ projectsRoot: e.target.value })} />
            </div>
            <div className="row" style={{ alignItems: 'end' }}>
              <div className="field" style={{ flex: 1 }}>
                <label htmlFor="set-goal">Cel miesięczny netto (zł)</label>
                <input id="set-goal" className="input" type="number" value={draft.monthlyGoal} onChange={(e) => set({ monthlyGoal: Number(e.target.value) })} />
              </div>
              <div className="field" style={{ width: 90 }}>
                <label htmlFor="set-rmin">Stawka od</label>
                <input id="set-rmin" className="input" type="number" value={draft.rate.min} onChange={(e) => set({ rate: { ...draft.rate, min: Number(e.target.value) } })} />
              </div>
              <div className="field" style={{ width: 90 }}>
                <label htmlFor="set-rmax">do (zł/h)</label>
                <input id="set-rmax" className="input" type="number" value={draft.rate.max} onChange={(e) => set({ rate: { ...draft.rate, max: Number(e.target.value) } })} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="set-theme">Wygląd</label>
              <select id="set-theme" className="select" value={draft.theme} onChange={(e) => set({ theme: e.target.value as Settings['theme'] })}>
                <option value="system">Jak w Windows</option>
                <option value="dark">Nocna zmiana (ciemny)</option>
                <option value="light">Dzień (jasny)</option>
              </select>
            </div>
            <label className="row small">
              <input type="checkbox" id="set-aw" checked={draft.activityWatch} onChange={(e) => set({ activityWatch: e.target.checked })} />
              Czas pracy z ActivityWatch (darmowy, lokalny, activitywatch.net)
            </label>
          </div>
        </Panel>

        <Panel className="span-6" title="Konta Claude">
          <div style={{ display: 'grid', gap: 12 }}>
            {draft.profiles.map((p, i) => (
              <div className="row" key={p.id} style={{ alignItems: 'end' }}>
                <div className="field" style={{ width: 120 }}>
                  <label htmlFor={`set-pl-${p.id}`}>Nazwa</label>
                  <input id={`set-pl-${p.id}`} className="input" value={p.label} onChange={(e) => set({ profiles: draft.profiles.map((x, k) => (k === i ? { ...x, label: e.target.value } : x)) })} />
                </div>
                <div className="field" style={{ flex: 1, minWidth: 200 }}>
                  <label htmlFor={`set-pd-${p.id}`}>Folder konfiguracji</label>
                  <input id={`set-pd-${p.id}`} className="input" value={p.configDir} onChange={(e) => set({ profiles: draft.profiles.map((x, k) => (k === i ? { ...x, configDir: e.target.value } : x)) })} />
                </div>
              </div>
            ))}
            <p className="small muted" style={{ margin: 0 }}>Drugie konto zakłada skrypt scripts\konto2.ps1: osobne logowanie, wspólna historia rozmów i skille.</p>
          </div>
        </Panel>

        <Panel className="span-6" title="Poczta (Gmail przez IMAP)">
          <div style={{ display: 'grid', gap: 12 }}>
            {draft.mail.map((m, i) => (
              <div key={m.id} style={{ display: 'grid', gap: 6 }}>
                <div className="row" style={{ alignItems: 'end' }}>
                  <div className="field" style={{ width: 150 }}>
                    <label htmlFor={`set-ml-${m.id}`}>Nazwa</label>
                    <input id={`set-ml-${m.id}`} className="input" value={m.label} onChange={(e) => set({ mail: draft.mail.map((x, k) => (k === i ? { ...x, label: e.target.value } : x)) })} />
                  </div>
                  <div className="field" style={{ flex: 1, minWidth: 200 }}>
                    <label htmlFor={`set-mu-${m.id}`}>Adres</label>
                    <input id={`set-mu-${m.id}`} className="input" value={m.user} onChange={(e) => set({ mail: draft.mail.map((x, k) => (k === i ? { ...x, user: e.target.value } : x)) })} />
                  </div>
                </div>
                <div className="row">
                  <input id={`set-mp-${m.id}`} className="input" style={{ flex: 1 }} type="password" placeholder="Hasło aplikacji (16 znaków)" value={pass[m.id] ?? ''} onChange={(e) => setPass({ ...pass, [m.id]: e.target.value })} aria-label={`Hasło aplikacji dla ${m.label}`} />
                  <button className="btn small" disabled={!pass[m.id]} onClick={() => void api.mail.setPassword(m.id, pass[m.id]).then(() => (setPass({ ...pass, [m.id]: '' }), s.notify('Hasło zapisane i zaszyfrowane.')))}>Zapisz hasło</button>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="span-6" title="Kalendarze Google">
          <p className="small muted" style={{ marginTop: 0 }}>Kalendarz Google, Ustawienia kalendarza, „Tajny adres w formacie iCal”. Wklej adres poniżej. Terminy z ZADANIE.md Pulpit dokłada sam.</p>
          {draft.calendars.map((c, i) => (
            <div className="row" key={i} style={{ marginBottom: 8 }}>
              <input className="input" style={{ width: 120 }} value={c.label} aria-label="Nazwa kalendarza" onChange={(e) => set({ calendars: draft.calendars.map((x, k) => (k === i ? { ...x, label: e.target.value } : x)) })} />
              <input className="input" style={{ flex: 1 }} value={c.url} aria-label="Adres iCal" onChange={(e) => set({ calendars: draft.calendars.map((x, k) => (k === i ? { ...x, url: e.target.value } : x)) })} />
              <button className="btn small ghost" onClick={() => set({ calendars: draft.calendars.filter((_, k) => k !== i) })}>Usuń</button>
            </div>
          ))}
          <button className="btn small" onClick={() => set({ calendars: [...draft.calendars, { label: 'Kalendarz', url: '' }] })}>Dodaj kalendarz</button>
        </Panel>
      </div>
    </>
  )
}
