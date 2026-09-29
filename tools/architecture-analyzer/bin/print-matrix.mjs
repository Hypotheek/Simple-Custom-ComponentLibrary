#!/usr/bin/env node
// Prints the concept matrix itself (the theoretical framework, unscored) straight from
// rubric.mjs -- this is the deelvraag-2 deliverable in isolation, with no target repo needed.
import { CRITERIA, DIMENSIONS, SCORE_LABELS } from '../src/rubric.mjs'

const args = process.argv.slice(2)
const asJson = args.includes('--json')

if (asJson) {
  console.log(JSON.stringify({ dimensions: DIMENSIONS, scoreLabels: SCORE_LABELS, criteria: CRITERIA }, null, 2))
  process.exit(0)
}

const lines = []
lines.push('# Conceptmatrix: AI-geschiktheidsbeoordeling van component- en designbibliotheken')
lines.push('')
lines.push('Score per cel: 0 = ' + SCORE_LABELS[0] + ', 1 = ' + SCORE_LABELS[1] + ', 2 = ' + SCORE_LABELS[2] + ', 3 = ' + SCORE_LABELS[3] + '.')
lines.push('')
for (const dim of DIMENSIONS) {
  lines.push(`**${dim.label}** — ${dim.vraag}`)
  lines.push('')
}
lines.push('## Overzicht')
lines.push('')
const header = ['Onderdeel', ...DIMENSIONS.map((d) => d.label)]
lines.push(`| ${header.join(' | ')} |`)
lines.push(`| ${header.map(() => '---').join(' | ')} |`)
for (const c of CRITERIA) {
  lines.push(`| ${c.label} | ${DIMENSIONS.map(() => '—').join(' | ')} |`)
}
lines.push('')
lines.push('## Volledige rubric per onderdeel')
lines.push('')
for (const c of CRITERIA) {
  lines.push(`### ${c.label}`)
  lines.push('')
  lines.push(c.omschrijving)
  lines.push('')
  for (const dim of DIMENSIONS) {
    lines.push(`**${dim.label}**`)
    lines.push('')
    c.rubric[dim.id].forEach((text, score) => lines.push(`- **${score}** (${SCORE_LABELS[score]}): ${text}`))
    lines.push('')
  }
}
console.log(lines.join('\n'))
