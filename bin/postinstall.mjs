#!/usr/bin/env node
// Runs automatically after `npm install` adds this package to a project. Installs the
// skill and points .mcp.json at the library's Storybook MCP endpoint (see setup.md) --
// the manual steps in skills/simple-vue-components/setup.md, done for you.
//
// Safety rules for this file specifically:
// - It must NEVER throw or exit non-zero: that would fail the consumer's `npm install`.
// - It only ever touches .claude/skills/simple-vue-components/** (fully owned, overwritten)
//   and .mcp.json (merged, never clobbered). Nothing outside that.
//
// Caveats worth knowing (documented in setup.md too):
// - npm hides a dependency's install-script output unless the parent install fails or
//   --foreground-scripts is set, so this may run silently.
// - pnpm (recent versions) and Yarn Berry don't run dependency install scripts by default.
//   Run `npx simple-vue-components setup` by hand there.
// - The .mcp.json entry alone doesn't make the tools work: Storybook's dev server has to
//   actually be running and reachable at that URL. See setup.md.
import fs from 'node:fs'
import path from 'node:path'
import * as lib from './lib.mjs'

function debugSkip(reason) {
  if (process.env.SIMPLE_VUE_COMPONENTS_DEBUG_POSTINSTALL) console.error(`[simple-vue-components] postinstall skipped: ${reason}`)
}

function resolveProjectDir() {
  const nodeModules = path.dirname(lib.root)
  if (path.basename(nodeModules) !== 'node_modules') {
    debugSkip(`unexpected install location: ${lib.root}`)
    return null
  }
  const projectDir = path.dirname(nodeModules)
  if (!fs.existsSync(path.join(projectDir, 'package.json'))) {
    debugSkip(`no package.json next to node_modules at ${projectDir}`)
    return null
  }
  return projectDir
}

function main() {
  if (process.env.SIMPLE_VUE_COMPONENTS_NO_POSTINSTALL) return debugSkip('SIMPLE_VUE_COMPONENTS_NO_POSTINSTALL is set')
  if (process.env.CI) return debugSkip('CI environment')
  if (process.env.npm_config_global === 'true') return debugSkip('global install')
  // This package's own dev repo has scripts/generate-*.mjs; the published tarball never
  // does (excluded from "files"). A bare `npm install` in the dev repo would otherwise
  // trigger this too, since npm also runs a project's own postinstall on install-with-no-args.
  if (fs.existsSync(path.join(lib.root, 'scripts'))) return

  const projectDir = resolveProjectDir()
  if (!projectDir) return

  const steps = [
    ['skill', () => lib.installSkill(projectDir)],
    ['MCP config (.mcp.json)', () => lib.installMcpConfig(projectDir)]
  ]
  const results = steps.map(([label, run]) => {
    try {
      return [label, run()]
    } catch (error) {
      return [label, { action: 'error', reason: error.message }]
    }
  })

  const changed = results.filter(([, r]) => !['unchanged', 'skipped'].includes(r.action))
  if (!changed.length) return

  console.log(`\nsimple-vue-components: set up for AI use in ${projectDir}`)
  for (const [label, r] of results) {
    if (r.action === 'unchanged') continue
    if (r.action === 'skipped') console.log(`  ${label}: skipped (${r.reason})`)
    else if (r.action === 'error') console.log(`  ${label}: could not set up automatically (${r.reason}) -- see setup.md`)
    else console.log(`  ${label}: ${r.action}${r.url ? ` -> ${r.url}` : ''}`)
  }
  console.log('  This points at a Storybook dev server URL -- it only works while that server is running.')
  console.log('  Open your AI tool from this folder and approve the MCP server when it asks.\n')
}

try {
  main()
} catch (error) {
  console.error(`[simple-vue-components] postinstall setup did not complete: ${error.message}`)
}
