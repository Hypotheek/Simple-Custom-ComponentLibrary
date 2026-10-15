// Scans a target repository once and produces the shared RepoContext every analyzer reads
// from. Analyzers must not touch the filesystem themselves -- everything they need is here,
// so the four of them stay pure, fast, and safe to run independently of each other.

import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const EXCLUDED_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.nuxt', '.storybook-static', 'coverage'])
// Dotfiles are skipped by default, except these: analyzers look for them explicitly.
const ALLOWED_DOT_DIRS = new Set(['.storybook'])
const ALLOWED_DOT_FILE_RE = /^\.(mcp\.json|eslintrc(\.\w+)?|commitlintrc(\.\w+)?)$/i

function walk(dir, root, out) {
  let entries
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const entry of entries) {
    if (entry.name.startsWith('.')) {
      const allowed = entry.isDirectory() ? ALLOWED_DOT_DIRS.has(entry.name) : ALLOWED_DOT_FILE_RE.test(entry.name)
      if (!allowed) continue
    }
    if (EXCLUDED_DIRS.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full, root, out)
    } else {
      out.push(path.relative(root, full).split(path.sep).join('/'))
    }
  }
}

function readJsonSafe(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return null
  }
}

function readTextSafe(file) {
  try {
    return fs.readFileSync(file, 'utf8')
  } catch {
    return null
  }
}

// Prefer a file at the repository root, then one in the package directory, then anywhere else.
function findPreferred(files, test, packageDirRel) {
  const matches = files.filter(test)
  const depth = (f) => f.split('/').length
  return (
    matches.find((f) => !f.includes('/')) ||
    (packageDirRel ? matches.find((f) => path.posix.dirname(f) === packageDirRel) : null) ||
    matches.sort((a, b) => depth(a) - depth(b))[0] ||
    null
  )
}

// The package.json can live in a subfolder (Butlers-lib: src/web). Take the shallowest one.
function findPackageDirRel(files) {
  const candidates = files
    .filter((f) => path.posix.basename(f) === 'package.json')
    .sort((a, b) => a.split('/').length - b.split('/').length)
  if (!candidates.length) return null
  const dir = path.posix.dirname(candidates[0])
  return dir === '.' ? '' : dir
}

function detectFramework(pkg, files) {
  const deps = { ...(pkg?.dependencies || {}), ...(pkg?.devDependencies || {}), ...(pkg?.peerDependencies || {}) }
  if (deps.vue) return 'vue'
  if (deps.react || deps['react-dom']) return 'react'
  if (deps['@angular/core']) return 'angular'
  if (deps.lit || deps['lit-element'] || files.some((f) => f.includes('custom-elements.json'))) return 'web-components'
  if (deps.svelte) return 'svelte'
  return 'unknown'
}

