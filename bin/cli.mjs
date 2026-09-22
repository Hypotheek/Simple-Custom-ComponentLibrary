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
  const count = fs.readdirSync(result.target, { recursive: true }).filter((f) => fs.statSync(path.join(result.target, f)).isFile()).length
  console.log(`${result.action === 'updated' ? 'Updated' : result.action === 'unchanged' ? 'Already up to date' : 'Installed'} skill (${count} files, package v${pkg.version}) at ${result.target}`)
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
  console.log(`Skill: ${s.action}${s.target ? ` (${s.target})` : ''}`)
  reportMcpInstall(lib.installMcpConfig(dir))
}

function help() {
  console.log(`simple-vue-components ${pkg.version}

Usage: simple-vue-components <command>

  setup                  Install the skill and write the .mcp.json entry, in one go
  skill [--global]        Install the AI skill into .claude/skills (or ~/.claude/skills)
  mcp install             Point this project's .mcp.json at the Storybook MCP endpoint

On a plain \`npm install\`, "setup" above runs for you automatically (see postinstall in
package.json). Run it by hand after an update, or if your package manager skips install
scripts (pnpm, Yarn Berry, --ignore-scripts, npm ci in CI). See setup.md in the skill for
the Storybook-server requirement and how to point at a shared instance.
`)
}

const commands = { setup, skill, mcp, help }
if (!command || !commands[command]) {
  help()
  process.exit(command ? 1 : 0)
}
commands[command]()
