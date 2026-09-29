import { DIMENSIONS, SCORE_LABELS } from '../rubric.mjs'

function scoreCell(score) {
  return `${score} (${SCORE_LABELS[score]})`
}

export function renderMarkdown(matrix, meta) {
  const lines = []
  lines.push(`# Architectuuranalyse met AI-geschiktheidsbeoordeling`)
  lines.push('')
  lines.push(`**Bibliotheek:** ${meta.name || meta.rootDir}`)
  lines.push(`**Pad:** \`${meta.rootDir}\``)
  lines.push(`**Gedetecteerd framework:** ${meta.detectedFramework}`)
  lines.push(`**Aantal componenten:** ${meta.componentCount}`)
  lines.push(`**Gegenereerd op:** ${meta.generatedAt}`)
  lines.push('')
  lines.push(`## Totaalscore`)
  lines.push('')
  lines.push(`**${matrix.totalScore} / ${matrix.totalMax}** — ${matrix.totalGrade}`)
  lines.push('')
  lines.push(`| Dimensie | Score | Oordeel |`)
  lines.push(`| --- | --- | --- |`)
  for (const col of matrix.columns) {
    lines.push(`| ${col.label} | ${col.score} / ${col.max} | ${col.grade} |`)
  }
  lines.push('')
  lines.push(`## Matrix`)
  lines.push('')
  const header = ['Onderdeel', ...DIMENSIONS.map((d) => d.label), 'Totaal', 'Oordeel']
  lines.push(`| ${header.join(' | ')} |`)
  lines.push(`| ${header.map(() => '---').join(' | ')} |`)
  for (const row of matrix.rows) {
    const cellScores = DIMENSIONS.map((d) => row.cells[d.id].score)
    lines.push(`| ${row.label} | ${cellScores.join(' | ')} | ${row.score} / ${row.max} | ${row.grade} |`)
  }
  lines.push('')
  lines.push(`## Toelichting per onderdeel`)
  lines.push('')
  for (const row of matrix.rows) {
    lines.push(`### ${row.label}`)
    lines.push('')
    lines.push(row.omschrijving)
    lines.push('')
    for (const dim of DIMENSIONS) {
      const cell = row.cells[dim.id]
      lines.push(`**${dim.label}: ${scoreCell(cell.score)}**`)
      lines.push('')
      lines.push(cell.oordeel)
      if (cell.evidence?.length) {
        lines.push('')
        for (const e of cell.evidence) lines.push(`- ${e}`)
      }
      lines.push('')
    }
  }
  return lines.join('\n')
}
