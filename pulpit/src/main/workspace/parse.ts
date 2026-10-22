// Czyste funkcje: tekst .md na dane. Bez dostępu do dysku, żeby dało się je testować
// na prawdziwych plikach Kamila (tests/fixtures).
import { parse as parseYaml } from 'yaml'
import type {
  ActiveCollab,
  Brand,
  BrandSource,
  IncomeEntry,
  LogEntry,
  Meta,
  QuoteEntry,
  Task,
  TodoItem,
  WaitingItem
} from '../../shared/types'

// Podstawy

export function splitFrontMatter(text: string): { meta: Meta; body: string } {
  const m = /^﻿?---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text)
  if (!m) return { meta: {}, body: text }
  try {
    const meta = parseYaml(m[1])
    return { meta: meta && typeof meta === 'object' ? (meta as Meta) : {}, body: text.slice(m[0].length) }
  } catch {
    return { meta: {}, body: text.slice(m[0].length) }
  }
}

/** Bez polskich znaków i wielkości liter, do porównywania kluczy i nazw */
export function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/** Wartość z YAML po jednym z możliwych kluczy (klucze porównywane bez polskich znaków) */
export function pick(meta: Meta, keys: string[]): unknown {
  const wanted = keys.map(norm)
  for (const [k, v] of Object.entries(meta)) {
    if (wanted.includes(norm(k)) && v !== null && v !== '') return v
  }
  return undefined
}

export function pickText(meta: Meta, keys: string[]): string | undefined {
  const v = pick(meta, keys)
  if (v === undefined) return undefined
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  if (Array.isArray(v)) return v.map(String).join(', ')
  if (typeof v === 'object') return undefined
  return String(v)
}

/** "1 200 zł", "350", "4 800,50 PLN" na liczbę */
export function parseAmount(raw: unknown): number | undefined {
  if (typeof raw === 'number') return raw
  if (typeof raw !== 'string') return undefined
  const m = /-?\d[\d\s ]*(?:[.,]\d{1,2})?/.exec(raw)
  if (!m) return undefined
  const n = Number(m[0].replace(/[\s ]/g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : undefined
}

/** Tabele markdown: nagłówki i wiersze, razem z numerem linii i ostatnim nagłówkiem sekcji nad tabelą */
export interface MdTable {
  headers: string[]
  rows: string[][]
  heading: string
  line: number
}

export function parseTables(md: string): MdTable[] {
  const lines = md.split(/\r?\n/)
  const tables: MdTable[] = []
  let heading = ''
  for (let i = 0; i < lines.length; i++) {
    const h = /^#{1,6}\s+(.*)$/.exec(lines[i])
    if (h) heading = h[1].trim()
    if (isRow(lines[i]) && i + 1 < lines.length && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1])) {
      const headers = cells(lines[i])
      const rows: string[][] = []
      let j = i + 2
      while (j < lines.length && isRow(lines[j])) rows.push(cells(lines[j++]))
      tables.push({ headers, rows, heading, line: i })
      i = j - 1
    }
  }
  return tables
}

function isRow(l: string): boolean {
  return /^\s*\|.*\|\s*$/.test(l)
}

function cells(l: string): string[] {
  return l
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim())
}

/** Index kolumny po pierwszym pasującym wzorcu */
function col(headers: string[], ...patterns: RegExp[]): number {
  const n = headers.map(norm)
  for (const p of patterns) {
    const i = n.findIndex((h) => p.test(h))
    if (i >= 0) return i
  }
  return -1
}

/** [tekst](link) na { text, href } */
export function mdLink(cell: string): { text: string; href?: string } {
  const m = /\[([^\]]+)\]\(([^)]+)\)/.exec(cell)
  return m ? { text: m[1], href: m[2] } : { text: stripMd(cell) }
}

export function stripMd(s: string): string {
  return s
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim()
}

const HEX = /#[0-9A-Fa-f]{6}\b/

// Daty

const MONTHS: Record<string, number> = {
  styczen: 1, stycznia: 1, luty: 2, lutego: 2, marzec: 3, marca: 3, kwiecien: 4, kwietnia: 4,
  maj: 5, maja: 5, czerwiec: 6, czerwca: 6, lipiec: 7, lipca: 7, sierpien: 8, sierpnia: 8,
  wrzesien: 9, wrzesnia: 9, pazdziernik: 10, pazdziernika: 10, listopad: 11, listopada: 11,
  grudzien: 12, grudnia: 12
}

