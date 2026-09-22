---
name: simple-vue-components
description: Guides correct use of the private simple-vue-components Vue 3 library (S-prefixed components such as SButton, SCard, SModal, SSelect, SBarChart), discovered live through Storybook's own MCP tools (docs-list, docs-show, stories-find-by-component, test-run, ...). Applies when building, editing, or debugging Vue templates in a project that depends on simple-vue-components, when a template uses S-prefixed components, when asked for forms, dashboards, charts, overlays, or navigation with this library, or when the console shows "Failed to resolve component: S...".
when_to_use: Use when writing or editing any .vue file that uses, or should use, an S-prefixed component (SButton, SCard, SModal, SSelect, SBarChart, etc.); when asked to build a form, dashboard, chart, modal, or nav with this library; or when the console shows "Failed to resolve component: S...".
paths: "**/*.vue"
user-invocable: true
---

# simple-vue-components

A private Vue 3 library of `S`-prefixed components. There is no generated API doc or CLI: the library's own **Storybook** instance is the single source of truth, and its `@storybook/addon-mcp` addon exposes that same data as MCP tools you can call directly.

## Before you do anything: are the tools connected?

These tools only work while the library's Storybook **dev server** is running and reachable — `docs-list`, `docs-show`, `docs-show-story`, `stories-find-by-component`, `stories-changed`, `stories-preview`, `test-run`, `review-create`, `get-storybook-story-instructions`. If none of those are available to you:

1. Tell the user the Storybook dev server isn't reachable.
2. If you have access to the library's own repo, offer to run `npm run storybook` there (serves on `http://localhost:6006` by default).
3. If this project's `.mcp.json` points at a URL that isn't `localhost` (a shared/deployed Storybook), tell the user to confirm that instance is up. See [setup.md](./setup.md) for how the URL is configured and how to point it at a different instance.
4. As a last resort only, read the installed component's compiled output isn't useful (it's a minified bundle) — ask the user for the prop names instead of guessing.

Never invent props, events, or slot names when the tools are unavailable. Dont invent new styling, only append the existing styling.

## Workflow

1. **Find the component.** `docs-list` returns every component with its doc `id` (e.g. `actions-sbutton`, `charts-sdonutchart`). IDs are `category-componentname`, all lowercase, no spaces.
2. **Read its real API.** `docs-show { id }` returns the props (with real TS types and `@default` values), events, slots, **and a ready-to-adapt example `.vue` snippet using real prop values** — start from that snippet, don't write one from scratch.
3. **Check how it's used elsewhere.** `stories-find-by-component { componentPaths: [...] }` maps a component's source file to the stories (and other components) that already render it — useful before changing a widely-used component, or to see a realistic composition pattern.
4. **Compose**, following the rules below.
5. **Verify.** After writing or editing anything that touches a story or a component's rendering, call `test-run` on the affected story IDs (from `docs-show`) — it runs the story's tests and accessibility checks and reports failures directly. Prefer testing specific stories while iterating; only run the full suite for a final check.
6. **Need eyes on it?** `stories-preview` gives a live preview URL/link for a specific story while iterating.

## Critical rules

These are things `docs-show`'s types won't tell you — verified behavior, not guesses.

- **`STabs` renders only the tab buttons, not panels.** Switch your own content with `v-if` on the model value.
- **`SToast` never auto-dismisses** — you close it yourself (e.g. with `setTimeout`). Use `SSnackbar` instead for a message that closes itself.
- **Overlays teleport to `<body>`** (`SModal`, `SDrawer`, `SBottomSheet`, `SConfirmDialog`, `SCommandPalette`, `SLightbox`, `SToast`, `SSnackbar`, `SBackdrop`). Don't pass `class`/`style`/`id` to them — Vue logs "Extraneous non-props attributes" because there's no root element to receive it. Control them with a boolean `v-model`.
- **`SSelect` has no placeholder.** An empty model renders a blank box, not a hint. Seed the model with a real value, or add an empty-value option.
- **Chart data is arrays of `{ label, value }` objects**, not bare numbers — check the exact prop name and shape with `docs-show`, since it varies (`SBarChart`/`SLineChart`/`SHorizontalBar` take `data`, `SStackedBar` takes `segments`, `SScatterPlot` takes `points` of `{ x, y }`, `SSparkline` takes a plain `number[]`).
- **Option-set components take an `options` array**, not a manually looped list: `SSelect`, `SRadioGroup`, `SCheckboxGroup`, `SToggleGroup`, `SAutocomplete`. Check `docs-show` for whether that array is objects (`{ label, value }`) or plain strings — it differs by component.
- **`v-model` only exists where a component actually declares a `modelValue` prop** — `docs-show`'s prop list is the source of truth; don't assume every input-like component supports it.

## When the library can't do something

Check `docs-list`/`docs-show` again first — the capability may exist under a different name. If it genuinely doesn't exist, say so plainly and describe the smallest change that would add it; don't fake a value or hand-roll markup that imitates the library's look.
