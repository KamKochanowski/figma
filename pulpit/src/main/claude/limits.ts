// Limity kont Claude (okno 5 h i tygodniowe). Trzy źródła, od najlepszego:
// 1. zdarzenia rate_limit_event z SDK podczas rozmów i pracy agentów w Pulpicie,
// 2. odświeżenie przyciskiem: oficjalne SDK pyta Claude Code o dane z komendy /usage (API oznaczone jako eksperymentalne),
// 3. plik pulpit-limity.json zapisywany przez linię statusu w terminalu (resources/statusline).
import { app } from 'electron'
import { readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ClaudeProfile, LimitWindow, Limits } from '../../shared/types'
import { envFor } from './profiles'

const file = (): string => join(app.getPath('userData'), 'limity.json')
let store: Record<string, Limits> | undefined

function load(): Record<string, Limits> {
  if (store) return store
  try {
    store = JSON.parse(readFileSync(file(), 'utf8'))
  } catch {
    store = {}
  }
  return store!
}

function save(profileId: string, patch: Partial<Limits>): void {
  const s = load()
  s[profileId] = { ...s[profileId], ...patch, profileId, updatedAt: Date.now() }
  writeFileSync(file(), JSON.stringify(s, null, 2))
}

/** SDK podaje utilization raz jako 0-1, raz jako 0-100. Sprowadzamy do procentów. */
function pct(v: number | null | undefined): number | undefined {
  if (v === null || v === undefined || Number.isNaN(v)) return undefined
  return v <= 1 ? Math.round(v * 1000) / 10 : Math.round(v * 10) / 10
}

export function fromRateLimitEvent(
  profileId: string,
  info: { rateLimitType?: string; utilization?: number; resetsAt?: number }
): void {
  const used = pct(info.utilization)
  if (used === undefined || !info.resetsAt) return
  const w: LimitWindow = { usedPct: used, resetsAt: info.resetsAt > 1e12 ? Math.round(info.resetsAt / 1000) : info.resetsAt }
  if (info.rateLimitType === 'five_hour') save(profileId, { fiveHour: w })
  else if (info.rateLimitType === 'seven_day') save(profileId, { sevenDay: w })
}

function fromStatusline(profile: ClaudeProfile): Limits | undefined {
  const f = join(profile.configDir, 'pulpit-limity.json')
  try {
    const raw = JSON.parse(readFileSync(f, 'utf8'))
    const rl = raw.rate_limits ?? {}
    const win = (w?: { used_percentage?: number; resets_at?: number }): LimitWindow | undefined =>
      w?.used_percentage !== undefined && w.resets_at ? { usedPct: w.used_percentage, resetsAt: w.resets_at } : undefined
    return {
      profileId: profile.id,
      fiveHour: win(rl.five_hour),
      sevenDay: win(rl.seven_day),
      model: raw.model?.display_name,
      contextPct: raw.context_window?.used_percentage ?? undefined,
      updatedAt: statSync(f).mtimeMs
    }
  } catch {
    return undefined
  }
}

export function getLimits(profiles: ClaudeProfile[]): Limits[] {
  const s = load()
  const now = Date.now() / 1000
  return profiles.map((p) => {
    const a = s[p.id]
    const b = fromStatusline(p)
    const best = (b?.updatedAt ?? 0) > (a?.updatedAt ?? 0) ? { ...a, ...b } : { ...b, ...a }
    // okno, które już się zresetowało, pokazujemy jako puste
    for (const k of ['fiveHour', 'sevenDay'] as const) {
      const w = best[k]
      if (w && w.resetsAt < now) best[k] = { usedPct: 0, resetsAt: w.resetsAt }
    }
    return { ...best, profileId: p.id }
  })
}

/** Odświeżenie na żądanie. Nie wysyła żadnej wiadomości do modelu, więc nie zużywa limitu. */
export async function refreshLimits(profile: ClaudeProfile, cwd: string): Promise<void> {
  const { query } = await import('@anthropic-ai/claude-agent-sdk')
  let release: () => void = () => {}
  const idle = new Promise<void>((r) => (release = r))
  async function* noInput(): AsyncGenerator<never> {
    await idle
  }
  const q = query({ prompt: noInput(), options: { cwd, env: envFor(profile), settingSources: [] } })
  try {
    const timeout = new Promise<never>((_, rej) => setTimeout(() => rej(new Error('Claude Code nie odpowiedział w 20 s')), 20000))
    const usage = await Promise.race([q.usage_EXPERIMENTAL_MAY_CHANGE_DO_NOT_RELY_ON_THIS_API_YET({ skipBehaviors: true }), timeout])
    const rl = usage.rate_limits
    const win = (w?: { utilization: number | null; resets_at: string | null } | null): LimitWindow | undefined => {
      const used = pct(w?.utilization)
      return used !== undefined && w?.resets_at ? { usedPct: used, resetsAt: Math.round(Date.parse(w.resets_at) / 1000) } : undefined
    }
    if (rl) save(profile.id, { fiveHour: win(rl.five_hour), sevenDay: win(rl.seven_day) })
  } finally {
    release()
    q.close()
  }
}
