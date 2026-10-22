import { useEffect, useRef, useState } from 'react'
import type { ChatEvent, SessionMessage, SessionSummary, UsageDay } from '../../../shared/types'
import { api, isDemo } from '../api'
import { Spark } from '../components/charts'
import { DemoTag, Empty, Meter, Panel } from '../components/ui'
import { timeAgo } from '../format'
import { useStore } from '../store'

type Line = { kind: 'user' | 'assistant' | 'tool' | 'perm' | 'error'; text: string; requestId?: string }

// Gotowe polecenia. „Zmieniam konto” to procedura z CLAUDE.md (sekcja „Dwa konta Claude”).
const QUICK = [
  {
    label: 'Zmieniam konto',
    prompt: 'Zmieniam konto. Zrób procedurę z CLAUDE.md, sekcja „Dwa konta Claude”: zaktualizuj ZADANIE.md bieżącego zadania (co zrobione, co dalej, następny krok), AKTUALNE_WSPOLPRACE.md i .docx, zapisz rozmowę skryptem zapisz_czat.js. Na końcu napisz w 3 punktach, od czego zacząć na drugim koncie.'
  },
  { label: 'Plan na wieczór', prompt: 'Przeczytaj AKTUALNE_WSPOLPRACE.md i ZADANIE.md aktywnych zadań. Daj mi plan na dziś wieczór: maks. 5 punktów, najpierw to, co do wysłania, z czasem na każdy punkt.' },
  { label: 'Nowe zlecenie', prompt: 'Mam nowe zlecenie. Zadaj mi pytania z procesu w SKILL.md (maks. 4 naraz), potem załóż folder skryptem nowe_zadanie.js i uzupełnij ZADANIE.md.' },
  { label: 'Estymacja do wyceny', prompt: 'Zrób estymację ręcznej pracy dla zadania, nad którym ostatnio pracowaliśmy, według zasad z SKILL.md (etapy, suma godzin, kwota przy 40-50 zł/h).' }
]

