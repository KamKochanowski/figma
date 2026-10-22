import { useState } from 'react'
import { api } from '../api'
import { Panel, Status, Swatch } from '../components/ui'
import { useStore } from '../store'

// Lista z audytu kochdesign.pl (docs/AUDYT_PORTFOLIO.md, 22.10.2026). Stan odhaczenia trzymamy lokalnie.
const CHECKS: { id: string; group: 'P0' | 'P1' | 'P2'; text: string }[] = [
  { id: 'kontakt', group: 'P0', text: 'Mail w kontakcie: mailto i Twój link do Cal.com zamiast strony głównej cal.com' },
  { id: 'hero', group: 'P0', text: 'Pierwszy ekran: showreel 20-30 s z prac 2026 i jedna linia pozycjonowania' },
  { id: 'numbers', group: 'P0', text: 'Usunąć statystyki rynku („The numbers”), w zamian 3 liczby z Twoich projektów' },
  { id: 'grid2026', group: 'P0', text: 'Siatka 6-8 najlepszych prac 2026 z PDF-a (bez NDA)' },
  { id: 'meta', group: 'P0', text: 'Tytuł strony, opis, alt w obrazach, jeden tytuł zawodowy wszędzie' },
  { id: 'cases', group: 'P1', text: '4 pełne case studies: Niemiec, AW Parts, ZOX, kampania z AI' },
  { id: 'identity', group: 'P1', text: 'Jedna identyfikacja ze stroną, PDF-em i CV (Bodoni Moda + Schibsted Grotesk)' },
  { id: 'skills', group: 'P1', text: 'Usunąć suwaki umiejętności' },
  { id: 'testimonials', group: 'P1', text: '3 opinie z imieniem i firmą, za zgodą' },
  { id: 'weight', group: 'P1', text: 'Lżejsze podstrony Trec i Endurance (WebP, wideo zamiast setek klatek)' },
  { id: 'lang', group: 'P2', text: 'Wersja PL i EN' },
  { id: 'behance', group: 'P2', text: 'Te same case studies na Behance (1400 px, okładka bez tekstu)' },
  { id: 'index', group: 'P2', text: 'Włączyć indeksowanie, Google Search Console' },
  { id: 'awwwards', group: 'P2', text: 'Zgłoszenie na Awwwards po P1' }
]

const KEY = 'pulpit-portfolio-checks'
function loadChecks(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}')
  } catch {
    return {}
  }
}

export function Portfolio() {
  const s = useStore()
  const [done, setDone] = useState<Record<string, boolean>>(loadChecks)
  const toggle = (id: string): void => {
    const next = { ...done, [id]: !done[id] }
    setDone(next)
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      // bez zapisu, lista działa do zamknięcia okna
    }
  }
  // Kandydaci na case study: wysłane i zamknięte zadania marek bez NDA
  const nda = new Set(['RUE_DE_SKIN'])
  const candidates = (s.ws?.tasks ?? []).filter((t) => ['wyslane', 'zamkniete', 'do_rozliczenia', 'czeka_na_klienta'].includes(t.status) && !nda.has(t.brandId))
  const count = CHECKS.filter((c) => done[c.id]).length

  return (
    <>
      <header className="view-head">
        <div>
          <h1 className="view-title">Portfolio</h1>
          <p className="view-sub">kochdesign.pl: plan z audytu z 22.10.2026. Zmiany robi lokalny Claude we Framerze, na kopii projektu. Publikujesz Ty.</p>
        </div>
        <div className="row">
          <a className="btn small" href="https://www.kochdesign.pl/" target="_blank" rel="noreferrer">kochdesign.pl</a>
          <a className="btn small" href="https://framer.com/projects/Kamil-Kochanowski-Portfolio-copy--fMkDXvd11ta2CYFfhhdz-8WBaD" target="_blank" rel="noreferrer">Kopia we Framerze</a>
          <a className="btn small" href="https://www.behance.net/kamilka3" target="_blank" rel="noreferrer">Behance</a>
        </div>
      </header>
      <div className="grid">
        <Panel className="span-7" title="Plan zmian" note={`${count} z ${CHECKS.length}`}>
          {(['P0', 'P1', 'P2'] as const).map((g) => (
            <div key={g} style={{ marginBottom: 14 }}>
              <div className="small muted" style={{ marginBottom: 4 }}>{g === 'P0' ? 'P0, w tym tygodniu' : g === 'P1' ? 'P1, 2-3 tygodnie' : 'P2, potem'}</div>
              {CHECKS.filter((c) => c.group === g).map((c) => (
                <div key={c.id} className={`todo${done[c.id] ? ' done' : ''}`}>
                  <input type="checkbox" id={`pf-${c.id}`} checked={!!done[c.id]} onChange={() => toggle(c.id)} />
                  <label htmlFor={`pf-${c.id}`} className="todo-text" style={{ cursor: 'pointer', color: 'var(--ink)' }}>{c.text}</label>
                </div>
              ))}
            </div>
          ))}
        </Panel>
        <Panel className="span-5" title="Na case study" note="bez marek pod NDA">
          <div className="list">
            {candidates.map((t) => (
              <div className="li" key={t.id}>
                <div className="li-top">
                  <span className="li-title row" style={{ flexWrap: 'nowrap' }}><Swatch brand={s.brand(t.brandId)} />{s.brand(t.brandId)?.name}</span>
                  <Status status={t.status} />
                </div>
                <span className="li-sub">ZAD_{String(t.number).padStart(2, '0')} {t.title}</span>
              </div>
            ))}
          </div>
          <button className="btn small" style={{ marginTop: 12 }} onClick={() => (s.notify('Agent „Case study” zaczął pracę.'), void api.agents.run('case-study'))}>
            Szkic case study z ostatniego zadania
          </button>
          <p className="small muted" style={{ marginTop: 10 }}>Przy markach z They najpierw sprawdź, co wolno pokazać. Rue de Skin pomijamy (NDA).</p>
        </Panel>
      </div>
    </>
  )
}
