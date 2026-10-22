// Podgląd interfejsu w zwykłej przeglądarce, na danych przykładowych (bez Electrona).
// Wynik: dist-preview/index.html jako jeden plik.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  root: 'src/renderer',
  plugins: [react(), viteSingleFile()],
  build: { outDir: '../../dist-preview', emptyOutDir: true }
})
