import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Brand, Limits, Settings, Workspace } from '../../shared/types'
import { api, isDemo } from './api'

export type ViewId = 'dzis' | 'wspolprace' | 'zlecenia' | 'finanse' | 'claude' | 'poczta' | 'agenci' | 'portfolio' | 'ustawienia'

interface Store {
  ws?: Workspace
  settings?: Settings
  limits: Limits[]
  view: ViewId
  go: (v: ViewId, brandId?: string) => void
  brandId?: string
  brand: (id?: string) => Brand | undefined
  refreshLimits: () => Promise<void>
  setSettings: (patch: Partial<Settings>) => Promise<void>
  notify: (msg: string) => void
}

const Ctx = createContext<Store | null>(null)
export const useStore = (): Store => useContext(Ctx)!

const VIEWS: ViewId[] = ['dzis', 'wspolprace', 'zlecenia', 'finanse', 'claude', 'poczta', 'agenci', 'portfolio', 'ustawienia']
const fromHash = (): ViewId => {
  const h = location.hash.slice(1) as ViewId
  return VIEWS.includes(h) ? h : 'dzis'
}

export function StoreProvider({ children, notify }: { children: ReactNode; notify: (m: string) => void }) {
  const [ws, setWs] = useState<Workspace>()
  const [settings, setS] = useState<Settings>()
  const [limits, setLimits] = useState<Limits[]>([])
  const [view, setView] = useState<ViewId>(fromHash)
  const [brandId, setBrandId] = useState<string>()

  useEffect(() => {
    void api.workspace.get().then(setWs)
    void api.settings.get().then(setS)
    void api.claude.limits().then(setLimits).catch(() => {})
    const off = api.workspace.onChange(setWs)
    const onHash = (): void => setView(fromHash())
    window.addEventListener('hashchange', onHash)
    return () => {
      off()
      window.removeEventListener('hashchange', onHash)
    }
  }, [])

  useEffect(() => {
    // W podglądzie motyw ustawia przeglądarka (jasny lub ciemny), w aplikacji ustawienie z Pulpitu
    if (!settings || isDemo) return
    const root = document.documentElement
    if (settings.theme === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', settings.theme)
  }, [settings?.theme])

  const go = useCallback((v: ViewId, b?: string) => {
    setView(v)
    setBrandId(b)
    if (location.hash.slice(1) !== v) history.replaceState(null, '', `#${v}`)
    document.querySelector('.view')?.scrollTo({ top: 0 })
  }, [])

  const value = useMemo<Store>(
    () => ({
      ws,
      settings,
      limits,
      view,
      go,
      brandId,
      brand: (id) => ws?.brands.find((b) => b.id === id),
      refreshLimits: async () => {
        notify('Pytam Claude Code o limity obu kont...')
        setLimits(await api.claude.limits())
        notify('Limity odświeżone.')
      },
      setSettings: async (patch) => setS(await api.settings.set(patch)),
      notify
    }),
    [ws, settings, limits, view, go, brandId, notify]
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
