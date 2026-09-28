# simple-vue-components

A Vue 3 component library of 150 `S`-prefixed components — widgets (`SButton`, `SCard`, `SModal`, `SSelect`, `SBarChart`, ...) and generic layout primitives (`SFlex`, `SGrid`, `SStack`, `SBox`, ...). Documentation lives entirely in [Storybook](https://storybook.js.org/) — there's no separate docs site to keep in sync.

## Export it (build a tarball to share by hand)

Only needed for the tarball install method below — skip this if you're installing straight from GitHub instead.

From this repo:

```bash
npm install
npm pack
```

`npm pack` runs the build first (via `prepack`) and produces `simple-vue-components-<version>.tgz` in this folder. That's the file you install into another project — copy or share it however you'd share a file (it's a private package, not published to a registry).

What's actually inside it: the compiled bundle (`dist/`), the AI skill (`skills/`), and a small setup CLI (`bin/`) — never the component source. `npm run build` on its own (without `pack`) just refreshes `dist/` and `src/index.js` in place, useful while developing.

## Use it again (install it in another project)

In the consumer project, either method installs the same package.

### From the tarball

```bash
npm install ./path/to/simple-vue-components-<version>.tgz
```

### Directly from GitHub

```bash
npm install github:Hypotheek/Simple-Custom-ComponentLibrary
```

No `npm pack`/share-a-file step needed — npm clones the repo and runs its `prepare` script (`npm run build`) itself before installing, so `dist/` (gitignored, not committed) gets rebuilt fresh from whatever ref you point at. Pin to a tag or commit instead of the default branch for a reproducible install:

```bash
npm install github:Hypotheek/Simple-Custom-ComponentLibrary#v0.0.3
npm install github:Hypotheek/Simple-Custom-ComponentLibrary#<commit-sha>
```

Whoever runs the install needs read access to this (private) GitHub repo — an SSH key or a token configured for GitHub over HTTPS — the same access anyone already needs to browse the repo itself. The tarball has no such requirement; it's just a file. Also expect the install to take longer than the tarball path: npm has to install this repo's own `devDependencies` (Vite, Storybook, Playwright, ...) in a temp clone before it can run the build.

Then register the plugin and import the stylesheet in your app's entry file:

```js
import { createApp } from 'vue'
import App from './App.vue'
import SimpleVueComponents from 'simple-vue-components'
import 'simple-vue-components/style.css'

createApp(App).use(SimpleVueComponents).mount('#app')
```

Every `S*` component is now available globally in templates, no per-file imports needed. (You can also import individual components by name for tree-shaking — see any `.vue` file's export for the pattern.)

### If you're using an AI coding tool alongside it

`npm install` also runs a `postinstall` step that sets up:
- **four Claude Code skills** in `.claude/skills/`: `simple-vue-components` (the library's conventions and gotchas — what components exist, real props/events/slots), plus `build-ui-from-prompt`, `build-ui-from-design`, and `build-ui-from-backend`, which govern scope discipline depending on what the AI was given to build from — never inventing features, functions, or logic beyond composing existing components with existing data
- **`CLAUDE.md` and `AGENTS.md`** in the project root (only the ones that don't already exist there) — `AGENTS.md` tells an AI agent which skill(s) to use for a given task, `CLAUDE.md` just redirects Claude Code to it
- an entry in that project's **`.mcp.json`** pointing at this repo's Storybook MCP endpoint (`@storybook/addon-mcp`), which exposes live component docs, existing usage examples, and story tests as tools an AI can call directly

npm hides a dependency's install-script output by default, so you likely won't see this happen — check with `ls .claude/skills` or `cat .mcp.json` in the consumer project afterward. If your package manager doesn't run install scripts (pnpm, Yarn Berry, `--ignore-scripts`, `npm ci` in CI), run it by hand:

```bash
npx simple-vue-components setup
```

**This matters:** those MCP tools only work while this library's own Storybook dev server is running and reachable — they're not a bundled, self-contained server. Run it here:

```bash
npm run storybook
```

It serves on `http://localhost:6006` by default, matching what `postinstall` wrote into the consumer's `.mcp.json`. If your team runs Storybook centrally instead of locally, point the consumer's setup at that URL:

```bash
SIMPLE_VUE_COMPONENTS_STORYBOOK_URL=https://your-storybook-host/mcp npx simple-vue-components setup
```

Full details, including what to do if the skill isn't showing up, are in `skills/simple-vue-components/setup.md` (shipped in the package) once installed.

## Developing this library

```bash
npm install
npm run storybook       # browse every component and its docs
npm run stories         # regenerate src/components/*.stories.js after adding/renaming a component
npm run build            # rebuild dist/ and src/index.js
```

Add a component by dropping a new `S*.vue` file in `src/components/`, adding it to the right category in `scripts/categories.mjs`, and running `npm run stories`.