const pad = (n: number): string => String(n).padStart(2, '0')

/** Pierwsza data w tekście: 2026-10-21, 19.10.2026, 19.10 (rok z `today`, a gdy wychodzi przyszłość, to rok wcześniej) */
export function findDate(text: string, today: Date): string | undefined {
  const iso = /(\d{4})-(\d{2})-(\d{2})/.exec(text)
  if (iso) return iso[0]
  const full = /\b(\d{1,2})\.(\d{1,2})\.(\d{4})\b/.exec(text)
  if (full) return `${full[3]}-${pad(+full[2])}-${pad(+full[1])}`
  const short = /\b(\d{1,2})\.(\d{1,2})\b(?!\.\d)/.exec(text)
  if (short) {
    const d = +short[1]
    const m = +short[2]
    if (m < 1 || m > 12 || d < 1 || d > 31) return undefined
    let y = today.getFullYear()
    if (new Date(y, m - 1, d) > today) y -= 1
    return `${y}-${pad(m)}-${pad(d)}`
  }
  return undefined
}

export function daysBetween(fromIso: string, today: Date): number {
  const [y, m, d] = fromIso.split('-').map(Number)
  const from = Date.UTC(y, m - 1, d)
  const to = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  return Math.round((to - from) / 86400000)
}

/** "Październik 2026", "2026-10", "10.2026" na "2026-10" */
export function monthKey(text: string): string | undefined {
  const iso = /(\d{4})-(\d{2})/.exec(text)
  if (iso) return `${iso[1]}-${iso[2]}`
  const dotted = /\b(\d{1,2})\.(\d{4})\b/.exec(text)
  if (dotted) return `${dotted[2]}-${pad(+dotted[1])}`
  const words = norm(text).split(' ')
  const yi = words.findIndex((w) => /^\d{4}$/.test(w))
  const mi = words.findIndex((w) => w in MONTHS)
  if (mi >= 0 && yi >= 0) return `${words[yi]}-${pad(MONTHS[words[mi]])}`
  return undefined
}

// Dopasowanie tekstu do marki

export interface BrandKey {
  id: string
  names: string[]
}

export function brandKeys(brands: Pick<Brand, 'id' | 'name'>[]): BrandKey[] {
  return brands.map((b) => {
    const names = new Set<string>([norm(b.id), norm(b.name)])
    // "ZOX (POCARDO, Keypack)" daje też "zox", "pocardo", "keypack"
    for (const part of b.name.split(/[(),]/)) if (norm(part).length > 2) names.add(norm(part))
    names.delete('agencja')
    return { id: b.id, names: [...names].filter((n) => n.length > 2) }
  })
}

export function matchBrand(text: string, keys: BrandKey[]): string | undefined {
  const t = ` ${norm(text)} `
  let best: { id: string; len: number } | undefined
  for (const k of keys)
    for (const n of k.names)
      if (t.includes(` ${n} `) && (!best || n.length > best.len)) best = { id: k.id, len: n.length }
  return best?.id
}

// MARKI.md

export interface MarkiRow {
  id: string
  name: string
  who: string
  industry: string
  status: string
  lastTask: string
  color?: string
  summary?: string
}

export function parseMarki(md: string): MarkiRow[] {
  const table = parseTables(md).find((t) => col(t.headers, /^marka$/) >= 0 && col(t.headers, /^folder$/) >= 0)
  if (!table) return []
  const h = table.headers
  const ci = {
    name: col(h, /^marka$/),
    folder: col(h, /^folder$/),
    who: col(h, /kto/),
    industry: col(h, /branza/),
    status: col(h, /^status$/),
    last: col(h, /ostatnie/)
  }
  const sections = splitSections(md, 3)
  return table.rows.map((r) => {
    const link = mdLink(r[ci.folder] ?? '')
    const id = (link.href?.split('/')[0] ?? link.text).trim()
    const name = stripMd(r[ci.name] ?? id)
    const sec = sections.find((s) => norm(s.title).startsWith(norm(name.split('(')[0])))
    return {
      id,
      name,
      who: stripMd(r[ci.who] ?? ''),
      industry: stripMd(r[ci.industry] ?? ''),
      status: norm(r[ci.status] ?? '').replace(/ /g, '_'),
      lastTask: stripMd(r[ci.last] ?? ''),
      color: sec ? HEX.exec(sec.body)?.[0] : undefined,
      summary: sec?.body.split(/\r?\n/).find((l) => l.trim() && !l.startsWith('Zadania:'))?.trim()
    }
  })
}

