import { app, safeStorage } from 'electron'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import type { Settings } from '../shared/types'

const dir = (): string => app.getPath('userData')
const settingsFile = (): string => join(dir(), 'ustawienia.json')
const secretsFile = (): string => join(dir(), 'sekrety.bin')

export function defaultSettings(): Settings {
  const home = homedir()
  return {
    projectsRoot: join(home, 'Desktop', 'PROJEKTY GRAFICZNE'),
    profiles: [
      { id: 'konto1', label: 'Konto 1', configDir: join(home, '.claude') },
      { id: 'konto2', label: 'Konto 2', configDir: join(home, '.claude-konto2'), note: 'Załóż skryptem scripts/konto2.ps1' }
    ],
    activeProfile: 'konto1',
    mail: [
      { id: 'gmail1', label: 'Gmail prywatny', user: 'kam.kochanowski@gmail.com', webIndex: 0 },
      { id: 'gmail2', label: 'Gmail firmowy', user: '', webIndex: 1 }
    ],
    calendars: [],
    monthlyGoal: 6000,
    rate: { min: 40, max: 50 },
    activityWatch: false,
    theme: 'system'
  }
}

let cache: Settings | undefined

export function getSettings(): Settings {
  if (cache) return cache
  const base = defaultSettings()
  try {
    const saved = JSON.parse(readFileSync(settingsFile(), 'utf8')) as Partial<Settings>
    cache = { ...base, ...saved }
  } catch {
    cache = base
  }
  return cache
}

export function setSettings(patch: Partial<Settings>): Settings {
  cache = { ...getSettings(), ...patch }
  mkdirSync(dir(), { recursive: true })
  writeFileSync(settingsFile(), JSON.stringify(cache, null, 2), 'utf8')
  return cache
}

// Hasła aplikacji do Gmaila: szyfrowane przez system (Windows DPAPI) i trzymane tylko na tym komputerze.

function readSecrets(): Record<string, string> {
  if (!existsSync(secretsFile()) || !safeStorage.isEncryptionAvailable()) return {}
  try {
    return JSON.parse(safeStorage.decryptString(readFileSync(secretsFile())))
  } catch {
    return {}
  }
}

export function getSecret(key: string): string | undefined {
  return readSecrets()[key]
}

export function setSecret(key: string, value: string): void {
  if (!safeStorage.isEncryptionAvailable()) throw new Error('Szyfrowanie systemowe niedostępne, hasło nie zostało zapisane.')
  const all = { ...readSecrets(), [key]: value }
  mkdirSync(dir(), { recursive: true })
  writeFileSync(secretsFile(), safeStorage.encryptString(JSON.stringify(all)))
}

/** Folder na dane Pulpitu wewnątrz PROJEKTY GRAFICZNE (raporty agentów, kopie przed zapisem) */
export function pulpitDataDir(): string {
  const d = join(getSettings().projectsRoot, '_SYSTEM', 'PULPIT')
  mkdirSync(d, { recursive: true })
  return d
}