function runGitLog(rootDir) {
  try {
    const isRepo = execFileSync('git', ['rev-parse', '--is-inside-work-tree'], { cwd: rootDir, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
    if (isRepo !== 'true') return null
  } catch {
    return null
  }
  try {
    const lastCommitIso = execFileSync('git', ['log', '-1', '--format=%cI'], { cwd: rootDir, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
    const totalCommits = parseInt(execFileSync('git', ['rev-list', '--count', 'HEAD'], { cwd: rootDir, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(), 10)
    const since90 = execFileSync('git', ['log', '--since=90.days', '--format=%H'], { cwd: rootDir, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
    const commitCountLast90Days = since90 ? since90.split('\n').length : 0
    const messagesSample = execFileSync('git', ['log', '-50', '--format=%s'], { cwd: rootDir, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim().split('\n').filter(Boolean)
    return {
      lastCommitDate: lastCommitIso || null,
      totalCommits: Number.isFinite(totalCommits) ? totalCommits : null,
      commitCountLast90Days,
      recentMessagesSample: messagesSample
    }
  } catch {
    return null
  }
}

const COMPONENT_FILE_RE = /\.(vue|jsx|tsx)$/
const STORY_FILE_RE = /\.(stories|story)\.[jt]sx?$|\.(stories|story)\.mdx$/
const TOKEN_FILE_RE = /(^|\/)(design-?tokens?|tokens|theme)\.(json|ya?ml|js|mjs|ts)$/i
const MANIFEST_FILE_RE = /(^|\/)(custom-elements\.json|web-types\.json|component-manifest\.json|categories\.mjs|categories\.js|components\.json)$/i
const MCP_FILE_RE = /(^|\/)\.mcp\.json$/i
const CHANGELOG_RE = /^changelog(\.md)?$/i
// Vue files that are not library components: the demo app, Storybook doc pages and examples.
const NON_COMPONENT_RE = /(^|\/)(docs|examples)\/|(^|\/)App\.vue$/
// Stories that document something other than a component (tokens, assets, directives, examples).
const NON_COMPONENT_STORY_RE = /(^|\/)stories\/(tokens|assets|directives|examples|docs)\//
// Ambient declarations (Vite env, module shims) say nothing about the components' own API.
const AMBIENT_DTS_NAME_RE = /(^|\/)(vite-env|env|global|shims?(-[\w-]+)?)\.d\.ts$/i

function isAmbientDeclaration(content) {
  if (content == null) return true
  const meaningful = content
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map((l) => l.replace(/\/\/.*$/, '').trim())
    .filter(Boolean)
  // Only `declare module ...` blocks and triple-slash references: a shim, not a component API.
  return meaningful.length === 0 || /^declare\s+module\b/.test(meaningful[0])
}

// Deprecation markers as they appear in comments: "@deprecated", "DEPRECATED", "Deprecated",
// "Obsolete". Only comments are searched, so a prop called `deprecated` does not count.
const DEPRECATION_RE = /(@deprecated\b|\bDEPRECATED\b|\bDeprecated\b|\bdeprecated\b|\bObsolete\b|\bobsolete\b)/
const SUCCESSOR_RE = /\b(?:use|gebruik|replaced by|vervangen door|superseded by)\s+`?<?([A-Z][A-Za-z0-9]+)/i

function commentsOf(content) {
  return (content.match(/\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->|\/\/[^\n]*/g) || []).join('\n')
}

function deprecationForm(marker) {
  if (marker === '@deprecated') return '@deprecated'
  if (/^obsolete$/i.test(marker)) return 'Obsolete'
  if (marker === 'DEPRECATED') return 'DEPRECATED'
  return 'Deprecated'
}

function componentBaseName(rel) {
  return path.posix.basename(rel).replace(/\.(vue|jsx|tsx)$/i, '')
}

// Successors are often named by their registered name (UFlex) while the file is Flex.vue.
function resolveComponentName(name, names) {
  const lower = new Map([...names].map((n) => [n.toLowerCase(), n]))
  return lower.get(name.toLowerCase()) || (/^U[A-Z]/.test(name) ? lower.get(name.slice(1).toLowerCase()) : null) || null
}

function scanDeprecations(absRoot, componentFiles) {
  const names = new Set(componentFiles.map(componentBaseName))
  const marked = []
  for (const rel of componentFiles) {
    const content = readTextSafe(path.join(absRoot, rel))
    if (!content) continue
    // Only look at the part before the props: a component-level marker sits above the
    // component, while "deprecated" inside the props block is about a single prop.
    const propsAt = content.search(/\bprops\s*:|defineProps/)
    const comments = commentsOf(propsAt > 0 ? content.slice(0, propsAt) : content)
    const m = comments.match(DEPRECATION_RE)
    if (!m) continue
    const after = comments.slice(m.index, m.index + 200)
    const succ = after.match(SUCCESSOR_RE)
    const successor = succ ? succ[1] : null
    marked.push({
      file: rel,
      name: componentBaseName(rel),
      form: deprecationForm(m[1]),
      successor,
      successorExists: successor ? Boolean(resolveComponentName(successor, names)) : false
    })
  }
  // Name + NameV2 (or V3...) side by side: the older one is probably superseded.
  const versionedPairs = []
  for (const n of names) {
    const v = n.match(/^(.+?)V(\d+)$/)
    if (!v) continue
    const older = Number(v[2]) === 2 ? v[1] : `${v[1]}V${Number(v[2]) - 1}`
    if (names.has(older)) versionedPairs.push({ older, newer: n })
  }
  const markedNames = new Set(marked.map((d) => d.name))
  const unmarkedOlderVersions = versionedPairs.filter((p) => !markedNames.has(p.older)).map((p) => p.older)
  return { marked, versionedPairs, unmarkedOlderVersions }
}

export function buildContext(rootDir) {
  const absRoot = path.resolve(rootDir)
  const files = []
  walk(absRoot, absRoot, files)

  const packageDirRel = findPackageDirRel(files)
  const pkg = packageDirRel === null ? null : readJsonSafe(path.join(absRoot, packageDirRel, 'package.json'))
  const readmeFile = findPreferred(files, (f) => /^readme(\.md)?$/i.test(path.posix.basename(f)), packageDirRel)
  const readmeContent = readmeFile ? readTextSafe(path.join(absRoot, readmeFile)) : null
  const changelogFile = findPreferred(files, (f) => CHANGELOG_RE.test(path.posix.basename(f)), packageDirRel)
  const changelogContent = changelogFile ? readTextSafe(path.join(absRoot, changelogFile)) : null

  const vueLike = files.filter((f) => COMPONENT_FILE_RE.test(f) && !STORY_FILE_RE.test(f) && !f.includes('/dist/'))
  // When the library keeps its components in a components/ folder, files outside it (demo
  // views, the playground app) are not part of the library and are not counted.
  const hasComponentsDir = vueLike.some((f) => /(^|\/)components\//.test(f))
  const isComponent = (f) => !NON_COMPONENT_RE.test(f) && (!hasComponentsDir || /(^|\/)components\//.test(f))
  const componentFiles = vueLike.filter(isComponent)
  const excludedNonComponentFiles = vueLike.filter((f) => !isComponent(f))
  const allStoryFiles = files.filter((f) => STORY_FILE_RE.test(f))
  const storyFiles = allStoryFiles.filter((f) => !NON_COMPONENT_STORY_RE.test(f))
  const designTokenFiles = files.filter((f) => TOKEN_FILE_RE.test(f))
  const manifestFiles = files.filter((f) => MANIFEST_FILE_RE.test(f))
  const mcpConfigFiles = files.filter((f) => MCP_FILE_RE.test(f))
  const allDeclarationFiles = files.filter((f) => f.endsWith('.d.ts'))
  const ambientDeclarationFiles = allDeclarationFiles.filter(
    (f) => AMBIENT_DTS_NAME_RE.test(f) || isAmbientDeclaration(readTextSafe(path.join(absRoot, f)))
  )
  const typeDeclarationFiles = allDeclarationFiles.filter((f) => !ambientDeclarationFiles.includes(f))
  const testFiles = files.filter((f) => /\.(test|spec)\.[jt]sx?$/.test(f))

  const hasTypeScript = files.some((f) => f.endsWith('.ts') || f.endsWith('.tsx')) || Boolean(pkg?.devDependencies?.typescript || pkg?.dependencies?.typescript)
  const hasStorybook = files.some((f) => f.startsWith('.storybook/') || f.includes('/.storybook/')) || Boolean(
    Object.keys({ ...(pkg?.devDependencies || {}), ...(pkg?.dependencies || {}) }).some((d) => d.startsWith('@storybook/'))
  )

  return {
    rootDir: absRoot,
    packageDir: packageDirRel,
    packageJson: pkg,
    allFiles: files,
    componentFiles,
    componentCount: componentFiles.length,
    excludedNonComponentFiles,
    detectedFramework: detectFramework(pkg, files),
    readmeFile,
    readmeContent,
    changelogFile,
    changelogContent,
    hasTypeScript,
    hasStorybook,
    storyFiles,
    allStoryFiles,
    designTokenFiles,
    manifestFiles,
    mcpConfigFiles,
    typeDeclarationFiles,
    ambientDeclarationFiles,
    deprecations: scanDeprecations(absRoot, componentFiles),
    testFiles,
    gitLog: runGitLog(absRoot)
  }
}