export function ClaudeView() {
  const s = useStore()
  const [tab, setTab] = useState<'rozmowa' | 'historia'>('rozmowa')
  const [usage, setUsage] = useState<UsageDay[]>([])
  const [lines, setLines] = useState<Line[]>([])
  const [input, setInput] = useState('')
  const [runId, setRunId] = useState<string>()
  const [resume, setResume] = useState<string>()
  const [profileId, setProfileId] = useState(s.settings?.activeProfile ?? 'konto1')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => void api.claude.usage(14).then(setUsage), [])
  useEffect(() => {
    if (s.settings) setProfileId(s.settings.activeProfile)
  }, [s.settings?.activeProfile])
  useEffect(() =>
    api.claude.onEvent((id: string, ev: ChatEvent) => {
      if (ev.type === 'started' && ev.sessionId) setResume(ev.sessionId)
      if (ev.type === 'text') setLines((l) => [...l, { kind: 'assistant', text: ev.text }])
      if (ev.type === 'tool') setLines((l) => [...l, { kind: 'tool', text: ev.detail ?? ev.name }])
      if (ev.type === 'permission') setLines((l) => [...l, { kind: 'perm', text: ev.detail, requestId: ev.requestId }])
      if (ev.type === 'error') setLines((l) => [...l, { kind: 'error', text: ev.message }])
      if (ev.type === 'done' || ev.type === 'error') setRunId((r) => (r === id ? undefined : r))
    }), [])
  useEffect(() => endRef.current?.scrollIntoView({ block: 'end' }), [lines])

  const send = async (text: string): Promise<void> => {
    if (!text.trim() || runId) return
    setLines((l) => [...l, { kind: 'user', text }])
    setInput('')
    setRunId(await api.claude.send({ profileId, prompt: text, resume }))
  }
  const openSession = async (x: SessionSummary): Promise<void> => {
    const msgs: SessionMessage[] = await api.claude.session(x.profileId, x.sessionId)
    setLines(msgs.map((m) => ({ kind: m.role, text: m.text || (m.tools?.length ? `Narzędzia: ${m.tools.join(', ')}` : '') })))
    setResume(x.sessionId)
    setProfileId(x.profileId)
    setTab('rozmowa')
  }

  return (
    <>
      <header className="view-head">
        <div>
          <h1 className="view-title">Claude</h1>
          <p className="view-sub">Oficjalny Claude Code w folderze PROJEKTY GRAFICZNE: ten sam CLAUDE.md, skille i historia co w terminalu.</p>
        </div>
      </header>
      <div className="grid">
        <div className="span-4" style={{ display: 'grid', gap: 16 }}>
          <Panel title="Konta" note={isDemo ? <DemoTag /> : undefined} action={<button className="btn small ghost" onClick={() => void s.refreshLimits()}>Odśwież</button>}>
            {s.settings?.profiles.map((p) => {
              const l = s.limits.find((x) => x.profileId === p.id)
              const days = usage.filter((u) => u.profileId === p.id).map((u) => u.output)
              return (
                <div className="account" key={p.id}>
                  <div className="spread">
                    <span className="account-name">{p.label}</span>
                    {s.settings?.activeProfile === p.id ? <span className="pill on">w użyciu</span> : <button className="btn small" onClick={() => void s.setSettings({ activeProfile: p.id })}>Używaj</button>}
                  </div>
                  <Meter label="Okno 5 h" w={l?.fiveHour} />
                  <Meter label="Tydzień" w={l?.sevenDay} />
                  {days.length > 0 && (
                    <div>
                      <div className="small muted" style={{ marginBottom: 4 }}>Tokeny odpowiedzi, 14 dni</div>
                      <Spark values={days} label={`Tokeny dziennie, ${p.label}`} />
                    </div>
                  )}
                  <div className="row">
                    <button className="btn small" onClick={() => api.claude.login(p.id).catch((e: Error) => s.notify(e.message))}>Zaloguj w terminalu</button>
                    <button className="btn small ghost" onClick={() => api.claude.installStatusline(p.id).then(s.notify)}>Linia statusu</button>
                  </div>
                </div>
              )
            })}
          </Panel>
          <Panel title="Szybkie polecenia">
            <div style={{ display: 'grid', gap: 8 }}>
              {QUICK.map((q) => (
                <button key={q.label} className="btn" style={{ justifyContent: 'space-between' }} onClick={() => (setTab('rozmowa'), void send(q.prompt))} disabled={!!runId}>
                  {q.label}
                </button>
              ))}
            </div>
          </Panel>
        </div>

        <Panel
          className="span-8"
          title={tab === 'rozmowa' ? (resume ? 'Rozmowa (kontynuacja)' : 'Nowa rozmowa') : 'Historia obu kont'}
          action={
            <div className="row">
              <button className={`btn small${tab === 'rozmowa' ? ' primary' : ''}`} onClick={() => setTab('rozmowa')}>Rozmowa</button>
              <button className={`btn small${tab === 'historia' ? ' primary' : ''}`} onClick={() => setTab('historia')}>Historia</button>
            </div>
          }
        >
          {tab === 'historia' ? <History onOpen={openSession} /> : (
            <div className="chat">
              <div className="msgs" aria-live="polite">
                {lines.length === 0 && <Empty>Napisz, co zrobić. Claude pracuje na koncie, które wybierzesz niżej, i pyta o zgodę przed każdym zapisem pliku i poleceniem.</Empty>}
                {lines.map((l, i) =>
                  l.kind === 'perm' ? (
                    <div className="msg perm" key={i}>
                      <div className="small muted">Claude chce wykonać</div>
                      <div style={{ margin: '4px 0 8px' }}>{l.text}</div>
                      <div className="row">
                        <button className="btn small primary" onClick={() => (api.claude.answerPermission(l.requestId!, true), setLines((x) => x.map((y, k) => (k === i ? { ...y, kind: 'tool', text: `Zgoda: ${y.text}` } : y))))}>Zgoda</button>
                        <button className="btn small" onClick={() => (api.claude.answerPermission(l.requestId!, false), setLines((x) => x.map((y, k) => (k === i ? { ...y, kind: 'tool', text: `Odmowa: ${y.text}` } : y))))}>Nie</button>
                      </div>
                    </div>
                  ) : (
                    <div key={i} className={`msg ${l.kind === 'error' ? 'tool' : l.kind}`} style={l.kind === 'error' ? { color: 'var(--bad)' } : undefined}>{l.text}</div>
                  )
                )}
                <div ref={endRef} />
              </div>
              <form className="composer" onSubmit={(e) => (e.preventDefault(), void send(input))}>
                <textarea
                  id="chat-input"
                  className="textarea"
                  rows={2}
                  value={input}
                  placeholder={runId ? 'Claude pracuje...' : 'Np. przygotuj wiadomość do Izy z poprawkami okładki'}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      void send(input)
                    }
                  }}
                />
                <div style={{ display: 'grid', gap: 6, alignContent: 'start' }}>
                  <select id="chat-profile" className="select" value={profileId} onChange={(e) => setProfileId(e.target.value)} aria-label="Konto">
                    {s.settings?.profiles.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
                  {runId ? (
                    <button type="button" className="btn" onClick={() => api.claude.stop(runId)}>Zatrzymaj</button>
                  ) : (
                    <button type="submit" className="btn primary">Wyślij</button>
                  )}
                  {resume && !runId && <button type="button" className="btn small ghost" onClick={() => (setResume(undefined), setLines([]))}>Nowa rozmowa</button>}
                </div>
              </form>
            </div>
          )}
        </Panel>
      </div>
    </>
  )
}

function History({ onOpen }: { onOpen: (s: SessionSummary) => void }) {
  const s = useStore()
  const [q, setQ] = useState('')
  const [list, setList] = useState<SessionSummary[]>()
  useEffect(() => {
    const t = setTimeout(() => void api.claude.sessions(q).then(setList), 250)
    return () => clearTimeout(t)
  }, [q])
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <input id="history-q" className="input" placeholder="Szukaj w rozmowach obu kont, np. kalendarz, Retinyl, foliopak" value={q} onChange={(e) => setQ(e.target.value)} />
      {!list && <Empty>Czytam historię...</Empty>}
      {list?.length === 0 && <Empty>Nic nie znalazłem.</Empty>}
      <div className="list">
        {list?.map((x) => (
          <div className="li clickable" key={x.profileId + x.sessionId} onClick={() => onOpen(x)} style={{ padding: '10px 6px' }}>
            <div className="li-top">
              <span className="li-title">{x.title}</span>
              <span className="pill">{s.settings?.profiles.find((p) => p.id === x.profileId)?.label}</span>
            </div>
            <span className="li-sub small">{timeAgo(x.updatedAt)}, {x.messages} wiadomości{isDemo ? ', przykład' : ''}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
