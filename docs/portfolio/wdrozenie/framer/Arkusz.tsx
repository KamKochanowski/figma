// Arkusz: komponent kodu do Framera (Assets, Code, New code file, wklej całość).
// Prace leżą na arkuszu drukarskim ze znacznikami cięcia i paskiem kontrolnym.
// Przeciąganie przesuwa, kółko i gest przybliżają, lupa pokazuje detal, klik prowadzi do case study.
// Na telefonie (szerokość poniżej 700 px) pokazuje zwykłą listę prac.
import { addPropertyControls, ControlType } from "framer"
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent, type ReactElement } from "react"

type Project = { title: string; client: string; image?: { src: string; alt?: string }; link?: string }

interface Props {
    projects: Project[]
    name: string
    tagline: string
    slug: string
    columns: number
    brandColors: string[]
    loupe: boolean
    tableColor: string
    paperColor: string
    inkColor: string
    style?: CSSProperties
}

const TW = 280, TH = 198, G = 26, ML = 90, MT = 190, MB = 120

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 800
 */
export default function Arkusz(props: Props) {
    const { projects, columns, name, tagline, slug, brandColors, tableColor, paperColor, inkColor } = props
    const rows = Math.max(1, Math.ceil(projects.length / columns))
    const W = ML * 2 + columns * TW + (columns - 1) * G
    const H = MT + rows * TH + (rows - 1) * G + MB

    const box = useRef<HTMLDivElement>(null)
    const [size, setSize] = useState({ w: 1200, h: 800 })
    const [view, setView] = useState({ s: 0.5, x: 0, y: 0 })
    const [lens, setLens] = useState<{ x: number; y: number } | null>(null)
    const drag = useRef<{ x: number; y: number; moved: number } | null>(null)
    const narrow = size.w < 700

    const fit = useCallback(() => {
        const s = Math.min((size.w - 80) / W, (size.h - 80) / H)
        setView({ s, x: (size.w - W * s) / 2, y: (size.h - H * s) / 2 })
    }, [size, W, H])

    useEffect(() => {
        const el = box.current
        if (!el) return
        const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }))
        ro.observe(el)
        return () => ro.disconnect()
    }, [narrow])
    useEffect(fit, [fit])

    const zoomAt = (f: number, cx: number, cy: number) =>
        setView((v) => {
            const s = Math.min(4, Math.max(0.15, v.s * f))
            return { s, x: cx - (cx - v.x) * (s / v.s), y: cy - (cy - v.y) * (s / v.s) }
        })

    // Kółko myszy przybliża arkusz zamiast przewijać stronę
    useEffect(() => {
        const el = box.current
        if (!el || narrow) return
        const onWheel = (e: WheelEvent) => {
            e.preventDefault()
            const r = el.getBoundingClientRect()
            zoomAt(Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0018)), e.clientX - r.left, e.clientY - r.top)
        }
        el.addEventListener("wheel", onWheel, { passive: false })
        return () => el.removeEventListener("wheel", onWheel)
    }, [narrow])

    const sheet = useMemo(
        () => (
            <SheetContent
                projects={projects} columns={columns} W={W} H={H} name={name} tagline={tagline} slug={slug}
                brandColors={brandColors} paper={paperColor} ink={inkColor}
            />
        ),
        [projects, columns, W, H, name, tagline, slug, brandColors, paperColor, inkColor]
    )

    // Ramka z ref zostaje zawsze, żeby pomiar szerokości działał też w trybie listy
    if (narrow)
        return (
            <div ref={box} style={{ ...props.style, position: "relative" }}>
                <ProjectList projects={projects} ink={inkColor} paper={paperColor} style={{ position: "absolute", inset: 0 }} />
            </div>
        )

    const local = (e: PointerEvent) => {
        const r = box.current!.getBoundingClientRect()
        return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const k = Math.max(view.s * 2.6, 0.9)
    const R = 95

    return (
        <div
            ref={box}
            style={{ ...props.style, position: "relative", overflow: "hidden", background: tableColor, touchAction: "none", cursor: drag.current ? "grabbing" : "grab" }}
            onPointerDown={(e) => {
                ;e.currentTarget.setPointerCapture(e.pointerId)
                drag.current = { ...local(e), moved: 0 }
            }}
            onPointerMove={(e) => {
                const p = local(e)
                if (drag.current) {
                    const dx = p.x - drag.current.x, dy = p.y - drag.current.y
                    drag.current = { x: p.x, y: p.y, moved: drag.current.moved + Math.abs(dx) + Math.abs(dy) }
                    setView((v) => ({ ...v, x: v.x + dx, y: v.y + dy }))
                    setLens(null)
                } else if (props.loupe && e.pointerType === "mouse") {
                    const sx = (p.x - view.x) / view.s, sy = (p.y - view.y) / view.s
                    setLens(sx >= 0 && sy >= 0 && sx <= W && sy <= H ? p : null)
                }
            }}
            onPointerUp={(e) => {
                const moved = drag.current?.moved ?? 0
                drag.current = null
                if (moved > 6) return
                const p = local(e)
                const sx = (p.x - view.x) / view.s, sy = (p.y - view.y) / view.s
                const i = hitTile(sx, sy, columns, projects.length)
                const link = i >= 0 ? projects[i].link : undefined
                if (link) window.location.href = link
            }}
            onPointerLeave={() => setLens(null)}
        >
            <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: `translate(${view.x}px,${view.y}px) scale(${view.s})`, boxShadow: "0 18px 40px -12px rgba(0,0,0,.35)" }}>
                {sheet}
            </div>
            {lens && (
                <div style={{ position: "absolute", left: lens.x - R, top: lens.y - R, width: R * 2, height: R * 2, borderRadius: "50%", overflow: "hidden", pointerEvents: "none", boxShadow: `0 0 0 2px ${inkColor}, 0 0 0 5px rgba(255,255,255,.85), 0 14px 30px -8px rgba(0,0,0,.5)`, background: paperColor }}>
                    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: `translate(${R - ((lens.x - view.x) / view.s) * k}px,${R - ((lens.y - view.y) / view.s) * k}px) scale(${k})` }}>
                        {sheet}
                    </div>
                </div>
            )}
            <div style={{ position: "absolute", left: 12, bottom: 12, display: "flex", gap: 4 }}>
                {[["-", () => zoomAt(1 / 1.3, size.w / 2, size.h / 2)], ["Cały arkusz", fit], ["+", () => zoomAt(1.3, size.w / 2, size.h / 2)]].map(([label, fn]) => (
                    <button key={label as string} onPointerDown={(e) => e.stopPropagation()} onClick={fn as () => void} style={btn(paperColor, inkColor)}>{label as string}</button>
                ))}
            </div>
        </div>
    )
}

