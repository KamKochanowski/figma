import { useEffect, useState } from 'react'
import type { MailItem, MailTag } from '../../../shared/types'
import { api, isDemo } from '../api'
import { DemoTag, Empty, Panel, Swatch } from '../components/ui'
import { dayShort } from '../format'
import { useStore } from '../store'

const TABS: { id: MailTag | 'wszystko'; label: string }[] = [
  { id: 'klient', label: 'Klienci' },
  { id: 'useme', label: 'Useme' },
  { id: 'wszystko', label: 'Wszystko' }
]

export function Mail() {
  const s = useStore()
  const [items, setItems] = useState<MailItem[]>()
  const [tab, setTab] = useState<MailTag | 'wszystko'>('klient')
  const [err, setErr] = useState<string>()
  const load = (): void => void api.mail.list().then(setItems).catch((e: Error) => setErr(e.message))
  useEffect(load, [])
  const accounts = s.settings?.mail ?? []
  const shown = (items ?? []).filter((m) => tab === 'wszystko' || m.tag === tab)
  const unread = (items ?? []).filter((m) => m.unread).length

  return (
    <>
      <header className="view-head">
        <div>
          <h1 className="view-title">Poczta</h1>
          <p className="view-sub">Dwa Gmaile, tylko odczyt. Odpowiadasz w Gmailu, Pulpit pokazuje, kto pisze i do której marki to należy.</p>
        </div>
        <div className="row">
          {TABS.map((t) => <button key={t.id} className={`btn small${tab === t.id ? ' primary' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>)}
          <button className="btn small ghost" onClick={load}>Odśwież</button>
        </div>
      </header>
      <div className="grid">
        <Panel className="span-8" title={`${unread} nieprzeczytanych`} note={isDemo ? <DemoTag /> : undefined}>
          {err && <Empty>{err}</Empty>}
          {items && shown.length === 0 && <Empty>Pusto w tej zakładce.</Empty>}
          {!items && !err && <Empty>Łączę się z Gmailem...</Empty>}
          <div className="list">
            {shown.map((m) => (
              <div className="li clickable" key={`${m.accountId}-${m.uid}`} onClick={() => api.mail.open(m)} style={{ padding: '10px 6px' }}>
                <div className="li-top">
                  <span className="li-title" style={{ fontWeight: m.unread ? 700 : 500 }}>{m.subject}</span>
                  <span className="small muted">{dayShort(m.date)}</span>
                </div>
                <span className="li-sub small row" style={{ flexWrap: 'nowrap' }}>
                  {m.brandId && <Swatch brand={s.brand(m.brandId)} />}
                  {m.fromName}
                  {m.brandId && <span className="muted">, {s.brand(m.brandId)?.name}</span>}
                  <span className="muted">, {accounts.find((a) => a.id === m.accountId)?.label}</span>
                </span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="span-4" title="Jak podpiąć">
          <ol className="small" style={{ paddingLeft: 18, margin: 0, display: 'grid', gap: 6 }}>
            <li>Konto Google, Bezpieczeństwo: włącz weryfikację dwuetapową.</li>
            <li>Tam też: Hasła do aplikacji, utwórz hasło „Pulpit”.</li>
            <li>Gmail, Ustawienia, Przekazywanie i POP/IMAP: włącz IMAP.</li>
            <li>W Ustawieniach Pulpitu wklej adres i hasło aplikacji dla każdego konta.</li>
          </ol>
          <p className="small muted" style={{ marginTop: 10 }}>Hasło jest szyfrowane przez Windows i zostaje na tym komputerze. Klienta rozpoznaję po adresach z MARKA.md, Useme po domenie useme.com.</p>
        </Panel>
      </div>
    </>
  )
}
