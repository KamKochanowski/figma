import { contextBridge, ipcRenderer } from 'electron'
import type { PulpitApi } from '../shared/types'

const on = (channel: string, cb: (...args: never[]) => void): (() => void) => {
  const h = (_e: unknown, ...args: unknown[]): void => (cb as (...a: unknown[]) => void)(...args)
  ipcRenderer.on(channel, h)
  return () => ipcRenderer.removeListener(channel, h)
}
const call = (channel: string) => (...args: unknown[]) => ipcRenderer.invoke(channel, ...args)

const api: PulpitApi = {
  workspace: {
    get: call('workspace:get'),
    onChange: (cb) => on('workspace:changed', cb),
    toggleTodo: call('workspace:toggleTodo'),
    setTaskStatus: call('workspace:setTaskStatus'),
    openPath: call('workspace:openPath'),
    newTask: call('workspace:newTask')
  },
  claude: {
    limits: call('claude:limits'),
    sessions: call('claude:sessions'),
    session: call('claude:session'),
    usage: call('claude:usage'),
    send: call('claude:send'),
    stop: call('claude:stop'),
    onEvent: (cb) => on('claude:event', cb),
    answerPermission: call('claude:answerPermission'),
    login: call('claude:login'),
    installStatusline: call('claude:installStatusline')
  },
  mail: { list: call('mail:list'), open: call('mail:open'), setPassword: call('mail:setPassword') },
  calendar: { list: call('calendar:list') },
  agents: {
    list: call('agents:list'),
    run: call('agents:run'),
    setEnabled: call('agents:setEnabled'),
    onFinished: (cb) => on('agents:finished', cb)
  },
  time: { byBrand: call('time:byBrand') },
  settings: { get: call('settings:get'), set: call('settings:set') }
} as PulpitApi

contextBridge.exposeInMainWorld('pulpit', api)
