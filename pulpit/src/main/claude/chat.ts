// Rozmowa z Claude z poziomu Pulpitu. Pod spodem działa oficjalny Claude Code (Agent SDK),
// zalogowany na wybrane konto, z folderem PROJEKTY GRAFICZNE jako katalogiem roboczym.
// Dzięki temu Claude czyta CLAUDE.md, SKILL.md i skille Kamila tak samo jak w terminalu,
// a rozmowa trafia do tej samej historii (/resume działa też w terminalu).
import { randomUUID } from 'node:crypto'
import type { ChatEvent, ChatRequest, ClaudeProfile } from '../../shared/types'
import { fromRateLimitEvent } from './limits'
import { envFor } from './profiles'

type Emit = (runId: string, ev: ChatEvent) => void

const runs = new Map<string, { abort: AbortController }>()
const pending = new Map<string, (allow: boolean) => void>()

// Narzędzia tylko do czytania przechodzą bez pytania. Zapis, polecenia i sieć zawsze pyta Kamila.
const SAFE_TOOLS = new Set(['Read', 'Glob', 'Grep', 'LS', 'TodoWrite', 'WebSearch', 'Skill', 'Task', 'Agent'])

const APPEND = [
  'Rozmawiasz przez aplikację Pulpit (panel freelancera Kamila).',
  'Odpowiadaj po polsku, najpierw werdykt, potem kroki. Bez długich myślników i bez kropek „·” jako separatorów.',
  'Zanim zmienisz pliki, powiedz krótko co i gdzie. Nic nie kasuj na stałe.'
].join(' ')

export function answerPermission(requestId: string, allow: boolean): void {
  pending.get(requestId)?.(allow)
  pending.delete(requestId)
}

export function stopRun(runId: string): void {
  runs.get(runId)?.abort.abort()
}

export interface RunOptions {
  profile: ClaudeProfile
  cwd: string
  prompt: string
  resume?: string
  /** Dla agentów w tle: lista narzędzi dozwolonych bez pytania, reszta odrzucana */
  allowOnly?: (tool: string, input: Record<string, unknown>) => boolean
  maxTurns?: number
}

/** Wspólny silnik dla czatu i agentów. Zwraca końcowy tekst odpowiedzi. */
export async function runClaude(opts: RunOptions, runId: string, emit: Emit): Promise<{ text: string; sessionId?: string }> {
  const { query } = await import('@anthropic-ai/claude-agent-sdk')
  const abort = new AbortController()
  runs.set(runId, { abort })
  let finalText = ''
  let sessionId: string | undefined
  try {
    const q = query({
      prompt: opts.prompt,
      options: {
        cwd: opts.cwd,
        resume: opts.resume,
        abortController: abort,
        env: envFor(opts.profile),
        maxTurns: opts.maxTurns,
        settingSources: ['user', 'project', 'local'],
        systemPrompt: { type: 'preset', preset: 'claude_code', append: APPEND },
        canUseTool: async (tool, input) => {
          if (opts.allowOnly) {
            return opts.allowOnly(tool, input)
              ? { behavior: 'allow', updatedInput: input }
              : { behavior: 'deny', message: 'Agent w tle nie ma zgody na to narzędzie.' }
          }
          if (SAFE_TOOLS.has(tool)) return { behavior: 'allow', updatedInput: input }
          const requestId = randomUUID()
          emit(runId, { type: 'permission', requestId, tool, detail: describe(tool, input) })
          const allow = await new Promise<boolean>((r) => pending.set(requestId, r))
          return allow ? { behavior: 'allow', updatedInput: input } : { behavior: 'deny', message: 'Kamil nie zgodził się na ten krok.' }
        }
      }
    })
    for await (const m of q) {
      switch (m.type) {
        case 'system':
          if (m.subtype === 'init') {
            sessionId = m.session_id
            emit(runId, { type: 'started', sessionId })
          }
          break
        case 'assistant':
          for (const block of m.message.content) {
            if (block.type === 'text') {
              finalText = block.text
              emit(runId, { type: 'text', text: block.text })
            } else if (block.type === 'tool_use') {
              emit(runId, { type: 'tool', name: block.name, detail: describe(block.name, block.input as Record<string, unknown>) })
            }
          }
          break
        case 'rate_limit_event':
          fromRateLimitEvent(opts.profile.id, m.rate_limit_info)
          break
        case 'result':
          sessionId = m.session_id
          if (m.subtype === 'success') finalText = m.result || finalText
          emit(runId, m.subtype === 'success'
            ? { type: 'done', sessionId, costUsd: m.total_cost_usd }
            : { type: 'error', message: `Claude przerwał pracę (${m.subtype}).` })
          break
      }
    }
  } catch (e) {
    const msg = abort.signal.aborted ? 'Zatrzymane.' : (e as Error).message
    emit(runId, { type: 'error', message: msg })
  } finally {
    runs.delete(runId)
  }
  return { text: finalText, sessionId }
}

export function startChat(req: ChatRequest, profile: ClaudeProfile, cwd: string, emit: Emit): string {
  const runId = randomUUID()
  void runClaude({ profile, cwd, prompt: req.prompt, resume: req.resume }, runId, emit)
  return runId
}

function describe(tool: string, input: Record<string, unknown>): string {
  const v = input.file_path ?? input.path ?? input.command ?? input.url ?? input.pattern ?? input.description
  return typeof v === 'string' ? `${tool}: ${v}` : tool
}
