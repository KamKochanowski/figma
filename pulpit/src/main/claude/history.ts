// Historia rozmów Claude Code z obu kont: pliki <configDir>/projects/<projekt>/<sesja>.jsonl.
// Czytamy je strumieniowo, bez wysyłania czegokolwiek w sieć.
import { createReadStream } from 'node:fs'
import { readdir, stat } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { createInterface } from 'node:readline'
import type { ClaudeProfile, SessionMessage, SessionSummary, UsageDay } from '../../shared/types'

interface Line {
  type?: string
  sessionId?: string
  cwd?: string
  timestamp?: string
  isMeta?: boolean
  summary?: string
  customTitle?: string
  message?: {
    id?: string
    role?: string
    model?: string
    content?: string | { type: string; text?: string; name?: string }[]
    usage?: { input_tokens?: number; output_tokens?: number; cache_read_input_tokens?: number; cache_creation_input_tokens?: number }
  }
}

async function* lines(file: string): AsyncGenerator<Line> {
  const rl = createInterface({ input: createReadStream(file, 'utf8'), crlfDelay: Infinity })
  for await (const raw of rl) {
    if (!raw.trim()) continue
    try {
      yield JSON.parse(raw) as Line
    } catch {
      // urwana ostatnia linia w trakcie zapisu, pomijamy
    }
  }
}

function textOf(l: Line): { text: string; tools: string[] } {
  const c = l.message?.content
  if (typeof c === 'string') return { text: clean(c), tools: [] }
  if (!Array.isArray(c)) return { text: '', tools: [] }
  const text = c.filter((b) => b.type === 'text' && b.text).map((b) => clean(b.text!)).join('\n')
  const tools = c.filter((b) => b.type === 'tool_use' && b.name).map((b) => b.name!)
  return { text, tools }
}

function clean(s: string): string {
  return s
    .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, '')
    .replace(/<command-[a-z-]+>[\s\S]*?<\/command-[a-z-]+>/g, '')
    .replace(/<local-command-stdout>[\s\S]*?<\/local-command-stdout>/g, '')
    .trim()
}

async function sessionFiles(profile: ClaudeProfile): Promise<{ file: string; project: string; mtime: number }[]> {
  const root = join(profile.configDir, 'projects')
  const out: { file: string; project: string; mtime: number }[] = []
  for (const project of await readdir(root).catch(() => [] as string[])) {
    const dir = join(root, project)
    for (const f of await readdir(dir).catch(() => [] as string[])) {
      if (!f.endsWith('.jsonl')) continue
      const s = await stat(join(dir, f)).catch(() => undefined)
      if (s) out.push({ file: join(dir, f), project, mtime: s.mtimeMs })
    }
  }
  return out.sort((a, b) => b.mtime - a.mtime)
}

export async function listSessions(profiles: ClaudeProfile[], query = '', limit = 120): Promise<SessionSummary[]> {
  const q = query.toLowerCase()
  const all: SessionSummary[] = []
  for (const p of profiles) {
    for (const { file, project } of (await sessionFiles(p)).slice(0, limit)) {
      const s: SessionSummary = {
        profileId: p.id,
        sessionId: basename(file, '.jsonl'),
        project,
        title: '',
        startedAt: '',
        updatedAt: '',
        messages: 0,
        outputTokens: 0,
        file
      }
      let firstUser = ''
      let haystack = ''
      for await (const l of lines(file)) {
        if (l.type === 'summary' && l.summary) s.title = l.summary
        if (l.customTitle) s.title = l.customTitle
        if (l.cwd) s.cwd = l.cwd
        if (l.timestamp) {
          s.startedAt ||= l.timestamp
          s.updatedAt = l.timestamp
        }
        if ((l.type === 'user' || l.type === 'assistant') && !l.isMeta) {
          const { text } = textOf(l)
          if (!text) continue
          s.messages++
          if (l.type === 'user' && !firstUser) firstUser = text
          if (q && haystack.length < 200_000) haystack += ` ${text.toLowerCase()}`
        }
        if (l.type === 'assistant') {
          s.model = l.message?.model ?? s.model
          s.outputTokens += l.message?.usage?.output_tokens ?? 0
        }
      }
      s.title ||= firstUser.slice(0, 120) || '(bez treści)'
      if (s.messages === 0) continue
      if (q && !s.title.toLowerCase().includes(q) && !haystack.includes(q)) continue
      all.push(s)
    }
  }
  return all.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export async function readSession(profile: ClaudeProfile, sessionId: string): Promise<SessionMessage[]> {
  const hit = (await sessionFiles(profile)).find((f) => basename(f.file, '.jsonl') === sessionId)
  if (!hit) return []
  const out: SessionMessage[] = []
  for await (const l of lines(hit.file)) {
    if ((l.type !== 'user' && l.type !== 'assistant') || l.isMeta) continue
    const { text, tools } = textOf(l)
    if (!text && !tools.length) continue
    const prev = out[out.length - 1]
    // Claude zapisuje jedną odpowiedź w kilku liniach, sklejamy je
    if (prev && prev.role === 'assistant' && l.type === 'assistant') {
      if (text) prev.text = prev.text ? `${prev.text}\n\n${text}` : text
      prev.tools = [...(prev.tools ?? []), ...tools]
      continue
    }
    out.push({ role: l.type, text, at: l.timestamp, tools })
  }
  return out
}

/** Tokeny dziennie na konto, z odrzuceniem powtórzeń tej samej odpowiedzi (jak ccusage) */
export async function usageByDay(profiles: ClaudeProfile[], days: number): Promise<UsageDay[]> {
  const since = Date.now() - days * 86400000
  const map = new Map<string, UsageDay>()
  for (const p of profiles) {
    const seen = new Set<string>()
    for (const { file, mtime } of await sessionFiles(p)) {
      if (mtime < since) break
      for await (const l of lines(file)) {
        const u = l.message?.usage
        if (l.type !== 'assistant' || !u || !l.timestamp) continue
        if (Date.parse(l.timestamp) < since) continue
        const key = l.message?.id
        if (key) {
          if (seen.has(key)) continue
          seen.add(key)
        }
        const day = l.timestamp.slice(0, 10)
        const k = `${p.id}|${day}`
        const d = map.get(k) ?? { day, profileId: p.id, input: 0, output: 0, cacheRead: 0, cacheWrite: 0 }
        d.input += u.input_tokens ?? 0
        d.output += u.output_tokens ?? 0
        d.cacheRead += u.cache_read_input_tokens ?? 0
        d.cacheWrite += u.cache_creation_input_tokens ?? 0
        map.set(k, d)
      }
    }
  }
  return [...map.values()].sort((a, b) => a.day.localeCompare(b.day))
}