export function inferSource(who: string, name: string): BrandSource {
  const t = norm(`${who} ${name}`)
  if (/\buseme\b/.test(t)) return 'useme'
  if (/\bagencj/.test(t)) return 'agencja'
  if (/bezposrednio/.test(t)) return 'bezposrednio'
  return 'inne'
}

function splitSections(md: string, level: number): { title: string; body: string; line: number }[] {
  const lines = md.split(/\r?\n/)
  const re = new RegExp(`^#{${level}}\\s+(.*)$`)
  const out: { title: string; body: string; line: number }[] = []
  let cur: { title: string; body: string[]; line: number } | undefined
  for (let i = 0; i < lines.length; i++) {
    const m = re.exec(lines[i])
    const higher = /^(#+)\s/.exec(lines[i])
    if (m) {
      if (cur) out.push({ ...cur, body: cur.body.join('\n') })
      cur = { title: m[1].trim(), body: [], line: i }
    } else if (higher && higher[1].length < level) {
      if (cur) out.push({ ...cur, body: cur.body.join('\n') })
      cur = undefined
    } else if (cur) cur.body.push(lines[i])
  }
  if (cur) out.push({ ...cur, body: cur.body.join('\n') })
  return out
}

// AKTUALNE_WSPOLPRACE.md

export interface AktualneData {
  lastUpdate?: string
  todos: TodoItem[]
  active: ActiveCollab[]
  waiting: WaitingItem[]
  inquiries: WaitingItem[]
  log: LogEntry[]
}

export function parseAktualne(md: string, today: Date, keys: BrandKey[] = []): AktualneData {
  const lines = md.split(/\r?\n/)
  const data: AktualneData = { todos: [], active: [], waiting: [], inquiries: [], log: [] }
  const upd = /Ostatnia aktualizacja:\s*\**([\d.]+)/.exec(md)
  if (upd) data.lastUpdate = findDate(upd[1], today)

  let section = ''
  let activeCur: ActiveCollab | undefined
  let logDate = data.lastUpdate ?? ''
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i]
    const h2 = /^##\s+(.*)$/.exec(l)
    if (h2) {
      section = norm(h2[1])
      activeCur = undefined
      continue
    }
    const todo = /^\s*-\s+\[( |x|X)\]\s+(.*)$/.exec(l)
    if (todo) {
      const text = todo[2]
      const label = /^\*\*(.+?):?\*\*:?\s*/.exec(text)
      const labelText = label?.[1].replace(/:$/, '')
      data.todos.push({
        id: `L${i}`,
        line: i,
        done: todo[1] !== ' ',
        text: stripMd(label ? text.slice(label[0].length) : text),
        label: labelText,
        brandId: matchBrand(labelText ?? text, keys),
        section: section || 'na gorze'
      })
      continue
    }
    if (section.includes('w trakcie')) {
      const h3 = /^###\s+(.*)$/.exec(l)
      if (h3) {
        activeCur = { title: h3[1].trim(), brandId: matchBrand(h3[1], keys), lines: [] }
        data.active.push(activeCur)
      } else if (activeCur && /^\s*-\s+/.test(l)) {
        const kv = /^\s*-\s+\*\*(.+?):?\*\*:?\s*(.*)$/.exec(l)
        activeCur.lines.push(kv ? { key: kv[1].replace(/:$/, ''), text: stripMd(kv[2]) } : { text: stripMd(l.replace(/^\s*-\s+/, '')) })
      }
      continue
    }
    if (section.includes('dziennik') || i < 15) {
      const dateLine = /^\*\*([\d.]+)\*\*\s*$/.exec(l.trim())
      if (dateLine) {
        logDate = findDate(dateLine[1], today) ?? logDate
        continue
      }
      const entry = /^\s*-\s+(.*)$/.exec(l)
      if (entry && section.includes('dziennik')) {
        const inline = /^(\d{4}-\d{2}-\d{2}):\s*(.*)$/.exec(entry[1])
        data.log.push(inline ? { date: inline[1], text: stripMd(inline[2]) } : { date: logDate, text: stripMd(entry[1]) })
      } else if (entry && !section) {
        data.log.push({ date: logDate, text: stripMd(entry[1]) })
      }
    }
  }

  for (const t of parseTables(md)) {
    const hn = norm(t.heading)
    const target = hn.includes('czekam') ? data.waiting : hn.includes('zapytania') || hn.includes('rekrutacj') ? data.inquiries : undefined
    if (!target) continue
    const ci = { client: col(t.headers, /klient/), folder: col(t.headers, /folder/), what: col(t.headers, /czekam|status/) }
    for (const r of t.rows) {
      const waitingFor = stripMd(r[ci.what] ?? '')
      const since = findDate(waitingFor, today)
      const client = stripMd(r[ci.client] ?? '')
      const folder = stripMd(r[ci.folder] ?? '')
      target.push({
        client,
        folder,
        waitingFor,
        since,
        daysSilent: since ? daysBetween(since, today) : undefined,
        brandId: matchBrand(`${folder.split(/[ /]/)[0]} ${client}`, keys)
      })
    }
  }
  data.log.sort((a, b) => b.date.localeCompare(a.date))
  return data
}

