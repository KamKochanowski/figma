// Podgląd w przeglądarce bez Electrona. Marki, lista na dziś, „czekam na klienta” i dziennik
// pochodzą z prawdziwych plików Kamila (MARKI.md i AKTUALNE_WSPOLPRACE.md z 22.10.2026),
// przepuszczonych przez ten sam parser co w aplikacji. Reszta (limity, poczta, historia zarobków)
// to przykłady oznaczone w interfejsie jako przykładowe.
import markiMd from '../../../tests/fixtures/MARKI.md?raw'
import aktualneMd from '../../../tests/fixtures/AKTUALNE_WSPOLPRACE.md?raw'
import type {
  AgentDef,
  Brand,
  CalEvent,
  ChatEvent,
  IncomeEntry,
  Limits,
  MailItem,
  PulpitApi,
  SessionMessage,
  SessionSummary,
  Settings,
  Task,
  UsageDay,
  Workspace
} from '../../shared/types'
import { brandFromFile, brandKeys, parseAktualne, parseMarki, splitFrontMatter, toggleTodoLine } from '../../main/workspace/parse'

const agentFiles = import.meta.glob('../../../resources/agents/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

const TODAY = new Date(2026, 9, 22, 20, 15)
let aktualne = aktualneMd

function statusFromText(t: string): string {
  const s = t.toLowerCase()
  if (/do wysłania|wysłać/.test(s)) return 'do_wyslania'
  if (/czeka na wybór|czeka na odpowied|czeka/.test(s)) return 'czeka_na_klienta'
  if (/poprawki|do akceptacji/.test(s)) return 'do_akceptacji'
  if (/rozliczenia/.test(s)) return 'do_rozliczenia'
  if (/wysłać do|rekrutac/.test(s)) return 'rekrutacja'
  if (/^zad_\d+ .*(maile|szafy|oklejenie|13 grafik|galeria)/.test(s)) return 'zamkniete'
  return 'w_trakcie'
}

function build(): Workspace {
  const rows = parseMarki(markiMd)
  const brands: Brand[] = rows.map((r) => {
    const b = brandFromFile(r.id.toUpperCase(), `PROJEKTY GRAFICZNE\\${r.id}`, '', r)
    if (b.status === 'zamknieta') b.lastTask = r.lastTask
    return b
  })
  const tasks: Task[] = rows
    .map((r) => {
      const m = /ZAD_(\d+)\s+([^,]+)/.exec(r.lastTask)
      if (!m) return undefined
      const brand = brands.find((b) => b.id === r.id.toUpperCase())!
      const status = brand.status === 'zamknieta' ? 'zamkniete' : statusFromText(r.lastTask)
      return {
        id: `${brand.id}/ZAD_${m[1]}`,
        brandId: brand.id,
        number: Number(m[1]),
        title: m[2].trim(),
        folder: `${brand.folder}\\ZAD_${m[1]}`,
        status,
        meta: {}
      } as Task
    })
    .filter((t): t is Task => !!t)
  // terminy z AKTUALNE_WSPOLPRACE.md (Rue de Skin)
  const rue = tasks.find((t) => t.brandId === 'RUE_DE_SKIN')
  if (rue) rue.deadline = '2026-11-10'
  tasks.push({ id: 'RUE_DE_SKIN/ZAD_02b', brandId: 'RUE_DE_SKIN', number: 2, title: 'karta wzorcowa Retinyl w Figmie', folder: '', status: 'w_trakcie', deadline: '2026-10-27', meta: {} })
  tasks.push({ id: 'BETTER_AND_MORE/ZAD_03', brandId: 'BETTER_AND_MORE', number: 3, title: 'wizytówki i ulotka A5', folder: '', status: 'do_rozliczenia', amount: 350, meta: {} })
  tasks.push({ id: 'PROFUMO_LABO/ZAD_02b', brandId: 'PROFUMO_LABO', number: 2, title: 'poprawki zestawień, 46 grafik', folder: '', status: 'do_wyslania', amount: 100, meta: {} })
  const bm = tasks.find((t) => t.id === 'BETTER_AND_MORE/ZAD_04')
  if (bm) bm.amount = 100

  const keys = brandKeys(brands)
  const a = parseAktualne(aktualne, TODAY, keys)

  // Przychody: październik ze znanych kwot z AKTUALNE_WSPOLPRACE.md, wcześniejsze miesiące przykładowe
  const income: IncomeEntry[] = [
    { month: '2026-10', client: 'Better and More', task: 'ZAD_03 wizytówki i ulotka', amount: 350, paid: 'do rozliczenia', source: 'agencja', brandId: 'BETTER_AND_MORE' },
    { month: '2026-10', client: 'Better and More', task: 'ZAD_04 okładka raportu A1', amount: 100, paid: 'do rozliczenia', source: 'agencja', brandId: 'BETTER_AND_MORE' },
    { month: '2026-10', client: 'Profumo Labo', task: 'ZAD_02 zestawienia packshot', amount: 100, paid: 'z kolejną fakturą', source: 'useme', brandId: 'PROFUMO_LABO' }
  ]
  return {
    root: 'C:\\Users\\kamko\\Desktop\\PROJEKTY GRAFICZNE',
    scannedAt: TODAY.toISOString(),
    brands,
    tasks,
    income,
    quotes: [],
    warnings: ['Podgląd w przeglądarce: marki, lista na dziś i dziennik z Twoich plików z 22.10, reszta przykładowa.'],
    demo: true,
    ...a
  }
}

/** Historia miesięcy do wykresu: przykładowe kwoty, w aplikacji z ZAROBKI.md */
export const DEMO_MONTHS: { month: string; amount: number; example: boolean }[] = [
  ['2025-11', 2100], ['2025-12', 1650], ['2026-01', 2900], ['2026-02', 2400], ['2026-03', 3300], ['2026-04', 2750],
  ['2026-05', 3600], ['2026-06', 3100], ['2026-07', 2650], ['2026-08', 3900], ['2026-09', 4300]
].map(([month, amount]) => ({ month: month as string, amount: amount as number, example: true }))

let ws = build()
const listeners = new Set<(w: Workspace) => void>()
const chatListeners = new Set<(runId: string, ev: ChatEvent) => void>()

const sessions: SessionSummary[] = [
  ['konto1', 'DPPG runda 2: research, 3 nowe wersje kalendarza, render N w Blenderze', '2026-10-16T22:40:00Z', 214],
  ['konto2', 'Mentor Bridge Zakuwanie24: 14 grafik w Figmie i teksty reklam', '2026-10-21T21:05:00Z', 168],
  ['konto1', 'Rue de Skin ZAD_02: inwentarz 324 plików i plan kart produktów', '2026-10-22T19:10:00Z', 241],
  ['konto2', 'Profumo Labo: 46 zestawień packshot vs oryginał, poprawki proporcji', '2026-10-22T17:30:00Z', 97],
  ['konto1', 'Better and More ZAD_04: okładka raportu A1 w Wordzie', '2026-10-22T15:20:00Z', 63],
  ['konto2', 'Porządki w PROJEKTY GRAFICZNE: 569 przeniesień, MARKA.md w każdej marce', '2026-10-17T23:50:00Z', 402]
].map(([profileId, title, updatedAt, messages], i) => ({
  profileId: profileId as string,
  sessionId: `demo-${i}`,
  project: 'C--Users-kamko-Desktop-PROJEKTY-GRAFICZNE',
  title: title as string,
  startedAt: updatedAt as string,
  updatedAt: updatedAt as string,
  messages: messages as number,
  outputTokens: (messages as number) * 900,
  model: 'claude-opus',
  file: ''
}))

const NOW = Date.now()
const limits: Limits[] = [
  { profileId: 'konto1', fiveHour: { usedPct: 72, resetsAt: Math.round(NOW / 1000) + 5400 }, sevenDay: { usedPct: 58, resetsAt: Math.round(NOW / 1000) + 3 * 86400 }, model: 'Opus', updatedAt: NOW - 600000 },
  { profileId: 'konto2', fiveHour: { usedPct: 9, resetsAt: Math.round(NOW / 1000) + 12600 }, sevenDay: { usedPct: 34, resetsAt: Math.round(NOW / 1000) + 5 * 86400 }, model: 'Opus', updatedAt: NOW - 3600000 }
]

const mail: MailItem[] = [
  { accountId: 'gmail1', uid: 1, from: 'powiadomienia@useme.com', fromName: 'Useme', subject: 'Nowe zlecenie: projekt etykiety i opakowania kosmetyku', date: '2026-10-22T18:42:00Z', snippet: '', unread: true, tag: 'useme', webUrl: 'https://mail.google.com/mail/u/0/#inbox' },
  { accountId: 'gmail1', uid: 2, from: 'iza@example.com', fromName: 'Iza, Better and More', subject: 'Re: okładka raportu A1', date: '2026-10-22T16:05:00Z', snippet: '', unread: true, tag: 'klient', brandId: 'BETTER_AND_MORE', webUrl: 'https://mail.google.com/mail/u/0/#inbox' },
  { accountId: 'gmail2', uid: 3, from: 'leszek@example.com', fromName: 'Leszek, ZOX', subject: 'ClipTag: copy DE do grafiki 3', date: '2026-10-22T11:30:00Z', snippet: '', unread: false, tag: 'klient', brandId: 'ZOX', webUrl: 'https://mail.google.com/mail/u/1/#inbox' },
  { accountId: 'gmail1', uid: 4, from: 'powiadomienia@useme.com', fromName: 'Useme', subject: 'Wiadomość od klienta: AW Parts', date: '2026-10-21T20:12:00Z', snippet: '', unread: false, tag: 'useme', brandId: 'AW_PARTS', webUrl: 'https://mail.google.com/mail/u/0/#inbox' },
  { accountId: 'gmail2', uid: 5, from: 'newsletter@example.com', fromName: 'Adobe', subject: 'Nowości w After Effects 26.2', date: '2026-10-21T09:00:00Z', snippet: '', unread: false, tag: 'inne', webUrl: 'https://mail.google.com/mail/u/1/#inbox' }
]

let settings: Settings = {
  projectsRoot: 'C:\\Users\\kamko\\Desktop\\PROJEKTY GRAFICZNE',
  profiles: [
    { id: 'konto1', label: 'Konto 1', configDir: 'C:\\Users\\kamko\\.claude' },
    { id: 'konto2', label: 'Konto 2', configDir: 'C:\\Users\\kamko\\.claude-konto2' }
  ],
  activeProfile: 'konto2',
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

const agents: AgentDef[] = Object.entries(agentFiles).map(([path, text]) => {
  const { meta } = splitFrontMatter(text)
  const id = path.split('/').pop()!.replace('.md', '')
  return {
    id,
    name: String(meta.nazwa ?? id),
    description: String(meta.opis ?? ''),
    schedule: meta.harmonogram ? String(meta.harmonogram) : undefined,
    profileId: meta.konto ? String(meta.konto) : undefined,
    enabled: true,
    lastRun: id === 'plan-na-wieczor' ? { at: '2026-10-22T15:00:00Z', ok: true, output: 'Dziś najważniejsze: wysłać trzy gotowe rzeczy (Profumo, Mentor Bridge, AW Parts), zanim zaczniesz kartę Retinyl.' } : undefined
  }
})

const calendar: CalEvent[] = [
  { id: 'c1', title: 'Rue de Skin: karta wzorcowa Retinyl', start: '2026-10-27', allDay: true, source: 'termin', brandId: 'RUE_DE_SKIN' },
  { id: 'c2', title: 'Rue de Skin: karty produktów i zestawy', start: '2026-11-10', allDay: true, source: 'termin', brandId: 'RUE_DE_SKIN' },
  { id: 'c3', title: 'Zakaz zmian na stronie Rue de Skin (do 16.11)', start: '2026-11-14', allDay: true, source: 'termin', brandId: 'RUE_DE_SKIN' },
  { id: 'c4', title: 'Black Friday Rue de Skin', start: '2026-11-27', allDay: true, source: 'termin', brandId: 'RUE_DE_SKIN' }
]

const usage: UsageDay[] = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(TODAY.getTime() - (13 - i) * 86400000).toISOString().slice(0, 10)
  return [
    { day: d, profileId: 'konto1', input: 0, output: [40, 62, 18, 0, 75, 90, 33, 58, 12, 0, 66, 81, 47, 95][i] * 1000, cacheRead: 0, cacheWrite: 0 },
    { day: d, profileId: 'konto2', input: 0, output: [12, 0, 55, 70, 20, 0, 61, 30, 88, 74, 9, 35, 80, 52][i] * 1000, cacheRead: 0, cacheWrite: 0 }
  ]
}).flat()

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms))

