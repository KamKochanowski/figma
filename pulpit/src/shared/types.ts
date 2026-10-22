// Wspólne typy dla procesu głównego (Electron) i interfejsu (React).
// Źródłem prawdy są pliki .md w folderze PROJEKTY GRAFICZNE. Pulpit je czyta,
// a zapisuje tylko w kilku jasno opisanych miejscach (odhaczenie zadania, status w ZADANIE.md).

export type TaskStatus =
  | 'w_trakcie'
  | 'do_akceptacji'
  | 'do_wyslania'
  | 'wyslane'
  | 'czeka_na_klienta'
  | 'do_rozliczenia'
  | 'zamkniete'
  | 'rekrutacja'
  | 'do_sprawdzenia'

export type BrandStatus = 'aktywna' | 'czeka' | 'zamknieta' | 'rekrutacja'

export type BrandSource = 'useme' | 'agencja' | 'bezposrednio' | 'etat' | 'inne'

export type Meta = Record<string, unknown>

export interface Brand {
  /** Nazwa folderu, np. AW_PARTS */
  id: string
  name: string
  folder: string
  status: BrandStatus | string
  who: string
  source: BrandSource
  industry: string
  lastTask: string
  /** Kolor marki (pierwszy hex z MARKA.md albo z opisu w MARKI.md) */
  color?: string
  rate?: string
  summary?: string
  meta: Meta
}

export interface Task {
  /** MARKA/ZAD_NN_nazwa */
  id: string
  brandId: string
  number: number
  title: string
  folder: string
  status: TaskStatus | string
  deadline?: string
  amount?: number
  estimate?: string
  updatedAt?: string
  meta: Meta
}

export interface TodoItem {
  /** Numer linii w AKTUALNE_WSPOLPRACE.md, stabilny do następnej zmiany pliku */
  id: string
  line: number
  done: boolean
  text: string
  /** Pogrubiony początek wpisu, np. "Rue de Skin (Brygida)" */
  label?: string
  brandId?: string
  section: string
}

export interface WaitingItem {
  client: string
  folder: string
  waitingFor: string
  /** Data RRRR-MM-DD z tekstu (pierwsza data dd.mm), jeśli jest */
  since?: string
  daysSilent?: number
  brandId?: string
}

export interface ActiveCollab {
  title: string
  brandId?: string
  lines: { key?: string; text: string }[]
}

export interface LogEntry {
  date: string
  text: string
}

export interface IncomeEntry {
  /** RRRR-MM */
  month: string
  date?: string
  client: string
  task?: string
  amount: number
  paid?: string
  source?: string
  brandId?: string
}

export interface QuoteEntry {
  id: string
  date?: string
  client: string
  task: string
  hours?: string
  amount?: number
  brandId?: string
  raw: Record<string, string>
}

export interface Workspace {
  root: string
  scannedAt: string
  /** Data z nagłówka „Ostatnia aktualizacja” w AKTUALNE_WSPOLPRACE.md */
  lastUpdate?: string
  brands: Brand[]
  tasks: Task[]
  todos: TodoItem[]
  active: ActiveCollab[]
  waiting: WaitingItem[]
  inquiries: WaitingItem[]
  log: LogEntry[]
  income: IncomeEntry[]
  quotes: QuoteEntry[]
  /** Pliki, których nie udało się odczytać, i inne uwagi dla Kamila */
  warnings: string[]
  /** true, gdy to dane przykładowe (podgląd w przeglądarce) */
  demo?: boolean
}

// Claude

export interface ClaudeProfile {
  id: string
  label: string
  /** Folder konfiguracji Claude Code (CLAUDE_CONFIG_DIR). Pierwsze konto zwykle ~/.claude */
  configDir: string
  note?: string
}

export interface LimitWindow {
  usedPct: number
  /** Unix, sekundy */
  resetsAt: number
}

export interface Limits {
  profileId: string
  fiveHour?: LimitWindow
  sevenDay?: LimitWindow
  model?: string
  contextPct?: number
  /** Kiedy Claude Code ostatnio zapisał dane (ms) */
  updatedAt?: number
}