/** Odhacza albo przywraca zadanie w linii `line`. Zwraca nowy tekst albo null, gdy linia się nie zgadza. */
export function toggleTodoLine(md: string, line: number, expectedText?: string): string | null {
  const nl = md.includes('\r\n') ? '\r\n' : '\n'
  const lines = md.split(/\r?\n/)
  const l = lines[line]
  if (l === undefined) return null
  const m = /^(\s*-\s+\[)( |x|X)(\]\s+)(.*)$/.exec(l)
  if (!m) return null
  if (expectedText && !stripMd(m[4]).includes(expectedText.slice(0, 20))) return null
  lines[line] = `${m[1]}${m[2] === ' ' ? 'x' : ' '}${m[3]}${m[4]}`
  return lines.join(nl)
}

// MARKA.md, ZADANIE.md

export function brandFromFile(id: string, folder: string, text: string, row?: MarkiRow): Brand {
  const { meta, body } = splitFrontMatter(text)
  const name = pickText(meta, ['nazwa', 'marka', 'name']) ?? row?.name ?? id.replace(/_/g, ' ')
  const who = pickText(meta, ['kontakt', 'kto', 'osoba']) ?? row?.who ?? ''
  const colorRaw = pickText(meta, ['kolor', 'kolory', 'kolor_marki', 'color'])
  const sourceRaw = pickText(meta, ['zrodlo', 'skad', 'kanal', 'platforma'])
  return {
    id,
    name,
    folder,
    status: (pickText(meta, ['status']) ?? row?.status ?? 'aktywna').trim(),
    who,
    source: inferSource(`${sourceRaw ?? ''} ${who} ${row?.who ?? ''}`, name),
    industry: pickText(meta, ['branza', 'branża', 'kategoria']) ?? row?.industry ?? '',
    lastTask: row?.lastTask ?? pickText(meta, ['ostatnie_zadanie']) ?? '',
    color: (colorRaw && HEX.exec(colorRaw)?.[0]) ?? row?.color ?? HEX.exec(body)?.[0],
    rate: pickText(meta, ['stawka', 'cennik', 'rate']),
    summary: row?.summary,
    meta
  }
}

export function taskFromFile(brandId: string, dirName: string, folder: string, text: string, mtime?: Date): Task {
  const { meta } = splitFrontMatter(text)
  const num = /^ZAD_(\d+)/i.exec(dirName)
  const fallbackTitle = dirName.replace(/^ZAD_\d+_?/i, '').replace(/_/g, ' ')
  return {
    id: `${brandId}/${dirName}`,
    brandId,
    number: num ? Number(num[1]) : 0,
    title: pickText(meta, ['nazwa', 'tytul', 'tytuł', 'zadanie', 'title']) ?? fallbackTitle,
    folder,
    status: (pickText(meta, ['status']) ?? 'w_trakcie').trim(),
    deadline: pickText(meta, ['termin', 'deadline', 'oddanie', 'na_kiedy']),
    amount: parseAmount(pick(meta, ['kwota', 'cena', 'wycena', 'amount'])),
    estimate: pickText(meta, ['estymacja', 'estymacja_h', 'godziny', 'czas']),
    updatedAt: pickText(meta, ['aktualizacja', 'zmienione', 'updated']) ?? mtime?.toISOString().slice(0, 10),
    meta
  }
}

