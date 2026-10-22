import { app, BrowserWindow, globalShortcut, Menu, nativeImage, shell, Tray } from 'electron'
import { join } from 'node:path'
import { registerIpc } from './ipc'

// Jedna kopia aplikacji naraz: drugie uruchomienie tylko pokazuje okno.
if (!app.requestSingleInstanceLock()) app.quit()

let win: BrowserWindow | null = null
let tray: Tray | null = null

const resourcesDir = app.isPackaged ? join(process.resourcesPath, 'resources') : join(__dirname, '../../resources')

function createWindow(): BrowserWindow {
  const w = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1024,
    minHeight: 680,
    title: 'Pulpit',
    backgroundColor: '#17181b',
    autoHideMenuBar: true,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      sandbox: true
    }
  })
  // Linki zewnętrzne (Gmail, Framer, Useme) zawsze w zwykłej przeglądarce
  w.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url)
    return { action: 'deny' }
  })
  if (process.env.ELECTRON_RENDERER_URL) void w.loadURL(process.env.ELECTRON_RENDERER_URL)
  else void w.loadFile(join(__dirname, '../renderer/index.html'))
  return w
}

function toggle(): void {
  if (!win) return
  if (win.isVisible() && win.isFocused()) win.hide()
  else {
    win.show()
    win.focus()
  }
}

app.whenReady().then(() => {
  app.setAppUserModelId('pl.kochdesign.pulpit')
  win = createWindow()
  registerIpc(win, resourcesDir, app.getPath('userData'))

  // Ctrl+Alt+P pokazuje i chowa Pulpit z każdego programu (Illustrator, Photoshop, przeglądarka)
  globalShortcut.register('CommandOrControl+Alt+P', toggle)

  tray = new Tray(nativeImage.createFromPath(join(resourcesDir, 'icon.png')))
  tray.setToolTip('Pulpit')
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: 'Pokaż Pulpit', click: toggle },
      { type: 'separator' },
      { label: 'Zamknij', click: () => app.quit() }
    ])
  )
  tray.on('click', toggle)

  // Zamknięcie okna chowa je do zasobnika, agenci w tle dalej działają
  win.on('close', (e) => {
    if (!(app as unknown as { quitting?: boolean }).quitting) {
      e.preventDefault()
      win?.hide()
    }
  })
})

app.on('second-instance', () => toggle())
app.on('before-quit', () => ((app as unknown as { quitting?: boolean }).quitting = true))
app.on('will-quit', () => globalShortcut.unregisterAll())
