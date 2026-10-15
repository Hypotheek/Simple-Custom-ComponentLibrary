import { DIMENSIONS, SCORE_LABELS } from '../rubric.mjs'

const NVT = 'n.v.t.'

function scoreCell(cell) {
  return cell.nvt ? `${NVT} (niet meetbaar)` : `${cell.score} (${SCORE_LABELS[cell.score]})`
}

function measuredCells(matrix, dimId) {
  return matrix.rows.filter((r) => !r.cells[dimId].nvt).length
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
  lines.push(`| Dimensie | Score | Gemeten cellen | Oordeel |`)
  lines.push(`| --- | --- | --- | --- |`)
  for (const col of matrix.columns) {
    lines.push(`| ${col.label} | ${col.score} / ${col.max} | ${measuredCells(matrix, col.dimensionId)} van ${matrix.rows.length} | ${col.grade} |`)
  }
  if (matrix.nvtCells) {
    lines.push('')
    lines.push(`${matrix.nvtCells} cel(len) zijn n.v.t.: ze zijn niet te meten (bv. zonder git-geschiedenis) of er is niets om te beoordelen omdat het onderdeel ontbreekt. Ze tellen niet mee in de score en niet in het maximum.`)
  }
  lines.push('')
  lines.push(`## Matrix`)
  lines.push('')
  const header = ['Onderdeel', ...DIMENSIONS.map((d) => d.label), 'Totaal', 'Oordeel']
  lines.push(`| ${header.join(' | ')} |`)
  lines.push(`| ${header.map(() => '---').join(' | ')} |`)
  for (const row of matrix.rows) {
    const cellScores = DIMENSIONS.map((d) => (row.cells[d.id].nvt ? NVT : row.cells[d.id].score))
    const total = row.max > 0 ? `${row.score} / ${row.max}` : NVT
    lines.push(`| ${row.label} | ${cellScores.join(' | ')} | ${total} | ${row.grade} |`)
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
      lines.push(`**${dim.label}: ${scoreCell(cell)}**`)
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
