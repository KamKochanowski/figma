// Agenci w tle. Każdy agent to plik .md: nagłówek YAML (nazwa, harmonogram, konto, gdzie wolno pisać)
// i treść polecenia. Wbudowani agenci są w resources/agents, a Kamil może dodać własnych
// albo nadpisać wbudowanych w PROJEKTY GRAFICZNE/_SYSTEM/PULPIT/agenci.
import { Notification } from 'electron'
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import cron, { type ScheduledTask } from 'node-cron'
import type { AgentDef, AgentRun, ClaudeProfile } from '../../shared/types'
import { runClaude } from '../claude/chat'
import { pickText, splitFrontMatter } from '../workspace/parse'

interface AgentFile extends AgentDef {
  prompt: string
  /** Ścieżki (względem PROJEKTY GRAFICZNE), w których agent może zapisywać */
  writeTo: string[]
}

const READ_TOOLS = new Set(['Read', 'Glob', 'Grep', 'LS', 'TodoWrite', 'Skill'])

export class AgentRunner {
  private agents = new Map<string, AgentFile>()
  private tasks = new Map<string, ScheduledTask>()
  private state: Record<string, { enabled?: boolean; lastRun?: AgentRun }> = {}

  constructor(
    private builtinDir: string,
    private root: () => string,
    private profileFor: (id?: string) => ClaudeProfile,
    private stateFile: string,
    private onFinished: (id: string, run: AgentRun) => void
  ) {
    try {
      this.state = JSON.parse(readFileSync(stateFile, 'utf8'))
    } catch {
      this.state = {}
    }
  }

  load(): void {
    this.agents.clear()
    const userDir = join(this.root(), '_SYSTEM', 'PULPIT', 'agenci')
    for (const dir of [this.builtinDir, userDir]) {
      if (!existsSync(dir)) continue
      for (const f of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
        const { meta, body } = splitFrontMatter(readFileSync(join(dir, f), 'utf8'))
        const id = f.replace(/\.md$/, '')
        this.agents.set(id, {
          id,
          name: pickText(meta, ['nazwa', 'name']) ?? id,
          description: pickText(meta, ['opis', 'description']) ?? '',
          schedule: pickText(meta, ['harmonogram', 'schedule']),
          profileId: pickText(meta, ['konto', 'profile']),
          enabled: this.state[id]?.enabled ?? pickText(meta, ['wlaczony', 'enabled']) !== 'false',
          lastRun: this.state[id]?.lastRun,
          writeTo: (pickText(meta, ['zapis', 'write']) ?? '_SYSTEM/PULPIT/raporty').split(',').map((s) => s.trim()),
          prompt: body.trim()
        })
      }
    }
    this.schedule()
  }

  list(): AgentDef[] {
    return [...this.agents.values()].map(({ prompt: _p, writeTo: _w, ...a }) => a)
  }

  setEnabled(id: string, enabled: boolean): void {
    this.state[id] = { ...this.state[id], enabled }
    this.persist()
    this.load()
  }

  private schedule(): void {
    for (const t of this.tasks.values()) void t.stop()
    this.tasks.clear()
    for (const a of this.agents.values()) {
      if (!a.enabled || !a.schedule || !cron.validate(a.schedule)) continue
      this.tasks.set(a.id, cron.schedule(a.schedule, () => void this.run(a.id)))
    }
  }

  async run(id: string): Promise<AgentRun> {
    const a = this.agents.get(id)
    if (!a) throw new Error(`Nie ma agenta ${id}`)
    const root = this.root()
    const allowed = a.writeTo.map((p) => resolve(root, p))
    const now = new Date()
    const today = now.toISOString().slice(0, 10)
    const prompt = `${a.prompt}\n\nDzisiaj jest ${today}. Folder roboczy: ${root}. Zapisywać możesz tylko w: ${a.writeTo.join(', ')}.`

    const { text } = await runClaude(
      {
        profile: this.profileFor(a.profileId),
        cwd: root,
        prompt,
        maxTurns: 40,
        allowOnly: (tool, input) => {
          if (READ_TOOLS.has(tool)) return true
          if (tool === 'Write' || tool === 'Edit') {
            const p = resolve(root, String(input.file_path ?? ''))
            return allowed.some((dir) => !relative(dir, p).startsWith('..'))
          }
          return false
        }
      },
      `agent-${id}-${now.getTime()}`,
      () => {}
    )

    const outDir = join(root, '_SYSTEM', 'PULPIT', 'raporty')
    mkdirSync(outDir, { recursive: true })
    const file = join(outDir, `${today}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}_${id}.md`)
    writeFileSync(file, `# ${a.name}\n\n${text}\n`, 'utf8')
    const run: AgentRun = { at: now.toISOString(), ok: !!text, output: text.slice(0, 600), file }
    this.state[id] = { ...this.state[id], lastRun: run }
    this.persist()
    this.agents.set(id, { ...a, lastRun: run })
    if (Notification.isSupported()) new Notification({ title: a.name, body: text.slice(0, 140) || 'Agent skończył bez odpowiedzi.' }).show()
    this.onFinished(id, run)
    return run
  }

  private persist(): void {
    writeFileSync(this.stateFile, JSON.stringify(this.state, null, 2))
  }
}
