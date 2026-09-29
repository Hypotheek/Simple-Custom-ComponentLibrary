import { DIMENSIONS, SCORE_LABELS } from '../rubric.mjs'

const SCORE_COLORS = ['#dc2626', '#f59e0b', '#84cc16', '#16a34a']

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}

function scoreBadge(score) {
  return `<span class="badge" style="background:${SCORE_COLORS[score]}">${score}</span>`
}

export function renderHtml(matrix, meta) {
  const matrixRows = matrix.rows.map((row) => {
    const cells = DIMENSIONS.map((d) => `<td class="cell">${scoreBadge(row.cells[d.id].score)}</td>`).join('')
    return `<tr><th scope="row">${escapeHtml(row.label)}</th>${cells}<td class="cell total">${row.score} / ${row.max}</td><td class="grade">${escapeHtml(row.grade)}</td></tr>`
  }).join('\n')

  const detailSections = matrix.rows.map((row) => {
    const dimBlocks = DIMENSIONS.map((d) => {
      const cell = row.cells[d.id]
      const evidence = cell.evidence?.length
        ? `<ul>${cell.evidence.map((e) => `<li>${escapeHtml(e)}</li>`).join('')}</ul>`
        : ''
      return `<div class="dim-block"><h4>${escapeHtml(d.label)} ${scoreBadge(cell.score)} <span class="score-label">${escapeHtml(SCORE_LABELS[cell.score])}</span></h4><p>${escapeHtml(cell.oordeel)}</p>${evidence}</div>`
    }).join('\n')
    return `<section class="criterion"><h3>${escapeHtml(row.label)}</h3><p class="omschrijving">${escapeHtml(row.omschrijving)}</p>${dimBlocks}</section>`
  }).join('\n')

  const summaryRows = matrix.columns.map((c) => `<tr><td>${escapeHtml(c.label)}</td><td>${c.score} / ${c.max}</td><td>${escapeHtml(c.grade)}</td></tr>`).join('\n')

  return `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<title>Architectuuranalyse met AI-geschiktheidsbeoordeling</title>
<style>
:root { color-scheme: light dark; }
body { font-family: system-ui, -apple-system, Segoe UI, sans-serif; max-width: 960px; margin: 2rem auto; padding: 0 1rem; line-height: 1.5; }
h1 { margin-bottom: 0.25rem; }
.meta { color: #666; margin-bottom: 1.5rem; }
.meta div { margin: 0.1rem 0; }
.table-wrap { overflow-x: auto; margin: 1rem 0; }
table { border-collapse: collapse; width: 100%; margin: 0; }
th, td { border: 1px solid #ddd; padding: 0.5rem 0.6rem; text-align: left; font-size: 0.92rem; }
thead th { background: #f4f4f5; }
.cell { text-align: center; }
.total { font-weight: 600; }
.badge { display: inline-block; min-width: 1.4rem; padding: 0.1rem 0.4rem; border-radius: 999px; color: white; font-weight: 600; text-align: center; }
.score-label { color: #666; font-weight: normal; font-size: 0.85rem; }
.criterion { margin: 2rem 0; padding-top: 1rem; border-top: 1px solid #eee; }
.omschrijving { color: #555; font-style: italic; }
.dim-block { margin: 0.75rem 0; }
.dim-block h4 { margin-bottom: 0.25rem; }
.dim-block ul { margin: 0.25rem 0; padding-left: 1.25rem; color: #444; }
.total-score { font-size: 1.3rem; font-weight: 700; margin: 0.5rem 0 1rem; }
</style>
</head>
<body>
<h1>Architectuuranalyse met AI-geschiktheidsbeoordeling</h1>
<div class="meta">
<div><strong>Bibliotheek:</strong> ${escapeHtml(meta.name || meta.rootDir)}</div>
<div><strong>Pad:</strong> ${escapeHtml(meta.rootDir)}</div>
<div><strong>Gedetecteerd framework:</strong> ${escapeHtml(meta.detectedFramework)}</div>
<div><strong>Aantal componenten:</strong> ${meta.componentCount}</div>
<div><strong>Gegenereerd op:</strong> ${escapeHtml(meta.generatedAt)}</div>
</div>
<div class="total-score">${matrix.totalScore} / ${matrix.totalMax} — ${escapeHtml(matrix.totalGrade)}</div>
<div class="table-wrap"><table>
<thead><tr><th>Dimensie</th><th>Score</th><th>Oordeel</th></tr></thead>
<tbody>${summaryRows}</tbody>
</table></div>
<h2>Matrix</h2>
<div class="table-wrap"><table>
<thead><tr><th>Onderdeel</th>${DIMENSIONS.map((d) => `<th>${escapeHtml(d.label)}</th>`).join('')}<th>Totaal</th><th>Oordeel</th></tr></thead>
<tbody>${matrixRows}</tbody>
</table></div>
<h2>Toelichting per onderdeel</h2>
${detailSections}
</body>
</html>
`
}