/** Zmienia `status:` w nagłówku YAML, nie ruszając reszty pliku. Gdy nagłówka nie ma, dokłada go. */
export function setFrontMatterValue(text: string, key: string, value: string): string {
  const fm = /^(﻿?---\r?\n)([\s\S]*?)(\r?\n---)/.exec(text)
  const nl = text.includes('\r\n') ? '\r\n' : '\n'
  if (!fm) return `---${nl}${key}: ${value}${nl}---${nl}${text}`
  const re = new RegExp(`^(${key}\\s*:).*$`, 'm')
  const body = re.test(fm[2]) ? fm[2].replace(re, `$1 ${value}`) : `${fm[2]}${nl}${key}: ${value}`
  return fm[1] + body + fm[3] + text.slice(fm[0].length)
}

// ZAROBKI.md, WYCENY.md

export function parseIncome(md: string, keys: BrandKey[] = []): IncomeEntry[] {
  const out: IncomeEntry[] = []
  for (const t of parseTables(md)) {
    const h = t.headers
    const ci = {
      amount: col(h, /kwot/, /\bpln\b|\bzl\b/, /netto/),
      client: col(h, /klient|marka/),
      task: col(h, /zlecenie|zadanie|opis/),
      date: col(h, /^data|dzien|miesiac/),
      paid: col(h, /platnosc|zaplacone|oplacone|status/),
      source: col(h, /zrodlo|kanal|forma/)
    }
    if (ci.amount < 0 || ci.client < 0) continue
    for (const r of t.rows) {
      const client = stripMd(r[ci.client] ?? '')
      if (!client || /^(suma|razem|lacznie)/.test(norm(client))) continue
      const amount = parseAmount(r[ci.amount])
      if (amount === undefined) continue
      const dateCell = ci.date >= 0 ? stripMd(r[ci.date] ?? '') : ''
      const month = monthKey(dateCell) ?? monthKey(t.heading)
      if (!month) continue
      const task = ci.task >= 0 ? stripMd(r[ci.task] ?? '') : undefined
      out.push({
        month,
        date: /\d{4}-\d{2}-\d{2}/.exec(dateCell)?.[0],
        client,
        task,
        amount,
        paid: ci.paid >= 0 ? stripMd(r[ci.paid] ?? '') : undefined,
        source: ci.source >= 0 ? stripMd(r[ci.source] ?? '') : undefined,
        brandId: matchBrand(client, keys)
      })
    }
  }
  return out
}

export function parseQuotes(md: string, keys: BrandKey[] = []): QuoteEntry[] {
  const out: QuoteEntry[] = []
  for (const t of parseTables(md)) {
    const h = t.headers
    const ci = {
      id: col(h, /^id$|^nr$/),
      date: col(h, /^data/),
      client: col(h, /marka|klient/),
      task: col(h, /zadanie|zlecenie|opis/),
      hours: col(h, /godzin|estymacja|^h$|czas/),
      amount: col(h, /kwot/, /cena/, /\bpln\b|\bzl\b/)
    }
    if (ci.client < 0 || ci.task < 0) continue
    for (const r of t.rows) {
      const raw: Record<string, string> = {}
      h.forEach((name, i) => (raw[name] = r[i] ?? ''))
      const client = stripMd(r[ci.client] ?? '')
      if (!client) continue
      out.push({
        id: ci.id >= 0 ? stripMd(r[ci.id] ?? '') : `${out.length + 1}`,
        date: ci.date >= 0 ? stripMd(r[ci.date] ?? '') : undefined,
        client,
        task: stripMd(r[ci.task] ?? ''),
        hours: ci.hours >= 0 ? stripMd(r[ci.hours] ?? '') : undefined,
        amount: ci.amount >= 0 ? parseAmount(r[ci.amount]) : undefined,
        brandId: matchBrand(client, keys),
        raw
      })
    }
  }
  return out
}
