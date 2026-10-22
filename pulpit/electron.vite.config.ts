import { resolve } from 'node:path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        // mcp.ts to osobny serwer MCP uruchamiany przez Claude Desktop (npm run mcp)
        input: { index: resolve('src/main/index.ts'), mcp: resolve('src/main/mcp/server.ts') }
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    root: 'src/renderer',
    plugins: [react()]
  }
})
