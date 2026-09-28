// Shared install helpers for the CLI and the postinstall hook. This package ships no
// generated docs, no custom MCP server, and no runtime CLI functionality: the library's
// own Storybook instance (with @storybook/addon-mcp) is the sole reference. These
// functions only install the skill and point .mcp.json at that Storybook's /mcp endpoint.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
export const SERVER_NAME = 'simple-vue-components-storybook'
export const DEFAULT_STORYBOOK_URL = 'http://localhost:6006/mcp'

function mcpUrl() {
  return process.env.SIMPLE_VUE_COMPONENTS_STORYBOOK_URL || DEFAULT_STORYBOOK_URL
}

const SKILL_VERSION_MARKER = '.simple-vue-components-version'

function skillSourceNames() {
  const skillsRoot = path.join(root, 'skills')
  if (!fs.existsSync(skillsRoot)) return []
  return fs.readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
}

function installOneSkill(skillsBaseDir, name) {
  const source = path.join(root, 'skills', name)
  const target = path.join(skillsBaseDir, name)
  const existed = fs.existsSync(target)
  if (existed) {
    const marker = path.join(target, SKILL_VERSION_MARKER)
    if (fs.existsSync(marker) && fs.readFileSync(marker, 'utf8').trim() === pkg.version) return { name, action: 'unchanged', target }
  }
  fs.rmSync(target, { recursive: true, force: true })
  fs.mkdirSync(skillsBaseDir, { recursive: true })
  fs.cpSync(source, target, { recursive: true })
  fs.writeFileSync(path.join(target, SKILL_VERSION_MARKER), `${pkg.version}\n`)
  return { name, action: existed ? 'updated' : 'installed', target }
}

// Installs every skill folder under skills/ (simple-vue-components plus the
// build-ui-from-* skills) into skillsBaseDir/<name>, each independently versioned.
export function installSkillTo(skillsBaseDir) {
  const names = skillSourceNames()
  if (!names.length) return { action: 'skipped', reason: 'This package does not include any skill folders.', target: skillsBaseDir, skills: [] }
  const skills = names.map((name) => installOneSkill(skillsBaseDir, name))
  const changed = skills.filter((s) => s.action !== 'unchanged')
  const action = changed.length === 0 ? 'unchanged' : changed.some((s) => s.action === 'installed') ? 'installed' : 'updated'
  return { action, target: skillsBaseDir, skills }
}

export function installSkill(projectDir) {
  return installSkillTo(path.join(projectDir, '.claude', 'skills'))
}

const AGENT_DOC_FILES = ['CLAUDE.md', 'AGENTS.md']

// Copies CLAUDE.md and AGENTS.md into the consumer project's root, but only ones that
// don't already exist there -- unlike the skill/MCP config, these are general-purpose
// files a project may already own for unrelated reasons, so this never overwrites one.
export function installAgentDocs(projectDir) {
  const source = path.join(root, 'templates')
  if (!fs.existsSync(source)) return { action: 'skipped', reason: 'This package does not include the templates folder.', results: [] }
  const results = AGENT_DOC_FILES.map((file) => {
    const target = path.join(projectDir, file)
    if (fs.existsSync(target)) return { file, action: 'skipped', reason: `${file} already exists` }
    fs.copyFileSync(path.join(source, file), target)
    return { file, action: 'added', target }
  })
  const added = results.filter((r) => r.action === 'added')
  return { action: added.length ? 'added' : 'skipped', reason: added.length ? undefined : 'CLAUDE.md and AGENTS.md already exist', results }
}

export function installMcpConfig(projectDir) {
  const file = path.join(projectDir, '.mcp.json')
  const fileExisted = fs.existsSync(file)
  let config = {}
  if (fileExisted) {
    try {
      config = JSON.parse(fs.readFileSync(file, 'utf8'))
    } catch {
      return { action: 'skipped', reason: `${file} exists but is not valid JSON.` }
    }
  }
  const entry = { type: 'http', url: mcpUrl() }
  const existing = config.mcpServers?.[SERVER_NAME]
  if (existing && JSON.stringify(existing) === JSON.stringify(entry)) return { action: 'unchanged', target: file }
  config.mcpServers = { ...config.mcpServers, [SERVER_NAME]: entry }
  fs.writeFileSync(file, `${JSON.stringify(config, null, 2)}\n`)
  return { action: existing ? 'updated' : 'added', target: file, url: entry.url }
}
