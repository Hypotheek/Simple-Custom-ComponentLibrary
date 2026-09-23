---
name: simple-vue-components
description: Guides correct use of the private simple-vue-components Vue 3 library (S-prefixed components such as SButton, SCard, SModal, SSelect, SBarChart, SFlex, SGrid), discovered live through Storybook's own MCP tools (docs-list, docs-show, stories-find-by-component, test-run, ...). Applies when building, editing, or debugging Vue templates in a project that depends on simple-vue-components, when a template uses S-prefixed components, when asked for forms, dashboards, charts, overlays, navigation, or any layout/spacing with this library, or when the console shows "Failed to resolve component: S...".
when_to_use: Use when writing or editing any .vue file that uses, or should use, an S-prefixed component (SButton, SCard, SModal, SSelect, SBarChart, SFlex, etc.); when asked to build a form, dashboard, chart, modal, nav, or any layout/spacing with this library; or when the console shows "Failed to resolve component: S...".
paths: "**/*.vue"
user-invocable: true
---

# simple-vue-components

A private Vue 3 library of 150 `S`-prefixed components — including generic layout primitives (`SFlex`, `SGrid`, `SStack`, `SBox`, ...), not just widgets. There is no generated API doc or CLI: the library's own **Storybook** instance is the single source of truth, and its `@storybook/addon-mcp` addon exposes that same data as MCP tools you can call directly.

## Non-negotiable: never invent

The single most common way to misuse this library is writing code around it instead of with it — a hand-rolled `<div style="display:flex; gap:12px">` instead of `SFlex`, a custom `<style>` block that recreates a card's look instead of `SCard`, a guessed prop because checking felt slower. Don't. Before writing **any** markup or styling in a project that uses this library:

1. **A component probably already exists.** Call `docs-list` / `search` before assuming it doesn't — for a widget (button, card, modal, chart) **and** for structure (row, column, grid, spacing, centering, truncation). See [Layout & spacing](#layout--spacing-never-hand-roll-css) below before writing a single inline style for positioning or gaps.
2. **Never invent a prop, event, slot, or allowed value.** `docs-show` is the only source of truth for what a component accepts. A prop that "seems like it should exist" (`size`, `color`, `loading` on `SButton`; a `placeholder` on `SSelect`) usually doesn't.
3. **Never write custom CSS that reproduces a library component's look.** No `<style>` block styling a `<div>` to resemble a card, badge, button, or alert. If a component already renders that look, use the component. Custom CSS in a consuming file should only ever be **layout at the call site** (positioning this instance on the page) — not new visual style for a piece of UI the library already owns.
4. **If the tools are unavailable, don't fall back to guessing.** See below.

This applies even under time pressure or when the "quick fix" is obviously three lines of CSS — those three lines are exactly what drifts a project away from the design system, one component at a time.

## Before you do anything: are the tools connected?

These tools only work while the library's Storybook **dev server** is running and reachable — `docs-list`, `docs-show`, `docs-show-story`, `stories-find-by-component`, `stories-changed`, `stories-preview`, `test-run`, `review-create`, `get-storybook-story-instructions`. If none of those are available to you:

1. Tell the user the Storybook dev server isn't reachable.
2. If this project's `.mcp.json` points at a URL that isn't `localhost` (a shared/deployed Storybook), tell the user to confirm that instance is up. See [setup.md](./setup.md) for how the URL is configured and how to point it at a different instance.
3. The installed component's compiled output isn't useful as a fallback — it's a minified bundle, not readable source.
4. **Stop and ask instead of guessing.** Tell the user which component you need docs for and why the tools aren't reachable. Do not write the component from memory or assumption, and do not silently fall back to plain HTML/CSS as if that were equivalent — that's the exact failure mode this skill exists to prevent.

## Workflow

