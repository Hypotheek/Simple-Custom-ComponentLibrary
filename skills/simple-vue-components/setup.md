# Setup

There's no CLI-driven doc generation anymore — the library's Storybook instance is the only reference, reached over MCP.

## What `npm install` sets up for you

Installing the package runs a `postinstall` step that:

1. Copies this skill into `.claude/skills/simple-vue-components` in the current project.
2. Adds an entry to this project's `.mcp.json` pointing at the library's Storybook MCP endpoint:
   ```json
   { "mcpServers": { "simple-vue-components-storybook": { "type": "http", "url": "http://localhost:6006/mcp" } } }
   ```

Like the skill copy, this only merges into `.mcp.json` — it never removes another server you already have configured there.

**npm hides a dependency's install-script output by default**, so you likely won't see this happen. Run `npx simple-vue-components setup` to see it happen with output, or to run it again (see below).

## The part `npm install` can't do for you: the server has to actually be running

Unlike a normal stdio MCP server, this one is Storybook's own dev server — `.mcp.json` points at a URL, and that URL only answers while `npm run storybook` is running somewhere reachable from wherever you're working. There are two real setups:

- **Same machine, working on both repos:** run `npm run storybook` in the library's own repo (defaults to `http://localhost:6006`), and the default `.mcp.json` entry just works.
- **A shared or deployed instance:** if your team runs Storybook centrally rather than locally, point at that instead:
  ```bash
  SIMPLE_VUE_COMPONENTS_STORYBOOK_URL=https://storybook.your-team.example/mcp npx simple-vue-components setup
  ```
  (A deployed Storybook needs to be the live, running server — a static `storybook build` export has no `/mcp` endpoint to answer.)

If the tools aren't showing up in your AI tool, check this before anything else: is the Storybook dev server actually up at that URL?

## Commands

- `npx simple-vue-components setup` — installs the skill and writes the `.mcp.json` entry, with output. This is what `postinstall` runs silently; use it to refresh after a package update, or when your package manager doesn't run install scripts (pnpm, Yarn Berry, `--ignore-scripts`, `npm ci` in CI).
- `npx simple-vue-components skill [--global] [--dir <path>]` — just the skill copy.
- `npx simple-vue-components mcp install` — just the `.mcp.json` entry.

## Verifying the connection

After setup, restart your AI tool from the project folder (Claude Code asks to approve a new project-scoped MCP server the first time). `claude mcp list` should show `simple-vue-components-storybook`, and its tools (`docs-list`, `docs-show`, ...) should be callable. If it shows as failed to connect, the Storybook dev server isn't reachable at the configured URL yet.
