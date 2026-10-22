#!/usr/bin/env node
// Linia statusu Claude Code dla Pulpitu. Claude Code podaje na wejściu JSON z limitami
// (rate_limits.five_hour, rate_limits.seven_day), kontekstem i modelem. Zapisujemy go obok,
// w pulpit-limity.json, a w terminalu pokazujemy krótką linię.
const fs = require('node:fs')
const path = require('node:path')
let raw = ''
process.stdin.on('data', (c) => (raw += c))
process.stdin.on('end', () => {
  let d = {}
  try { d = JSON.parse(raw) } catch {}
  try {
    fs.writeFileSync(path.join(__dirname, 'pulpit-limity.json'), JSON.stringify({ zapisano: new Date().toISOString(), ...d }, null, 2))
  } catch {}
  const rl = d.rate_limits || {}
  const p = (w) => (w && typeof w.used_percentage === 'number' ? `${Math.round(w.used_percentage)}%` : '-')
  const ctx = d.context_window && typeof d.context_window.used_percentage === 'number' ? `${Math.round(d.context_window.used_percentage)}%` : '-'
  const model = (d.model && d.model.display_name) || ''
  process.stdout.write(`${model}  5h ${p(rl.five_hour)}  tydzień ${p(rl.seven_day)}  kontekst ${ctx}`)
})