function hitTile(sx: number, sy: number, columns: number, count: number): number {
    const c = Math.floor((sx - ML) / (TW + G)), r = Math.floor((sy - MT) / (TH + G))
    if (c < 0 || c >= columns || r < 0) return -1
    const inX = (sx - ML) - c * (TW + G) <= TW, inY = (sy - MT) - r * (TH + G) <= TH
    const i = r * columns + c
    return inX && inY && i < count ? i : -1
}

function SheetContent(p: { projects: Project[]; columns: number; W: number; H: number; name: string; tagline: string; slug: string; brandColors: string[]; paper: string; ink: string }) {
    const crop: CSSProperties = { position: "absolute", background: p.ink }
    const marks: ReactElement[] = []
    p.projects.forEach((_, i) => {
        const x = ML + (i % p.columns) * (TW + G), y = MT + Math.floor(i / p.columns) * (TH + G)
        const L = 12, o = 5
        ;([[x, y, -1, -1], [x + TW, y, 1, -1], [x, y + TH, -1, 1], [x + TW, y + TH, 1, 1]] as const).forEach(([cx, cy, sx, sy], j) => {
            marks.push(<i key={`h${i}${j}`} style={{ ...crop, left: sx < 0 ? cx - o - L : cx + o, top: cy - 0.4, width: L, height: 0.8 }} />)
            marks.push(<i key={`v${i}${j}`} style={{ ...crop, left: cx - 0.4, top: sy < 0 ? cy - o - L : cy + o, width: 0.8, height: L }} />)
        })
    })
    const reg = (x: number, y: number) => (
        <svg key={`${x}-${y}`} width={26} height={26} viewBox="0 0 26 26" style={{ position: "absolute", left: x - 13, top: y - 13 }}>
            <circle cx={13} cy={13} r={7} fill="none" stroke={p.ink} strokeWidth={0.8} />
            <circle cx={13} cy={13} r={3.2} fill={p.ink} />
            <path d="M13 0v26M0 13h26" stroke={p.ink} strokeWidth={0.8} />
        </svg>
    )
    return (
        <div style={{ position: "absolute", inset: 0, background: p.paper, color: p.ink, overflow: "hidden", fontFamily: "'Schibsted Grotesk', system-ui, sans-serif" }}>
            <div style={{ position: "absolute", left: ML, top: 22, fontSize: 10, letterSpacing: "0.06em", whiteSpace: "nowrap", opacity: 0.75 }}>{p.slug}</div>
            <div style={{ position: "absolute", left: ML, top: 56, display: "flex", alignItems: "flex-end", gap: 28 }}>
                <div style={{ fontFamily: "'Bodoni Moda', Didot, Georgia, serif", fontSize: 64, lineHeight: 0.9, letterSpacing: "-0.02em" }}>{p.name}</div>
                <div style={{ maxWidth: 470, fontSize: 15, lineHeight: 1.4, opacity: 0.75, marginBottom: 6 }}>{p.tagline}</div>
            </div>
            {[reg(p.W / 2, 34), reg(p.W / 2, p.H - 34), reg(34, p.H / 2), reg(p.W - 34, p.H / 2)]}
            <div style={{ position: "absolute", left: ML, top: p.H - 72, display: "flex", gap: 2, height: 22 }}>
                {["#00a0e0", "#e6007e", "#ffe100", "#1a1a1a", ...p.brandColors].map((c, i) => <i key={i} style={{ width: 30, height: "100%", background: c }} />)}
            </div>
            {p.projects.map((pr, i) => {
                const x = ML + (i % p.columns) * (TW + G), y = MT + Math.floor(i / p.columns) * (TH + G)
                return (
                    <div key={i} style={{ position: "absolute", left: x, top: y, width: TW, height: TH, background: "#fff" }}>
                        <span style={{ position: "absolute", left: 18, top: -15, fontSize: 10, whiteSpace: "nowrap", opacity: 0.75 }}>{String(i + 1).padStart(2, "0")} {pr.title}</span>
                        {pr.image?.src && <img src={pr.image.src} alt={pr.image.alt ?? pr.title} draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
                    </div>
                )
            })}
            {marks}
        </div>
    )
}

function ProjectList(p: { projects: Project[]; ink: string; paper: string; style?: CSSProperties }) {
    return (
        <div style={{ ...p.style, overflowY: "auto", display: "grid", gap: 2, alignContent: "start" }}>
            {p.projects.map((pr, i) => (
                <a key={i} href={pr.link ?? "#"} style={{ display: "grid", gridTemplateColumns: "28px 84px 1fr", gap: 12, alignItems: "center", padding: "10px 12px", background: p.paper, color: p.ink, textDecoration: "none", borderRadius: 6 }}>
                    <span style={{ fontFamily: "'Bodoni Moda', Georgia, serif", fontSize: 18, opacity: 0.6 }}>{String(i + 1).padStart(2, "0")}</span>
                    {pr.image?.src ? <img src={pr.image.src} alt="" style={{ width: 84, height: 60, objectFit: "cover", borderRadius: 3 }} /> : <span />}
                    <span><b>{pr.title}</b><br /><span style={{ opacity: 0.7, fontSize: 13 }}>{pr.client}</span></span>
                </a>
            ))}
        </div>
    )
}

const btn = (paper: string, ink: string): CSSProperties => ({ background: paper, color: ink, border: 0, borderRadius: 8, padding: "8px 11px", font: "13px 'Schibsted Grotesk', system-ui, sans-serif", cursor: "pointer" })

Arkusz.defaultProps = {
    projects: [],
    name: "Kamil Kochanowski",
    tagline: "Art director i senior grafik. Kampanie, opakowania i motion, od pomysłu do pliku w drukarni.",
    slug: "KOCHANOWSKI_PORTFOLIO_2026.pdf   arkusz 1/1   4/4 CMYK   FOGRA39   kochdesign.pl",
    columns: 5,
    brandColors: ["#F8B002", "#E31C25", "#EA5422", "#3D2617", "#0585FF"],
    loupe: true,
    tableColor: "#cfd1ce",
    paperColor: "#fbfbf9",
    inkColor: "#151618",
}

addPropertyControls(Arkusz, {
    projects: {
        type: ControlType.Array,
        title: "Prace",
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Nazwa" },
                client: { type: ControlType.String, title: "Klient" },
                image: { type: ControlType.ResponsiveImage, title: "Obraz" },
                link: { type: ControlType.Link, title: "Case study" },
            },
        },
    },
    name: { type: ControlType.String, title: "Nazwisko" },
    tagline: { type: ControlType.String, title: "Linia", displayTextArea: true },
    slug: { type: ControlType.String, title: "Metryczka" },
    columns: { type: ControlType.Number, title: "Kolumny", min: 2, max: 8, step: 1 },
    brandColors: { type: ControlType.Array, title: "Kolory marek", control: { type: ControlType.Color } },
    loupe: { type: ControlType.Boolean, title: "Lupa" },
    tableColor: { type: ControlType.Color, title: "Stół" },
    paperColor: { type: ControlType.Color, title: "Papier" },
    inkColor: { type: ControlType.Color, title: "Farba" },
})