export const demoApi: PulpitApi = {
  workspace: {
    get: async () => ws,
    onChange: (cb) => (listeners.add(cb), () => listeners.delete(cb)),
    toggleTodo: async (id) => {
      const t = ws.todos.find((x) => x.id === id)
      if (!t) return
      aktualne = toggleTodoLine(aktualne, t.line, t.text) ?? aktualne
      ws = { ...build() }
      listeners.forEach((l) => l(ws))
    },
    setTaskStatus: async (taskId, status) => {
      ws = { ...ws, tasks: ws.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)) }
      listeners.forEach((l) => l(ws))
    },
    openPath: async () => {},
    newTask: async () => {}
  },
  claude: {
    limits: async () => limits,
    sessions: async (q) => sessions.filter((s) => !q || s.title.toLowerCase().includes(q.toLowerCase())),
    session: async (_p, id): Promise<SessionMessage[]> => {
      const s = sessions.find((x) => x.sessionId === id)
      return [
        { role: 'user', text: `(przykład) ${s?.title ?? ''}` },
        { role: 'assistant', text: 'Przeczytałem SKILL.md, MARKA.md i wszystkie ZADANIE.md tej marki. W podglądzie przeglądarkowym nie ma prawdziwej historii, w aplikacji zobaczysz tu całą rozmowę z pliku .jsonl.' }
      ]
    },
    usage: async () => usage,
    send: async (req) => {
      const runId = `run-${Date.now()}`
      void (async () => {
        const emit = (ev: ChatEvent): void => chatListeners.forEach((l) => l(runId, ev))
        await sleep(300)
        emit({ type: 'started', sessionId: 'demo' })
        await sleep(500)
        emit({ type: 'tool', name: 'Read', detail: 'Read: AKTUALNE_WSPOLPRACE.md' })
        await sleep(700)
        emit({ type: 'text', text: `To podgląd w przeglądarce, więc nie łączę się z Claude. W aplikacji na Twoim komputerze ta wiadomość („${req.prompt.slice(0, 60)}”) poszłaby do Claude Code na koncie ${req.profileId === 'konto1' ? '1' : '2'}, w folderze PROJEKTY GRAFICZNE, z Twoim CLAUDE.md i skillami.` })
        emit({ type: 'done', sessionId: 'demo' })
      })()
      return runId
    },
    stop: async () => {},
    onEvent: (cb) => (chatListeners.add(cb), () => chatListeners.delete(cb)),
    answerPermission: async () => {},
    login: async () => {},
    installStatusline: async () => 'W podglądzie nic nie instaluję.'
  },
  mail: { list: async () => mail, open: async (m) => void window.open(m.webUrl, '_blank'), setPassword: async () => {} },
  calendar: { list: async () => calendar },
  agents: {
    list: async () => agents,
    run: async () => {},
    setEnabled: async (id, enabled) => {
      const a = agents.find((x) => x.id === id)
      if (a) a.enabled = enabled
    },
    onFinished: () => () => {}
  },
  time: { byBrand: async () => [] },
  settings: {
    get: async () => settings,
    set: async (patch) => (settings = { ...settings, ...patch })
  }
}
