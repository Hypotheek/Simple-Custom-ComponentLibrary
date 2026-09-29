// Scans a target repository once and produces the shared RepoContext every analyzer reads
// from. Analyzers must not touch the filesystem themselves -- everything they need is here,
// so the four of them stay pure, fast, and safe to run independently of each other.

import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const EXCLUDED_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.nuxt', '.storybook-static', 'coverage'])

function walk(dir, root, out) {
  let entries
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const entry of entries) {
    if (entry.name.startsWith('.') && entry.name !== '.storybook') continue
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

function findFile(files, names) {
  const lower = names.map((n) => n.toLowerCase())
  return files.find((f) => lower.includes(path.basename(f).toLowerCase())) || null
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

export function buildContext(rootDir) {
  const absRoot = path.resolve(rootDir)
  const files = []
  walk(absRoot, absRoot, files)

  const pkg = readJsonSafe(path.join(absRoot, 'package.json'))
  const readmeFile = findFile(files, ['README.md', 'README'])
  const readmeContent = readmeFile ? readTextSafe(path.join(absRoot, readmeFile)) : null
  const changelogFile = files.find((f) => CHANGELOG_RE.test(path.basename(f))) || null
  const changelogContent = changelogFile ? readTextSafe(path.join(absRoot, changelogFile)) : null

  const componentFiles = files.filter((f) => COMPONENT_FILE_RE.test(f) && !STORY_FILE_RE.test(f) && !f.includes('/dist/'))
  const storyFiles = files.filter((f) => STORY_FILE_RE.test(f))
  const designTokenFiles = files.filter((f) => TOKEN_FILE_RE.test(f))
  const manifestFiles = files.filter((f) => MANIFEST_FILE_RE.test(f))
  const mcpConfigFiles = files.filter((f) => MCP_FILE_RE.test(f))
  const typeDeclarationFiles = files.filter((f) => f.endsWith('.d.ts'))
  const testFiles = files.filter((f) => /\.(test|spec)\.[jt]sx?$/.test(f))

  const hasTypeScript = files.some((f) => f.endsWith('.ts') || f.endsWith('.tsx')) || Boolean(pkg?.devDependencies?.typescript || pkg?.dependencies?.typescript)
  const hasStorybook = files.some((f) => f.startsWith('.storybook/')) || Boolean(
    Object.keys({ ...(pkg?.devDependencies || {}), ...(pkg?.dependencies || {}) }).some((d) => d.startsWith('@storybook/'))
  )

  return {
    rootDir: absRoot,
    packageJson: pkg,
    allFiles: files,
    componentFiles,
    componentCount: componentFiles.length,
    detectedFramework: detectFramework(pkg, files),
    readmeFile,
    readmeContent,
    changelogFile,
    changelogContent,
    hasTypeScript,
    hasStorybook,
    storyFiles,
    designTokenFiles,
    manifestFiles,
    mcpConfigFiles,
    typeDeclarationFiles,
    testFiles,
    gitLog: runGitLog(absRoot)
  }
}
