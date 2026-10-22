import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { taskInk } from '../../shared/status'
import { isDemo } from './api'
import { DemoTag, useToast } from './components/ui'
import { StoreProvider, useStore, type ViewId } from './store'
import { Agents } from './views/Agents'
import { Board } from './views/Board'
import { Brands } from './views/Brands'
import { ClaudeView } from './views/Claude'
import { Finance } from './views/Finance'
import { Mail } from './views/Mail'
import { Portfolio } from './views/Portfolio'
import { SettingsView } from './views/Settings'
import { Today } from './views/Today'

const NAV: { id: ViewId; label: string }[] = [
  { id: 'dzis', label: 'Dziś' },
  { id: 'wspolprace', label: 'Współprace' },
  { id: 'zlecenia', label: 'Zlecenia' },
  { id: 'finanse', label: 'Finanse' },
  { id: 'claude', label: 'Claude' },
  { id: 'poczta', label: 'Poczta' },
  { id: 'agenci', label: 'Agenci' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'ustawienia', label: 'Ustawienia' }
]

export default function App() {
  const [toast, notify] = useToast()
  return (
    <StoreProvider notify={notify}>
      <Shell />
      {toast}
    </StoreProvider>
  )
}

function Shell() {
  const s = useStore()
  const [palette, setPalette] = useState(false)
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPalette((p) => !p)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const counts: Partial<Record<ViewId, number>> = {
    dzis: s.ws?.todos.filter((t) => !t.done).length,
    zlecenia: s.ws?.tasks.filter((t) => t.status !== 'zamkniete').length,
    wspolprace: s.ws?.brands.filter((b) => b.status === 'aktywna').length
  }
  const active = s.settings?.profiles.find((p) => p.id === s.settings?.activeProfile)

  return (
    <div className="app">
      <nav className="rail" aria-label="Główna nawigacja">
        <div className="wordmark">
          Pulpit
          <small>Kamil Kochanowski {isDemo && <DemoTag>podgląd</DemoTag>}</small>
        </div>
        {NAV.map((n) => (
          <button key={n.id} className="nav-btn" aria-current={s.view === n.id ? 'page' : undefined} onClick={() => s.go(n.id)}>
            {n.label}
            {counts[n.id] ? <span className="count">{counts[n.id]}</span> : null}
          </button>
        ))}
        <div className="rail-foot">
          <span className="small muted">Nowe rozmowy idą na</span>
          <button className="btn small" onClick={() => s.go('claude')}>{active?.label ?? 'Konto'}</button>
          <span className="small muted">Ctrl+K szukaj, Ctrl+Alt+P pokaż</span>
        </div>
      </nav>
      <div className="main">
        <ControlStrip />
        <main className="view" id="widok">
          {s.view === 'dzis' && <Today />}
          {s.view === 'wspolprace' && <Brands />}
          {s.view === 'zlecenia' && <Board />}
          {s.view === 'finanse' && <Finance />}
          {s.view === 'claude' && <ClaudeView />}
          {s.view === 'poczta' && <Mail />}
          {s.view === 'agenci' && <Agents />}
          {s.view === 'portfolio' && <Portfolio />}
          {s.view === 'ustawienia' && <SettingsView />}
        </main>
      </div>
      {palette && <Palette onClose={() => setPalette(false)} />}
    </div>
  )
}

// Pasek kontrolny jak na arkuszu z drukarni: najpierw farby procesowe ze stanem zleceń, potem kolory marek
function ControlStrip() {
  const s = useStore()
  const tasks = s.ws?.tasks ?? []
  const count = (ink: string): number => tasks.filter((t) => taskInk(t.status) === ink).length
  const process = [
    { ink: 'c', label: 'w pracy', color: 'var(--c)' },
    { ink: 'm', label: 'Twój ruch', color: 'var(--m)' },
    { ink: 'y', label: 'czeka na klienta', color: 'var(--y)' },
    { ink: 'paper', label: 'do rozliczenia', color: 'var(--sheet)' },
    { ink: 'k', label: 'zamknięte', color: 'var(--k)' }
  ]
  const brands = (s.ws?.brands ?? []).filter((b) => b.status === 'aktywna' || b.status === 'czeka')
  return (
    <div className="strip" role="toolbar" aria-label="Pasek kontrolny: stan zleceń i aktywne marki">
      {process.map((p) => (
        <button key={p.ink} className="patch" onClick={() => s.go('zlecenia')} title={`${count(p.ink)} ${p.label}`}>
          <span className="ink" style={{ '--patch': p.color, boxShadow: p.ink === 'paper' ? 'inset 0 0 0 1.5px var(--ink-2)' : undefined } as CSSProperties} />
          <span className="lbl"><b>{count(p.ink)}</b>{p.label}</span>
        </button>
      ))}
      {brands.map((b, i) => (
        <button key={b.id} className={`patch${i === 0 ? ' gap' : ''}`} onClick={() => s.go('wspolprace', b.id)} title={`${b.name}: ${b.lastTask}`}>
          <span className="ink" style={{ '--patch': b.color ?? 'var(--sheet-2)', boxShadow: 'inset 0 0 0 1px rgb(127 127 127 / .3)' } as CSSProperties} />
          <span className="lbl">{b.name.replace(/\s*\(.*\)/, '')}</span>
        </button>
      ))}
      <svg className="strip-reg" viewBox="0 0 18 18" aria-hidden="true">
        <circle cx="9" cy="9" r="5" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M9 0v18M0 9h18" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  )
}

function Palette({ onClose }: { onClose: () => void }) {
  const s = useStore()
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const items = useMemo(() => {
    const all = [
      ...NAV.map((n) => ({ label: n.label, hint: 'widok', run: () => s.go(n.id) })),
      ...(s.ws?.brands ?? []).map((b) => ({ label: b.name, hint: 'marka', run: () => s.go('wspolprace', b.id) })),
      ...(s.ws?.tasks ?? []).map((t) => ({ label: `${s.brand(t.brandId)?.name ?? t.brandId}: ${t.title}`, hint: 'zlecenie', run: () => s.go('zlecenia') })),
      { label: 'Zmieniam konto Claude', hint: 'akcja', run: () => s.go('claude') },
      { label: 'Odśwież limity Claude', hint: 'akcja', run: () => void s.refreshLimits() }
    ]
    const n = q.toLowerCase()
    return all.filter((i) => i.label.toLowerCase().includes(n)).slice(0, 12)
  }, [q, s])
  return (
    <div className="palette-back" onClick={onClose}>
      <div className="palette" role="dialog" aria-label="Szukaj" onClick={(e) => e.stopPropagation()}>
        <input
          id="palette-q"
          autoFocus
          placeholder="Marka, zlecenie albo widok"
          value={q}
          onChange={(e) => (setQ(e.target.value), setSel(0))}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowDown') setSel((x) => Math.min(x + 1, items.length - 1))
            if (e.key === 'ArrowUp') setSel((x) => Math.max(x - 1, 0))
            if (e.key === 'Enter' && items[sel]) (items[sel].run(), onClose())
          }}
        />
        <ul role="listbox">
          {items.map((i, k) => (
            <li key={i.label + k} role="option" aria-selected={k === sel} onMouseEnter={() => setSel(k)} onClick={() => (i.run(), onClose())}>
              <span>{i.label}</span>
              <span className="muted small">{i.hint}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
