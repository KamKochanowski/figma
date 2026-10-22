import { copyFileSync, mkdirSync } from 'node:fs'
import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Brand, Task, TaskStatus, Workspace } from '../../shared/types'
import {
  brandFromFile,
  brandKeys,
  parseAktualne,
  parseIncome,
  parseMarki,
  parseQuotes,
  setFrontMatterValue,
  taskFromFile,
  toggleTodoLine,
  type MarkiRow
} from './parse'

// Foldery w PROJEKTY GRAFICZNE, które nie są markami
const SKIP = new Set(['_SYSTEM', '_KAMIL', 'KAMIL AI', 'smiecie', '_SKILLE', 'node_modules', '.git'])

async function readText(path: string): Promise<string | undefined> {
  try {
    return await readFile(path, 'utf8')
  } catch {
    return undefined
  }
}

async function findFile(dir: string, name: string): Promise<string | undefined> {
  try {
    const hit = (await readdir(dir)).find((f) => f.toLowerCase() === name.toLowerCase())
    return hit ? join(dir, hit) : undefined
  } catch {
    return undefined
  }
}

export async function scanWorkspace(root: string, today = new Date()): Promise<Workspace> {
  const warnings: string[] = []
  const ws: Workspace = {
    root,
    scannedAt: new Date().toISOString(),
    brands: [],
    tasks: [],
    todos: [],
    active: [],
    waiting: [],
    inquiries: [],
    log: [],
    income: [],
    quotes: [],
    warnings
  }

  let entries: string[]
  try {
    entries = await readdir(root)
  } catch {
    warnings.push(`Nie widzę folderu ${root}. Ustaw właściwą ścieżkę w Ustawieniach.`)
    return ws
  }

  const markiText = await readText(join(root, 'MARKI.md'))
  const rows: MarkiRow[] = markiText ? parseMarki(markiText) : []
  if (!markiText) warnings.push('Brak MARKI.md, marki biorę tylko z folderów.')
  const rowFor = (id: string): MarkiRow | undefined => rows.find((r) => r.id.toLowerCase() === id.toLowerCase())

  // Marki i zadania z folderów
  for (const name of entries) {
    if (SKIP.has(name) || name.startsWith('.')) continue
    const dir = join(root, name)
    const s = await stat(dir).catch(() => undefined)
    if (!s?.isDirectory()) continue
    const markaPath = await findFile(dir, 'MARKA.md')
    const row = rowFor(name)
    if (!markaPath && !row) continue
    const text = markaPath ? ((await readText(markaPath)) ?? '') : ''
    const brand = brandFromFile(name.toUpperCase(), dir, text, row)
    ws.brands.push(brand)

    for (const sub of await readdir(dir).catch(() => [] as string[])) {
      if (!/^ZAD_\d+/i.test(sub)) continue
      const taskDir = join(dir, sub)
      const zadPath = await findFile(taskDir, 'ZADANIE.md')
      if (!zadPath) continue
      const [t, st] = await Promise.all([readText(zadPath), stat(zadPath)])
      ws.tasks.push(taskFromFile(brand.id, sub, taskDir, t ?? '', st.mtime))
    }
  }

  // Marki z MARKI.md bez folderu na dysku (np. inna wielkość liter na Windowsie już złapana wyżej)
  for (const r of rows) {
    if (!ws.brands.some((b) => b.id.toLowerCase() === r.id.toLowerCase())) {
      ws.brands.push(brandFromFile(r.id.toUpperCase(), join(root, r.id), '', r))
      warnings.push(`MARKI.md wskazuje folder ${r.id}, którego nie ma na dysku.`)
    }
  }

  const keys = brandKeys(ws.brands)

  const aktualne = await readText(join(root, 'AKTUALNE_WSPOLPRACE.md'))
  if (aktualne) Object.assign(ws, parseAktualne(aktualne, today, keys))
  else warnings.push('Brak AKTUALNE_WSPOLPRACE.md, lista na dziś będzie pusta.')

  const zarobki = await readText(join(root, 'ZAROBKI.md'))
  if (zarobki) ws.income = parseIncome(zarobki, keys)
  const wyceny = await readText(join(root, 'WYCENY.md'))
  if (wyceny) ws.quotes = parseQuotes(wyceny, keys)

  ws.brands.sort(byStatusThenName)
  ws.tasks.sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''))
  return ws
}

const BRAND_ORDER = ['aktywna', 'czeka', 'rekrutacja', 'zamknieta']
function byStatusThenName(a: Brand, b: Brand): number {
  const d = BRAND_ORDER.indexOf(a.status) - BRAND_ORDER.indexOf(b.status)
  return d !== 0 ? d : a.name.localeCompare(b.name, 'pl')
}

// Zapisy. Przed każdym zapisem kopia pliku do _SYSTEM/PULPIT/kopie (zasada: nic nie kasujemy na stałe).

function backup(root: string, file: string, label: string): void {
  const dir = join(root, '_SYSTEM', 'PULPIT', 'kopie')
  mkdirSync(dir, { recursive: true })
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  copyFileSync(file, join(dir, `${stamp}_${label}`))
}

export async function toggleTodo(root: string, ws: Workspace, id: string): Promise<void> {
  const item = ws.todos.find((t) => t.id === id)
  if (!item) throw new Error('Nie ma już takiego wpisu, odśwież listę.')
  const file = join(root, 'AKTUALNE_WSPOLPRACE.md')
  const text = await readFile(file, 'utf8')
  const next = toggleTodoLine(text, item.line, item.text)
  if (next === null) throw new Error('Plik zmienił się w międzyczasie. Lista została odświeżona, kliknij jeszcze raz.')
  backup(root, file, 'AKTUALNE_WSPOLPRACE.md')
  await writeFile(file, next, 'utf8')
}

export async function setTaskStatus(root: string, task: Task, status: TaskStatus): Promise<void> {
  const file = await findFile(task.folder, 'ZADANIE.md')
  if (!file) throw new Error(`Brak ZADANIE.md w ${task.folder}`)
  const text = await readFile(file, 'utf8')
  backup(root, file, `${task.id.replace(/[\\/]/g, '_')}_ZADANIE.md`)
  await writeFile(file, setFrontMatterValue(text, 'status', status), 'utf8')
}
