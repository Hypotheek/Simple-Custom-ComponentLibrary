export function renderJson(matrix, meta) {
  return JSON.stringify({ meta, matrix }, null, 2)
}
