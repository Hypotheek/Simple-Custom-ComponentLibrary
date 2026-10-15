// Small, dependency-free helpers for reading Vue single-file components. They are heuristics
// (no real parser), so every analyzer that uses them reports its numbers as evidence.

const PASCAL_CASE_RE = /^[A-Z][A-Za-z0-9]*$/

export function isPascalCase(name) {
  return PASCAL_CASE_RE.test(name)
}

// Returns the text between the braces of the first `props: {` (Options API) or
// `defineProps({` / `withDefaults(defineProps({` call, or null when there is none.
function propsObjectText(content) {
  const m = content.match(/\bprops\s*:\s*\{|defineProps\s*\(\s*\{/)
  if (!m) return null
  let depth = 0
  const start = m.index + m[0].length - 1
  for (let i = start; i < content.length; i++) {
    const ch = content[i]
    if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) return content.slice(start + 1, i)
    }
  }
  return null
}

// Top-level keys of the props object, e.g. ['iconName', 'iconsize', 'disabled'].
export function extractPropNames(content) {
  const body = propsObjectText(content || '')
  if (body == null) return []
  const names = []
  let depth = 0
  let token = ''
  for (let i = 0; i < body.length; i++) {
    const ch = body[i]
    if (ch === '{' || ch === '[' || ch === '(') depth++
    else if (ch === '}' || ch === ']' || ch === ')') depth--
    else if (depth === 0 && ch === ':') {
      const key = token.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '').trim().replace(/^['"]|['"]$/g, '')
      if (/^[A-Za-z_$][\w$-]*$/.test(key)) names.push(key)
      token = ''
      continue
    } else if (depth === 0 && ch === ',') {
      token = ''
      continue
    }
    if (depth === 0) token += ch
  }
  return names
}

// Words that often appear glued together in lower case (iconsize, backgroundcolor). A prop that is
// written entirely in lower case but consists of two or more of these words breaks camelCase.
const COMMON_WORDS = ['icon', 'size', 'color', 'background', 'border', 'radius', 'name', 'text', 'label', 'width', 'height', 'value', 'type', 'shadow', 'title', 'max', 'min', 'show', 'is', 'has', 'font', 'line', 'item', 'items', 'data', 'class', 'style', 'model', 'image', 'url', 'id', 'key', 'list', 'row', 'col', 'column']

function isGluedWords(name, words = COMMON_WORDS, depth = 0) {
  if (name === '') return depth >= 2
  for (const w of words) {
    if (name.startsWith(w) && isGluedWords(name.slice(w.length), words, depth + 1)) return true
  }
  return false
}

// 'camel' for iconName / disabled, 'glued' for iconsize, 'snake' / 'kebab' for the rest.
export function propNameStyle(name) {
  if (name.includes('_')) return 'snake'
  if (name.includes('-')) return 'kebab'
  if (/^[a-z][a-z0-9]*$/.test(name) && isGluedWords(name)) return 'glued'
  if (/^[a-z][A-Za-z0-9]*$/.test(name)) return 'camel'
  return 'other'
}
