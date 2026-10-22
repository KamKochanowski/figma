import { watch, type FSWatcher } from 'chokidar'

// Obserwuje tylko pliki .md (bez 04_robocze, eksportów i plików Adobe), żeby nie mielić 60 GB.
export function watchWorkspace(root: string, onChange: () => void): FSWatcher {
  let timer: NodeJS.Timeout | undefined
  const w = watch(root, {
    ignoreInitial: true,
    depth: 3,
    ignored: (path, stats) =>
      /[\\/](node_modules|\.git|smiecie|0[2-6]_[^\\/]*|ROZMOWY)([\\/]|$)/i.test(path) ||
      (!!stats?.isFile() && !path.toLowerCase().endsWith('.md'))
  })
  const kick = (): void => {
    clearTimeout(timer)
    timer = setTimeout(onChange, 400)
  }
  w.on('add', kick).on('change', kick).on('unlink', kick).on('addDir', kick)
  return w
}
