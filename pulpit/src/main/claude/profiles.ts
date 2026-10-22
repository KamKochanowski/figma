import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import type { ClaudeProfile } from '../../shared/types'

/**
 * Konto domyślne (~/.claude) uruchamiamy BEZ zmiennej CLAUDE_CONFIG_DIR.
 * Po jej ustawieniu Claude Code szuka .claude.json wewnątrz folderu, a nie w katalogu domowym,
 * i domyślne konto wyglądałoby na wylogowane.
 */
export function isDefaultDir(dir: string): boolean {
  return resolve(dir).toLowerCase() === resolve(join(homedir(), '.claude')).toLowerCase()
}

export function envFor(profile: ClaudeProfile): Record<string, string | undefined> {
  const env: Record<string, string | undefined> = { ...process.env }
  if (isDefaultDir(profile.configDir)) delete env.CLAUDE_CONFIG_DIR
  else env.CLAUDE_CONFIG_DIR = profile.configDir
  return env
}

/**
 * Logowanie zawsze przez oficjalny Claude Code: otwieramy terminal z właściwym kontem,
 * Kamil wpisuje /login i loguje się w przeglądarce. Pulpit nigdy nie widzi ani nie zapisuje tokenów.
 */
export function openLoginTerminal(profile: ClaudeProfile): void {
  const setVar = isDefaultDir(profile.configDir) ? 'set CLAUDE_CONFIG_DIR=' : `set "CLAUDE_CONFIG_DIR=${profile.configDir}"`
  if (process.platform === 'win32') {
    spawn('cmd.exe', ['/c', 'start', `"Claude ${profile.label}"`, 'cmd', '/k', `${setVar}&& echo Wpisz /login, jesli konto nie jest zalogowane.&& claude`], {
      detached: true,
      shell: false,
      windowsHide: false
    }).unref()
    return
  }
  // macOS i Linux: nowy terminal bez zgadywania emulatora, wystarczy instrukcja
  throw new Error(`Otwórz terminal i wpisz: ${isDefaultDir(profile.configDir) ? '' : `CLAUDE_CONFIG_DIR="${profile.configDir}" `}claude`)
}

const STATUSLINE_NAME = 'pulpit-statusline.cjs'

/**
 * Dokłada do Claude Code (dla danego konta) linię statusu, która przy okazji zapisuje
 * limity 5 h i tygodniowe do pliku pulpit-limity.json. Jeśli Kamil ma już własną linię statusu,
 * nie nadpisujemy jej, tylko zwracamy instrukcję.
 */
export function installStatusline(profile: ClaudeProfile, scriptSource: string): string {
  mkdirSync(profile.configDir, { recursive: true })
  const target = join(profile.configDir, STATUSLINE_NAME)
  copyFileSync(scriptSource, target)
  const settingsPath = join(profile.configDir, 'settings.json')
  let settings: Record<string, unknown> = {}
  if (existsSync(settingsPath)) {
    try {
      settings = JSON.parse(readFileSync(settingsPath, 'utf8'))
    } catch {
      return `Nie mogę odczytać ${settingsPath}. Popraw plik ręcznie i spróbuj jeszcze raz.`
    }
  }
  const existing = settings.statusLine as { command?: string } | undefined
  if (existing?.command && !existing.command.includes(STATUSLINE_NAME)) {
    return `Masz już własną linię statusu (${existing.command}). Zostawiam ją. Żeby Pulpit widział limity, dopisz na jej końcu wywołanie: node "${target}"`
  }
  copyFileSync(settingsPath, `${settingsPath}.przed-pulpitem`) // kopia, nic nie kasujemy
  settings.statusLine = { type: 'command', command: `node "${target}"`, padding: 0 }
  writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf8')
  return `Gotowe. Linia statusu zapisuje limity do ${join(profile.configDir, 'pulpit-limity.json')}.`
}
