// Testy parsera na prawdziwych plikach Kamila (tests/fixtures). Uruchom: npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  parseMarki, parseAktualne, brandKeys, toggleTodoLine, parseIncome, parseQuotes,
  setFrontMatterValue, taskFromFile, findDate, monthKey, parseAmount
} from '../src/main/workspace/parse.ts'

const fx = (f: string) => readFileSync(new URL(`./fixtures/${f}`, import.meta.url), 'utf8')
const today = new Date(2026, 9, 22)

test('MARKI.md: wszystkie marki z kolorem i statusem', () => {
  const rows = parseMarki(fx('MARKI.md'))
  assert.equal(rows.length, 16)
  const aw = rows.find((r) => r.id === 'AW_PARTS')!
  assert.equal(aw.status, 'aktywna')
  assert.equal(aw.color, '#E31C25')
  assert.equal(rows.find((r) => r.id === 'MENTOR_BRIDGE')!.color, '#1B1C1C')
  assert.equal(rows.find((r) => r.id === 'GREEN_ESSENCE')!.status, 'czeka')
})

test('AKTUALNE_WSPOLPRACE.md: zadania, w trakcie, czekam, dziennik', () => {
  const rows = parseMarki(fx('MARKI.md'))
  const keys = brandKeys(rows.map((r) => ({ id: r.id.toUpperCase(), name: r.name })))
  const a = parseAktualne(fx('AKTUALNE_WSPOLPRACE.md'), today, keys)
  assert.equal(a.lastUpdate, '2026-10-22')
  assert.equal(a.todos.length, 11)
  assert.equal(a.todos[0].label, 'Rue de Skin (Brygida)')
  assert.equal(a.todos[0].brandId, 'RUE_DE_SKIN')
  assert.equal(a.todos.find((t) => t.label === 'ZOX')!.brandId, 'ZOX')
  assert.ok(a.active.length >= 6)
  const green = a.waiting.find((w) => w.client === 'Green Essence')!
  assert.equal(green.since, '2026-10-09')
  assert.equal(green.daysSilent, 13)
  assert.equal(a.inquiries.length, 1)
  assert.ok(a.log.some((l) => l.date === '2026-10-21'))
})

test('odhaczanie zmienia tylko jedną linię', () => {
  const md = fx('AKTUALNE_WSPOLPRACE.md')
  const a = parseAktualne(md, today)
  const t = a.todos[1]
  const next = toggleTodoLine(md, t.line, t.text)!
  const diff = next.split('\n').filter((l, i) => l !== md.split('\n')[i])
  assert.equal(diff.length, 1)
  assert.match(diff[0], /^- \[x\]/)
  assert.equal(toggleTodoLine(md, t.line, 'zupelnie inny tekst'), null)
})

test('ZAROBKI.md: miesiące z nagłówków, sumy pomijane', () => {
  const md = `# ZAROBKI\n\n## Październik 2026\n| data | klient | zlecenie | kwota | płatność |\n|---|---|---|---|---|\n| 2026-10-15 | Better and More | ZAD_03 | 350 zł | do rozliczenia |\n| 2026-10-22 | Profumo Labo | ZAD_02 | 100 | z kolejną fakturą |\n| | Suma | | 450 zł | |\n`
  const inc = parseIncome(md)
  assert.equal(inc.length, 2)
  assert.equal(inc[0].month, '2026-10')
  assert.equal(inc[0].amount, 350)
})

test('WYCENY.md: wiersz na zlecenie', () => {
  const md = `| id | data | marka | zadanie | godziny | kwota |\n|---|---|---|---|---|---|\n| 2026-002 | 2026-10-16 | DPPG | kalendarz Niemiec | 42-53 | 1 900 zł |\n`
  const q = parseQuotes(md)
  assert.equal(q[0].id, '2026-002')
  assert.equal(q[0].amount, 1900)
})

test('ZADANIE.md: YAML i zmiana statusu bez ruszania reszty', () => {
  const md = `---\nstatus: w_trakcie\ntermin: 2026-11-10\nkwota: 600\n---\n# ZAD_02\nTreść`
  const t = taskFromFile('RUE_DE_SKIN', 'ZAD_02_karty_produktow_i_strona_BF', '/x', md)
  assert.equal(t.title, 'karty produktow i strona BF')
  assert.equal(t.deadline, '2026-11-10')
  assert.equal(t.amount, 600)
  const next = setFrontMatterValue(md, 'status', 'do_akceptacji')
  assert.match(next, /status: do_akceptacji/)
  assert.ok(next.endsWith('# ZAD_02\nTreść'))
})

test('daty i kwoty', () => {
  assert.equal(findDate('wysłana 09.10, przypomnienie 19.10', today), '2026-10-09')
  assert.equal(findDate('na 27.12', today), '2025-12-27')
  assert.equal(monthKey('Wrzesień 2026'), '2026-09')
  assert.equal(parseAmount('4 800,50 zł'), 4800.5)
})