1. **Find the component.** `docs-list` returns every component with its doc `id` (e.g. `actions-sbutton`, `layout-surfaces-sflex`). IDs are `category-componentname`, all lowercase, no spaces.
2. **Read its real API.** `docs-show { id }` returns the props (with real TS types and `@default` values), events, slots, **and a ready-to-adapt example `.vue` snippet using real prop values** — start from that snippet, don't write one from scratch.
3. **Check how it's used elsewhere.** `stories-find-by-component { componentPaths: [...] }` maps a component's source file to the stories (and other components) that already render it — useful before changing a widely-used component, or to see a realistic composition pattern.
4. **Compose**, following the rules below. For anything structural (rows, columns, gaps, centering, grids, spacing) reach for a layout primitive first — see [Layout & spacing](#layout--spacing-never-hand-roll-css).
5. **Verify.** After writing or editing anything that touches a story or a component's rendering, call `test-run` on the affected story IDs (from `docs-show`) — it runs the story's tests and accessibility checks and reports failures directly. Prefer testing specific stories while iterating; only run the full suite for a final check.
6. **Need eyes on it?** `stories-preview` gives a live preview URL/link for a specific story while iterating.

## Layout & spacing: never hand-roll CSS

Every one of these takes only a `default` slot plus a handful of props — no `<style>` block needed at the call site. Check `docs-show` for exact props; this is which one to reach for.

| Need                                   | Use            |
| --------------------------------------- | -------------- |
| Row or column of items, full control    | `SFlex` (`direction`, `justify`, `align`, `wrap`, `gap`) |
| Vertical stack with even spacing        | `SStack`       |
| Horizontal stack with even spacing      | `SHStack`      |
| Row that wraps onto multiple lines      | `SWrap`        |
| Center content both axes                | `SCenter`      |
| Items pushed to opposite ends (header)  | `SSpread`      |
| Several columns of equal width          | `SEqualCols`   |
| Layers stacked on top of each other     | `SZStack`      |
| Fixed-column grid                       | `SGrid` (existing) — pair with `SGridItem` for column span |
| Responsive grid that wraps automatically| `SAutoGrid`    |
| Generic sized/padded/backgrounded box   | `SBox`         |
| Just add spacing between children       | `SGap`         |
| Padding only, no other styling          | `SPad`         |
| Inline group of small items (tags)      | `SInline`      |
| Fixed image/media aspect ratio          | `SAspectRatio` |
| Fill available width/height             | `SFill`        |
| Force a 1:1 square                      | `SSquare`      |
| Relative/absolute/fixed/sticky offset   | `SPosition`    |
| Cover the nearest positioned ancestor   | `SOverlay`     |
| Break out to full viewport width        | `SFullBleed`   |
| Single-line ellipsis truncation         | `STruncate`    |
| Multi-line clamp                        | `SClamp`       |
| Screen-reader-only content              | `SVisuallyHidden` |
| Scrollable region with a max height     | `SScrollArea`  |
| Show only above/below a breakpoint      | `SShowAbove` / `SShowBelow` |
| Bordered box                            | `SBorder`      |
| Rounded, clipped box                    | `SRounded`     |
| CSS multi-column text                   | `SColumns`     |
| Sticky bar/header                       | `SSticky`      |
| Fixed empty gap / existing spacer       | `SSpacer` (existing) |

If a layout need genuinely isn't covered by this table or `docs-list`, that's a real gap — follow [When the library can't do something](#when-the-library-cant-do-something). It is not permission to write `<div style="...">`.

## Critical rules

These are things `docs-show`'s types won't tell you — verified behavior, not guesses.

- **`STabs` renders only the tab buttons, not panels.** Switch your own content with `v-if` on the model value.
- **`SToast` never auto-dismisses** — you close it yourself (e.g. with `setTimeout`). Use `SSnackbar` instead for a message that closes itself.
- **Overlays teleport to `<body>`** (`SModal`, `SDrawer`, `SBottomSheet`, `SConfirmDialog`, `SCommandPalette`, `SLightbox`, `SToast`, `SSnackbar`, `SBackdrop`). Don't pass `class`/`style`/`id` to them — Vue logs "Extraneous non-props attributes" because there's no root element to receive it. Control them with a boolean `v-model`.
- **`SSelect` has no placeholder.** An empty model renders a blank box, not a hint. Seed the model with a real value, or add an empty-value option.
- **Chart data is arrays of `{ label, value }` objects**, not bare numbers — check the exact prop name and shape with `docs-show`, since it varies (`SBarChart`/`SLineChart`/`SHorizontalBar` take `data`, `SStackedBar` takes `segments`, `SScatterPlot` takes `points` of `{ x, y }`, `SSparkline` takes a plain `number[]`).
- **Option-set components take an `options` array**, not a manually looped list: `SSelect`, `SRadioGroup`, `SCheckboxGroup`, `SToggleGroup`, `SAutocomplete`. Check `docs-show` for whether that array is objects (`{ label, value }`) or plain strings — it differs by component.
- **`v-model` only exists where a component actually declares a `modelValue` prop** — `docs-show`'s prop list is the source of truth; don't assume every input-like component supports it.
- **`SGridItem` only does anything inside an `SGrid` or `SAutoGrid`** — it sets `grid-column: span N`, which has no effect without a grid parent.
- **`SShowAbove`/`SShowBelow` use fixed breakpoints** (`sm` 640px, `md` 768px, `lg` 1024px) via a `breakpoint` prop — there's no arbitrary pixel value; CSS media queries can't take a dynamic prop value.

## When the library can't do something

Check `docs-list`/`docs-show` again first — the capability may exist under a different name, especially among the layout primitives above. If it genuinely doesn't exist, say so plainly to the user and describe the smallest change that would add it. Do not fake a value, do not hand-roll markup or CSS that imitates the library's look, and do not silently substitute plain HTML as if it were the same thing.
