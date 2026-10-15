import { CRITERIA, DIMENSIONS, MAX_SCORE_PER_CELL, grade } from './rubric.mjs'

// Combines the four per-dimension analyzer outputs into one matrix: CRITERIA.length rows x
// DIMENSIONS.length columns, plus row/column/total subtotals and a qualitative grade at each level.
//
// A cell can be marked "niet van toepassing" (nvt: true) when it cannot be measured, for example
// without git history, or when the dimension has nothing to judge because the subject is absent
// (absence is already scored once, under beschikbaarheid). Such cells are shown, but left out of
// every score AND every maximum, so they neither raise nor lower the result.

export const NVT_LABEL = 'n.v.t.'

function cellMax(cell) {
  return cell.nvt ? 0 : MAX_SCORE_PER_CELL
}

function cellScore(cell) {
  return cell.nvt ? 0 : cell.score
}

export function aggregate(dimensionResults) {
  const byDimension = new Map(dimensionResults.map((d) => [d.dimensionId, d]))
  for (const dim of DIMENSIONS) {
    if (!byDimension.has(dim.id)) throw new Error(`Missing analyzer result for dimension "${dim.id}"`)
  }

  const cellsByCriterion = new Map(CRITERIA.map((c) => [c.id, {}]))
  for (const dim of DIMENSIONS) {
    const result = byDimension.get(dim.id)
    const rowsById = new Map(result.rows.map((r) => [r.criterionId, r]))
    for (const criterion of CRITERIA) {
      const row = rowsById.get(criterion.id)
      if (!row) throw new Error(`Analyzer for "${dim.id}" is missing a row for criterion "${criterion.id}"`)
      if (row.nvt) {
        // Keep the shape renderers expect (integer score), but make the status explicit.
        row.score = 0
        row.nvt = true
        if (row.oordeel && !row.oordeel.startsWith('Niet van toepassing')) row.oordeel = `Niet van toepassing: ${row.oordeel}`
      } else if (!Number.isInteger(row.score) || row.score < 0 || row.score > MAX_SCORE_PER_CELL) {
        throw new Error(`Analyzer for "${dim.id}", criterion "${criterion.id}": score must be an integer 0-${MAX_SCORE_PER_CELL}, got ${row.score}`)
      }
      cellsByCriterion.get(criterion.id)[dim.id] = row
    }
  }

  const rows = CRITERIA.map((criterion) => {
    const cells = cellsByCriterion.get(criterion.id)
    const score = DIMENSIONS.reduce((sum, dim) => sum + cellScore(cells[dim.id]), 0)
    const max = DIMENSIONS.reduce((sum, dim) => sum + cellMax(cells[dim.id]), 0)
    return {
      criterionId: criterion.id,
      label: criterion.label,
      omschrijving: criterion.omschrijving,
      cells,
      score,
      max,
      grade: max > 0 ? grade(score, max) : NVT_LABEL
    }
  })

  const columns = DIMENSIONS.map((dim) => {
    const result = byDimension.get(dim.id)
    const score = result.rows.reduce((sum, r) => sum + cellScore(r), 0)
    const max = result.rows.reduce((sum, r) => sum + cellMax(r), 0)
    return {
      dimensionId: dim.id,
      label: dim.label,
      score,
      max,
      grade: max > 0 ? grade(score, max) : NVT_LABEL
    }
  })

  const totalScore = columns.reduce((sum, c) => sum + c.score, 0)
  const totalMax = columns.reduce((sum, c) => sum + c.max, 0)
  const nvtCells = rows.reduce((n, r) => n + DIMENSIONS.filter((d) => r.cells[d.id].nvt).length, 0)

  return {
    rows,
    columns,
    totalScore,
    totalMax,
    nvtCells,
    totalGrade: totalMax > 0 ? grade(totalScore, totalMax) : NVT_LABEL
  }
}
