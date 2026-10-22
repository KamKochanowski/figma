// Serwer MCP Pulpitu: daje Claude Desktop (i każdemu klientowi MCP) dostęp do danych Pulpitu
// tymi samymi funkcjami, których używa aplikacja. Tylko odczyt plus odhaczanie listy na dziś.
// Konfiguracja w Claude Desktop: README.md, sekcja „Pulpit w Claude Desktop”.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { join } from 'node:path'
import { homedir } from 'node:os'
import { z } from 'zod'
import { scanWorkspace, toggleTodo } from '../workspace/scan'

const root = process.env.PULPIT_ROOT ?? join(homedir(), 'Desktop', 'PROJEKTY GRAFICZNE')
const server = new McpServer({ name: 'pulpit', version: '0.1.0' })
const text = (v: unknown): { content: { type: 'text'; text: string }[] } => ({
  content: [{ type: 'text', text: typeof v === 'string' ? v : JSON.stringify(v, null, 2) }]
})

server.registerTool(
  'pulpit_dzis',
  { description: 'Lista na dziś z AKTUALNE_WSPOLPRACE.md, klienci, na których czekamy, i ostatnie wpisy z dziennika.' },
  async () => {
    const ws = await scanWorkspace(root)
    return text({ ostatnia_aktualizacja: ws.lastUpdate, do_zrobienia: ws.todos.filter((t) => !t.done), czekam: ws.waiting, zapytania: ws.inquiries, dziennik: ws.log.slice(0, 10) })
  }
)

server.registerTool(
  'pulpit_marki',
  { description: 'Wszystkie marki: status, źródło (Useme, agencja, bezpośrednio), ostatnie zadanie, kolor.' },
  async () => text((await scanWorkspace(root)).brands.map(({ meta: _m, ...b }) => b))
)

server.registerTool(
  'pulpit_zadania',
  { description: 'Zadania jednej marki albo wszystkie, ze statusem i terminem z ZADANIE.md.', inputSchema: { marka: z.string().optional() } },
  async ({ marka }) => {
    const ws = await scanWorkspace(root)
    return text(ws.tasks.filter((t) => !marka || t.brandId.toLowerCase().includes(marka.toLowerCase())).map(({ meta: _m, ...t }) => t))
  }
)

server.registerTool(
  'pulpit_zarobki',
  { description: 'Zarobki z ZAROBKI.md, opcjonalnie jeden miesiąc RRRR-MM.', inputSchema: { miesiac: z.string().optional() } },
  async ({ miesiac }) => {
    const inc = (await scanWorkspace(root)).income.filter((i) => !miesiac || i.month === miesiac)
    return text({ suma: inc.reduce((s, i) => s + i.amount, 0), wpisy: inc })
  }
)

server.registerTool(
  'pulpit_odhacz',
  { description: 'Odhacza albo przywraca wpis z listy na dziś (id z pulpit_dzis). Przed zapisem robi kopię pliku.', inputSchema: { id: z.string() } },
  async ({ id }) => {
    const ws = await scanWorkspace(root)
    await toggleTodo(root, ws, id)
    return text('Zrobione.')
  }
)

void server.connect(new StdioServerTransport())
