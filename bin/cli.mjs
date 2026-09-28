#!/usr/bin/env node
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import * as lib from './lib.mjs'

const { pkg } = lib

const args = process.argv.slice(2)
const command = args[0]
const flags = { global: false, dir: '' }
for (let i = 1; i < args.length; i++) {
  if (args[i] === '--global') flags.global = true
  else if (args[i] === '--dir') flags.dir = args[++i] || ''
}

function fail(message) {
  console.error(message)
  process.exit(1)
}

function skillBase() {
  return flags.dir ? path.resolve(flags.dir) : flags.global ? path.join(os.homedir(), '.claude', 'skills') : path.join(process.cwd(), '.claude', 'skills')
}

function skill() {
  const result = lib.installSkillTo(skillBase())
  if (result.action === 'skipped') fail(result.reason)
  const names = result.skills.map((s) => s.name).join(', ')
  const count = result.skills.reduce((sum, s) => sum + fs.readdirSync(s.target, { recursive: true }).filter((f) => fs.statSync(path.join(s.target, f)).isFile()).length, 0)
  const verb = result.action === 'updated' ? 'Updated' : result.action === 'unchanged' ? 'Already up to date' : 'Installed'
  console.log(`${verb} ${result.skills.length} skill(s) (${names}; ${count} files total, package v${pkg.version}) at ${result.target}`)
}

function docs() {
  const dir = process.cwd()
  const result = lib.installAgentDocs(dir)
  for (const r of result.results) {
    console.log(r.action === 'added' ? `Added ${r.file}` : `Skipped ${r.file} (${r.reason})`)
  }
}

function reportMcpInstall(result) {
  if (result.action === 'skipped') return fail(`${result.reason} Fix it or delete it, then run this again. Nothing was changed.`)
  if (result.action === 'unchanged') return console.log(`Already configured in ${result.target}`)
  console.log(`${result.action === 'updated' ? 'Updated' : 'Added'} "${lib.SERVER_NAME}" in ${result.target} -> ${result.url}`)
  console.log('This points at a Storybook dev server URL -- the tools only respond while that server is running (npm run storybook).')
  console.log('Restart your AI tool from this folder. Claude Code asks you to approve project-scoped MCP servers the first time.')
}

function mcp() {
  if (args[1] !== 'install') return fail('Usage: simple-vue-components mcp install')
  reportMcpInstall(lib.installMcpConfig(process.cwd()))
}

function setup() {
  const dir = process.cwd()
  const s = lib.installSkill(dir)
  console.log(`Skills: ${s.action}${s.skills.length ? ` (${s.skills.map((x) => x.name).join(', ')})` : ''} at ${s.target}`)
  docs()
  reportMcpInstall(lib.installMcpConfig(dir))
}

function help() {
  console.log(`simple-vue-components ${pkg.version}

Usage: simple-vue-components <command>

  setup                  Install the skills, drop CLAUDE.md/AGENTS.md, and write the
                          .mcp.json entry, in one go
  skill [--global]        Install the AI skills into .claude/skills (or ~/.claude/skills):
                          simple-vue-components, build-ui-from-prompt, build-ui-from-design,
                          build-ui-from-backend
  docs                    Add CLAUDE.md and AGENTS.md to the project root (skips any that
                          already exist -- never overwrites)
  mcp install             Point this project's .mcp.json at the Storybook MCP endpoint

On a plain \`npm install\`, "setup" above runs for you automatically (see postinstall in
package.json). Run it by hand after an update, or if your package manager skips install
scripts (pnpm, Yarn Berry, --ignore-scripts, npm ci in CI). See setup.md in the skill for
the Storybook-server requirement and how to point at a shared instance.
`)
}

const commands = { setup, skill, mcp, docs, help }
if (!command || !commands[command]) {
  help()
  process.exit(command ? 1 : 0)
}
commands[command]()
