// Wykresy rysowane ręcznie w SVG: jedna skala, cienkie słupki z zaokrągleniem tylko od góry,
// podpis wartości tylko przy bieżącym i najwyższym słupku, reszta w dymku po najechaniu.
import { useState, type CSSProperties } from 'react'
import { money, monthLabel } from '../format'

interface Tip { x: number; y: number; text: string }

function Tooltip({ tip }: { tip?: Tip }) {
  return tip ? <div className="tip" style={{ left: tip.x + 12, top: tip.y - 30 }}>{tip.text}</div> : null
}

export function MonthBars(props: { data: { month: string; amount: number; example?: boolean }[]; goal?: number; current: string }) {
  const [tip, setTip] = useState<Tip>()
  const W = 720
  const H = 220
  const pad = { l: 44, r: 8, t: 18, b: 26 }
  const max = Math.max(props.goal ?? 0, ...props.data.map((d) => d.amount), 1)
  const step = niceStep(max)
  const top = Math.ceil(max / step) * step
  const y = (v: number): number => pad.t + (H - pad.t - pad.b) * (1 - v / top)
  const bw = (W - pad.l - pad.r) / props.data.length
  const barW = Math.min(28, bw * 0.55)
  const peak = props.data.reduce((a, b) => (b.amount > a.amount ? b : a), props.data[0])
  return (
    <>
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Przychód netto w kolejnych miesiącach">
        {Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step).map((v) => (
          <g key={v}>
            <line className="grid-line" x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} />
            <text x={pad.l - 8} y={y(v) + 4} textAnchor="end">{v === 0 ? '0' : `${v / 1000} tys.`}</text>
          </g>
        ))}
        {props.goal ? (
          <g>
            <line className="goal" x1={pad.l} x2={W - pad.r} y1={y(props.goal)} y2={y(props.goal)} />
            <text x={W - pad.r} y={y(props.goal) - 6} textAnchor="end">cel {money(props.goal)}</text>
          </g>
        ) : null}
        {props.data.map((d, i) => {
          const cx = pad.l + bw * i + bw / 2
          const h = Math.max(0, y(0) - y(d.amount))
          const x = cx - barW / 2
          const r = Math.min(4, h)
          const path = h > 0 ? `M${x},${y(0)} V${y(d.amount) + r} Q${x},${y(d.amount)} ${x + r},${y(d.amount)} H${x + barW - r} Q${x + barW},${y(d.amount)} ${x + barW},${y(d.amount) + r} V${y(0)} Z` : ''
          const cls = d.month === props.current ? 'bar now' : d.example ? 'bar ex' : 'bar'
          const showVal = d.month === props.current || d === peak
          return (
            <g key={d.month}>
              {path && <path className={cls} d={path} />}
              {showVal && <text className="val" x={cx} y={y(d.amount) - 6} textAnchor="middle">{money(d.amount)}</text>}
              <text x={cx} y={H - 8} textAnchor="middle">{monthLabel(d.month)}</text>
              <rect
                className="hit"
                x={pad.l + bw * i}
                y={pad.t}
                width={bw}
                height={H - pad.t - pad.b}
                onMouseMove={(e) => setTip({ x: e.clientX, y: e.clientY, text: `${monthLabel(d.month, false)}: ${money(d.amount)}${d.example ? ' (przykład)' : ''}` })}
                onMouseLeave={() => setTip(undefined)}
              />
            </g>
          )
        })}
      </svg>
      <Tooltip tip={tip} />
    </>
  )
}

export function HBars(props: { rows: { label: string; value: number; color?: string }[]; format?: (n: number) => string }) {
  const max = Math.max(...props.rows.map((r) => r.value), 1)
  const fmt = props.format ?? money
  return (
    <div role="list">
      {props.rows.map((r) => (
        <div className="hbar" role="listitem" key={r.label}>
          <span className="hbar-name">
            {r.color && <span className="swatch" style={{ '--sw': r.color } as CSSProperties} aria-hidden="true" />}
            {r.label}
          </span>
          <div className="hbar-track">
            <div className="hbar-fill" style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
          <span className="hbar-val">{fmt(r.value)}</span>
        </div>
      ))}
    </div>
  )
}

/** Małe słupki dzienne (tokeny na konto). Bez osi, z podpisem maksimum. */
export function Spark(props: { values: number[]; label: string }) {
  const [tip, setTip] = useState<Tip>()
  const W = 280
  const H = 44
  const max = Math.max(...props.values, 1)
  const bw = W / props.values.length
  return (
    <>
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={props.label}>
        {props.values.map((v, i) => {
          const h = (v / max) * (H - 4)
          return (
            <rect
              key={i}
              className={i === props.values.length - 1 ? 'bar now' : 'bar'}
              x={i * bw + 1}
              y={H - h}
              width={bw - 2}
              height={Math.max(h, v > 0 ? 1 : 0)}
              rx={1.5}
              onMouseMove={(e) => setTip({ x: e.clientX, y: e.clientY, text: `${Math.round(v / 1000)} tys. tokenów` })}
              onMouseLeave={() => setTip(undefined)}
            />
          )
        })}
      </svg>
      <Tooltip tip={tip} />
    </>
  )
}

function niceStep(max: number): number {
  const raw = max / 4
  const p = 10 ** Math.floor(Math.log10(raw))
  return [1, 2, 2.5, 5, 10].map((m) => m * p).find((s) => s >= raw) ?? p * 10
}
