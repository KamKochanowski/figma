// Zapytaj: panel rozmowy o portfolio do Framera. Łączy się z funkcją z folderu zapytaj-worker
// (adres Workera wpisujesz we właściwościach komponentu). Odpowiedzi pokazują karty prac.
import { addPropertyControls, ControlType } from "framer"
import { useState, type CSSProperties, type FormEvent } from "react"

type Card = { id: string; title: string; image?: { src: string }; link?: string }
type Msg = { role: "user" | "assistant"; content: string; ids?: string[] }

interface Props {
    endpoint: string
    greeting: string
    suggestions: string[]
    projects: Card[]
    paper: string
    ink: string
    style?: CSSProperties
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 * @framerIntrinsicWidth 380
 * @framerIntrinsicHeight 520
 */
export default function Zapytaj(props: Props) {
    const [msgs, setMsgs] = useState<Msg[]>([])
    const [input, setInput] = useState("")
    const [busy, setBusy] = useState(false)
    const [chips, setChips] = useState<string[]>(props.suggestions)

    async function ask(question: string) {
        const q = question.trim()
        if (!q || busy) return
        const history = msgs.map(({ role, content }) => ({ role, content }))
        setMsgs((m) => [...m, { role: "user", content: q }])
        setInput("")
        setBusy(true)
        try {
            const r = await fetch(props.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: q, history }) })
            const data = (await r.json()) as { answer: string; project_ids: string[]; follow_ups: string[] }
            setMsgs((m) => [...m, { role: "assistant", content: data.answer, ids: data.project_ids }])
            if (data.follow_ups?.length) setChips(data.follow_ups)
        } catch {
            setMsgs((m) => [...m, { role: "assistant", content: "Nie mogę teraz odpowiedzieć. Napisz na kam.kochanowski@gmail.com" }])
        } finally {
            setBusy(false)
        }
    }

    const card = (id: string) => props.projects.find((p) => p.id === id)
    const base: CSSProperties = { font: "13px/1.45 'Schibsted Grotesk', system-ui, sans-serif", color: props.ink }

    return (
        <div style={{ ...props.style, ...base, background: props.paper, borderRadius: 12, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "grid", gap: 10, alignContent: "start" }} aria-live="polite">
                <div>{props.greeting}</div>
                {msgs.map((m, i) =>
                    m.role === "user" ? (
                        <div key={i} style={{ justifySelf: "end", background: "rgba(0,0,0,.06)", padding: "7px 10px", borderRadius: 8, maxWidth: "85%" }}>{m.content}</div>
                    ) : (
                        <div key={i}>
                            {m.content}
                            {!!m.ids?.length && (
                                <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                                    {m.ids.map((id) => {
                                        const c = card(id)
                                        return c ? (
                                            <a key={id} href={c.link ?? "#"} style={{ width: 84, color: props.ink, textDecoration: "none", fontSize: 11, opacity: 0.85 }}>
                                                {c.image?.src && <img src={c.image.src} alt="" style={{ width: 84, height: 60, objectFit: "cover", borderRadius: 3, display: "block", marginBottom: 3 }} />}
                                                {c.title}
                                            </a>
                                        ) : null
                                    })}
                                </div>
                            )}
                        </div>
                    )
                )}
                {busy && <div style={{ opacity: 0.6 }}>Sprawdzam w case studies...</div>}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "0 14px 10px" }}>
                {chips.map((c) => (
                    <button key={c} onClick={() => ask(c)} style={{ ...base, border: "1px solid rgba(0,0,0,.15)", background: "transparent", borderRadius: 99, padding: "5px 10px", fontSize: 12, cursor: "pointer" }}>{c}</button>
                ))}
            </div>
            <form onSubmit={(e: FormEvent) => (e.preventDefault(), ask(input))} style={{ display: "flex", gap: 6, padding: 10, borderTop: "1px solid rgba(0,0,0,.1)" }}>
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Zapytaj o projekt" aria-label="Pytanie" maxLength={500} style={{ ...base, flex: 1, padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,.15)", background: "transparent" }} />
                <button type="submit" disabled={busy} style={{ ...base, background: props.ink, color: props.paper, border: 0, borderRadius: 8, padding: "8px 12px", cursor: "pointer" }}>Wyślij</button>
            </form>
        </div>
    )
}

Zapytaj.defaultProps = {
    endpoint: "https://kochdesign-zapytaj.TWOJE-KONTO.workers.dev",
    greeting: "Zapytaj o dowolny projekt. Odpowiadam na podstawie moich case studies.",
    suggestions: ["Pokaż druk i opakowania", "Jak pracujesz z AI?", "Jestem z agencji, co dowozisz?"],
    projects: [],
    paper: "#fbfbf9",
    ink: "#151618",
}

addPropertyControls(Zapytaj, {
    endpoint: { type: ControlType.String, title: "Adres Workera" },
    greeting: { type: ControlType.String, title: "Powitanie", displayTextArea: true },
    suggestions: { type: ControlType.Array, title: "Podpowiedzi", control: { type: ControlType.String } },
    projects: {
        type: ControlType.Array,
        title: "Karty prac",
        control: {
            type: ControlType.Object,
            controls: {
                id: { type: ControlType.String, title: "id (jak w wiedza.json)" },
                title: { type: ControlType.String, title: "Nazwa" },
                image: { type: ControlType.ResponsiveImage, title: "Obraz" },
                link: { type: ControlType.Link, title: "Case study" },
            },
        },
    },
    paper: { type: ControlType.Color, title: "Tło" },
    ink: { type: ControlType.Color, title: "Tekst" },
})
