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

export function installSkillTo(skillsBaseDir) {
  const source = path.join(root, 'skills', 'simple-vue-components')
  if (!fs.existsSync(source)) return { action: 'skipped', reason: 'This package does not include the skill folder.' }
  const target = path.join(skillsBaseDir, 'simple-vue-components')
  const existed = fs.existsSync(target)
  if (existed) {
    const marker = path.join(target, SKILL_VERSION_MARKER)
    if (fs.existsSync(marker) && fs.readFileSync(marker, 'utf8').trim() === pkg.version) return { action: 'unchanged', target }
  }
  fs.rmSync(target, { recursive: true, force: true })
  fs.mkdirSync(skillsBaseDir, { recursive: true })
  fs.cpSync(source, target, { recursive: true })
  fs.writeFileSync(path.join(target, SKILL_VERSION_MARKER), `${pkg.version}\n`)
  return { action: existed ? 'updated' : 'installed', target }
}

export function installSkill(projectDir) {
  return installSkillTo(path.join(projectDir, '.claude', 'skills'))
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
