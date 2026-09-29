import { CRITERIA, DIMENSIONS, MAX_SCORE_PER_CELL, MAX_SCORE_PER_CRITERION, MAX_SCORE_PER_DIMENSION, MAX_TOTAL_SCORE, grade } from './rubric.mjs'

// Combines the four per-dimension analyzer outputs into one matrix: CRITERIA.length rows x
// DIMENSIONS.length columns, plus row/column/total subtotals and a qualitative grade at each level.

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
      if (!Number.isInteger(row.score) || row.score < 0 || row.score > MAX_SCORE_PER_CELL) {
        throw new Error(`Analyzer for "${dim.id}", criterion "${criterion.id}": score must be an integer 0-${MAX_SCORE_PER_CELL}, got ${row.score}`)
      }
      cellsByCriterion.get(criterion.id)[dim.id] = row
    }
  }

  const rows = CRITERIA.map((criterion) => {
    const cells = cellsByCriterion.get(criterion.id)
    const score = DIMENSIONS.reduce((sum, dim) => sum + cells[dim.id].score, 0)
    return {
      criterionId: criterion.id,
      label: criterion.label,
      omschrijving: criterion.omschrijving,
      cells,
      score,
      max: MAX_SCORE_PER_CRITERION,
      grade: grade(score, MAX_SCORE_PER_CRITERION)
    }
  })

  const columns = DIMENSIONS.map((dim) => {
    const result = byDimension.get(dim.id)
    const score = result.rows.reduce((sum, r) => sum + r.score, 0)
    return {
      dimensionId: dim.id,
      label: dim.label,
      score,
      max: MAX_SCORE_PER_DIMENSION,
      grade: grade(score, MAX_SCORE_PER_DIMENSION)
    }
  })

  const totalScore = columns.reduce((sum, c) => sum + c.score, 0)

  return {
    rows,
    columns,
    totalScore,
    totalMax: MAX_TOTAL_SCORE,
    totalGrade: grade(totalScore, MAX_TOTAL_SCORE)
  }
}