export interface SessionSummary {
  profileId: string
  sessionId: string
  project: string
  cwd?: string
  title: string
  startedAt: string
  updatedAt: string
  messages: number
  outputTokens: number
  model?: string
  file: string
}

export interface SessionMessage {
  role: 'user' | 'assistant'
  text: string
  at?: string
  tools?: string[]
}

export interface UsageDay {
  day: string
  profileId: string
  input: number
  output: number
  cacheRead: number
  cacheWrite: number
}

export type ChatEvent =
  | { type: 'started'; sessionId?: string }
  | { type: 'text'; text: string }
  | { type: 'tool'; name: string; detail?: string }
  | { type: 'permission'; requestId: string; tool: string; detail: string }
  | { type: 'done'; sessionId?: string; costUsd?: number }
  | { type: 'error'; message: string }

export interface ChatRequest {
  profileId: string
  prompt: string
  /** id sesji do kontynuacji */
  resume?: string
}

// Poczta, kalendarz, czas

export interface MailAccount {
  id: string
  label: string
  user: string
  host?: string
  /** Indeks konta w Gmailu w przeglądarce (mail.google.com/mail/u/N) */
  webIndex?: number
}

export type MailTag = 'klient' | 'useme' | 'inne'

export interface MailItem {
  accountId: string
  uid: number
  threadId?: string
  from: string
  fromName: string
  subject: string
  date: string
  snippet: string
  unread: boolean
  tag: MailTag
  brandId?: string
  webUrl: string
}

export interface CalEvent {
  id: string
  title: string
  start: string
  end?: string
  allDay: boolean
  source: 'kalendarz' | 'termin'
  brandId?: string
}

export interface TimeByBrand {
  brandId: string
  hours: number
  apps: Record<string, number>
}

// Agenci

export interface AgentRun {
  at: string
  ok: boolean
  output?: string
  file?: string
}

export interface AgentDef {
  id: string
  name: string
  description: string
  /** Wyrażenie cron, np. "30 7 * * 1-5" */
  schedule?: string
  profileId?: string
  enabled: boolean
  lastRun?: AgentRun
}

// Ustawienia

export interface Settings {
  projectsRoot: string
  profiles: ClaudeProfile[]
  activeProfile: string
  mail: MailAccount[]
  calendars: { label: string; url: string }[]
  /** Cel miesięczny netto w zł */
  monthlyGoal: number
  rate: { min: number; max: number }
  activityWatch: boolean
  theme: 'system' | 'dark' | 'light'
}

// Most między interfejsem a procesem głównym (preload wystawia go jako window.pulpit)

export interface PulpitApi {
  workspace: {
    get(): Promise<Workspace>
    onChange(cb: (ws: Workspace) => void): () => void
    toggleTodo(id: string): Promise<void>
    setTaskStatus(taskId: string, status: TaskStatus): Promise<void>
    openPath(path: string): Promise<void>
    newTask(brandId: string, shortName: string): Promise<void>
  }
  claude: {
    limits(): Promise<Limits[]>
    sessions(query?: string): Promise<SessionSummary[]>
    session(profileId: string, sessionId: string): Promise<SessionMessage[]>
    usage(days: number): Promise<UsageDay[]>
    send(req: ChatRequest): Promise<string>
    stop(runId: string): Promise<void>
    onEvent(cb: (runId: string, ev: ChatEvent) => void): () => void
    answerPermission(requestId: string, allow: boolean): Promise<void>
    login(profileId: string): Promise<void>
    installStatusline(profileId: string): Promise<string>
  }
  mail: {
    list(): Promise<MailItem[]>
    open(item: MailItem): Promise<void>
    setPassword(accountId: string, appPassword: string): Promise<void>
  }
  calendar: {
    list(days: number): Promise<CalEvent[]>
  }
  agents: {
    list(): Promise<AgentDef[]>
    run(id: string): Promise<void>
    setEnabled(id: string, enabled: boolean): Promise<void>
    onFinished(cb: (id: string, run: AgentRun) => void): () => void
  }
  time: {
    byBrand(days: number): Promise<TimeByBrand[]>
  }
  settings: {
    get(): Promise<Settings>
    set(patch: Partial<Settings>): Promise<Settings>
  }
}
