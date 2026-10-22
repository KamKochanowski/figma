import { BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'node:path'
import type { ChatEvent, ChatRequest, MailItem, Settings, TaskStatus, Workspace } from '../shared/types'
import { AgentRunner } from './agents/runner'
import { deadlinesFromTasks, fetchCalendars } from './calendar/ics'
import { answerPermission, startChat, stopRun } from './claude/chat'
import { listSessions, readSession, usageByDay } from './claude/history'
import { getLimits, refreshLimits } from './claude/limits'
import { installStatusline, openLoginTerminal } from './claude/profiles'
import { getSecret, getSettings, setSecret, setSettings } from './config'
import { fetchInbox } from './mail/imap'
import { timeByBrand } from './time/activitywatch'
import { scanWorkspace, setTaskStatus, toggleTodo } from './workspace/scan'
import { watchWorkspace } from './workspace/watch'
import { execFile } from 'node:child_process'

export function registerIpc(win: BrowserWindow, resourcesDir: string, userData: string): void {
  let ws: Workspace | undefined
  const send = (channel: string, ...args: unknown[]): void => {
    if (!win.isDestroyed()) win.webContents.send(channel, ...args)
  }
  const profile = (id?: string) => {
    const s = getSettings()
    return s.profiles.find((p) => p.id === (id ?? s.activeProfile)) ?? s.profiles[0]
  }
  const rescan = async (): Promise<Workspace> => {
    ws = await scanWorkspace(getSettings().projectsRoot)
    return ws
  }
  let watcher = watchWorkspace(getSettings().projectsRoot, async () => send('workspace:changed', await rescan()))

  const agents = new AgentRunner(
    join(resourcesDir, 'agents'),
    () => getSettings().projectsRoot,
    profile,
    join(userData, 'agenci.json'),
    (id, run) => send('agents:finished', id, run)
  )
  agents.load()

  // Folder projektów
  ipcMain.handle('workspace:get', () => ws ?? rescan())
  ipcMain.handle('workspace:toggleTodo', async (_e, id: string) => {
    await toggleTodo(getSettings().projectsRoot, ws ?? (await rescan()), id)
    send('workspace:changed', await rescan())
  })
  ipcMain.handle('workspace:setTaskStatus', async (_e, taskId: string, status: TaskStatus) => {
    const task = (ws ?? (await rescan())).tasks.find((t) => t.id === taskId)
    if (!task) throw new Error('Nie ma takiego zadania')
    await setTaskStatus(getSettings().projectsRoot, task, status)
    send('workspace:changed', await rescan())
  })
  ipcMain.handle('workspace:openPath', (_e, p: string) => shell.openPath(p))
  ipcMain.handle('workspace:newTask', (_e, brandId: string, shortName: string) => {
    // ten sam skrypt, którego używa Claude: _SYSTEM/SZABLONY/nowe_zadanie.js
    const root = getSettings().projectsRoot
    return new Promise<void>((res, rej) =>
      execFile('node', [join(root, '_SYSTEM', 'SZABLONY', 'nowe_zadanie.js'), brandId, shortName], { cwd: root }, (err) => (err ? rej(err) : res()))
    )
  })

  // Claude
  ipcMain.handle('claude:limits', async () => {
    const s = getSettings()
    await Promise.allSettled(s.profiles.map((p) => refreshLimits(p, s.projectsRoot)))
    return getLimits(s.profiles)
  })
  ipcMain.handle('claude:sessions', (_e, q?: string) => listSessions(getSettings().profiles, q))
  ipcMain.handle('claude:session', (_e, profileId: string, sessionId: string) => readSession(profile(profileId), sessionId))
  ipcMain.handle('claude:usage', (_e, days: number) => usageByDay(getSettings().profiles, days))
  ipcMain.handle('claude:send', (_e, req: ChatRequest) =>
    startChat(req, profile(req.profileId), getSettings().projectsRoot, (runId: string, ev: ChatEvent) => send('claude:event', runId, ev))
  )
  ipcMain.handle('claude:stop', (_e, runId: string) => stopRun(runId))
  ipcMain.handle('claude:answerPermission', (_e, requestId: string, allow: boolean) => answerPermission(requestId, allow))
  ipcMain.handle('claude:login', (_e, profileId: string) => openLoginTerminal(profile(profileId)))
  ipcMain.handle('claude:installStatusline', (_e, profileId: string) =>
    installStatusline(profile(profileId), join(resourcesDir, 'statusline', 'pulpit-statusline.cjs'))
  )

  // Poczta
  ipcMain.handle('mail:list', async () => {
    const s = getSettings()
    const brands = (ws ?? (await rescan())).brands
    const lists = await Promise.allSettled(
      s.mail.filter((m) => m.user && getSecret(`mail:${m.id}`)).map((m) => fetchInbox(m, getSecret(`mail:${m.id}`)!, brands))
    )
    return lists
      .flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
      .sort((a, b) => b.date.localeCompare(a.date))
  })
  ipcMain.handle('mail:open', (_e, item: MailItem) => shell.openExternal(item.webUrl))
  ipcMain.handle('mail:setPassword', (_e, accountId: string, pass: string) => setSecret(`mail:${accountId}`, pass.replace(/\s/g, '')))

  // Kalendarz i czas
  ipcMain.handle('calendar:list', async (_e, days: number) => {
    const tasks = (ws ?? (await rescan())).tasks
    const events = [...(await fetchCalendars(getSettings().calendars, days)), ...deadlinesFromTasks(tasks, days)]
    return events.sort((a, b) => a.start.localeCompare(b.start))
  })
  ipcMain.handle('time:byBrand', async (_e, days: number) =>
    getSettings().activityWatch ? timeByBrand((ws ?? (await rescan())).brands, days).catch(() => []) : []
  )

  // Agenci
  ipcMain.handle('agents:list', () => agents.list())
  ipcMain.handle('agents:run', (_e, id: string) => agents.run(id))
  ipcMain.handle('agents:setEnabled', (_e, id: string, enabled: boolean) => agents.setEnabled(id, enabled))

  // Ustawienia
  ipcMain.handle('settings:get', () => getSettings())
  ipcMain.handle('settings:set', async (_e, patch: Partial<Settings>) => {
    const before = getSettings().projectsRoot
    const next = setSettings(patch)
    if (patch.projectsRoot && patch.projectsRoot !== before) {
      await watcher.close()
      watcher = watchWorkspace(next.projectsRoot, async () => send('workspace:changed', await rescan()))
      send('workspace:changed', await rescan())
      agents.load()
    }
    return next
  })
}
