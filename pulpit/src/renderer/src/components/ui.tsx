import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import type { Brand, LimitWindow } from '../../../shared/types'
import { taskInk, taskStatusLabel } from '../../../shared/status'
import { untilReset } from '../format'

export function Panel(props: { title: string; note?: ReactNode; action?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <section className={`panel ${props.className ?? ''}`} aria-label={props.title}>
      <div className="panel-head">
        <h2 className="panel-title">{props.title}</h2>
        <div className="row">
          {props.note && <span className="panel-note">{props.note}</span>}
          {props.action}
        </div>
      </div>
      {props.children}
    </section>
  )
}

export function Status({ status }: { status: string }) {
  return (
    <span className="status" data-ink={taskInk(status)}>
      <i aria-hidden="true" />
      {taskStatusLabel(status)}
    </span>
  )
}

export function Swatch({ brand, color }: { brand?: Brand; color?: string }) {
  const c = color ?? brand?.color
  return <span className="swatch" style={{ '--sw': c ?? 'var(--sheet-2)' } as CSSProperties} aria-hidden="true" />
}

export function DemoTag({ children = 'przykład' }: { children?: ReactNode }) {
  return <span className="demo-tag">{children}</span>
}

export function Meter({ label, w }: { label: string; w?: LimitWindow }) {
  const pct = w ? Math.min(100, Math.max(0, w.usedPct)) : undefined
  const level = pct === undefined ? undefined : pct >= 85 ? 'bad' : pct >= 60 ? 'warn' : 'ok'
  const word = level === 'bad' ? 'prawie koniec' : level === 'warn' ? 'połowa za Tobą' : level === 'ok' ? 'luz' : ''
  return (
    <div className="meter">
      <div className="meter-top">
        <span>
          {label} {word && <span className="muted">({word})</span>}
        </span>
        <b>{pct === undefined ? 'brak danych' : `${Math.round(pct)}%`}</b>
      </div>
      <div className="meter-track" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct ?? 0} aria-label={label}>
        <div className="meter-fill" data-level={level} style={{ width: `${pct ?? 0}%` }} />
      </div>
      {w && <div className="small muted">{untilReset(w.resetsAt)}</div>}
    </div>
  )
}

export function useToast(): [ReactNode, (msg: string) => void] {
  const [msg, setMsg] = useState<string>()
  useEffect(() => {
    if (!msg) return
    const t = setTimeout(() => setMsg(undefined), 3800)
    return () => clearTimeout(t)
  }, [msg])
  return [msg ? <div className="toast" role="status">{msg}</div> : null, setMsg]
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="empty">{children}</p>
}
