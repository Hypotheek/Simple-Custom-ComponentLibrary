---
name: build-ui-from-design
description: Governs translating a supplied design reference (screenshot, Figma link/frame, mockup image) into simple-vue-components UI, without hand-rolling CSS to pixel-match it. Applies together with the simple-vue-components skill, which governs how those components are actually used.
when_to_use: Use when a design reference is provided alongside a UI request — an attached image, a screenshot, a Figma URL or frame, or a mockup — whether or not backend code is also involved. If no design reference exists, use build-ui-from-prompt instead.
paths: "**/*.vue"
user-invocable: true
---

# build-ui-from-design

A design shows *intent*, not a spec to reproduce pixel-for-pixel with custom CSS. Your job is to find the closest existing component and prop combination — never to close the gap between the design and the library's real output by writing style overrides.

## Read the design precisely, don't eyeball it

- If Figma MCP tools are available (`get_design_context`, `get_screenshot`, `get_variable_defs`, `get_metadata`), use them to get real values — spacing, color tokens, component boundaries — instead of guessing from a rendered screenshot.
- For a plain image/screenshot with no source tools, read structure first (what regions exist, what repeats, what's a list vs. a single item) before individual visual details (exact color, exact radius) — structure drives component choice; fine visual details usually don't matter, because of the next rule.

## Map to components — don't chase pixels

1. **Identify each distinct visual element** in the design (a card, a button, a badge, a nav bar, a chart) and find its real library counterpart with `docs-list`/`docs-show`, same workflow as the `simple-vue-components` skill.
2. **When the library's real rendered look differs from the design** — a different corner radius, a different shade of blue, different padding — that is expected and correct. The library's own design system is the one that ships. Do not add inline `style`, a `<style>` block, or a prop value chosen just to force a closer visual match than the component's real defaults/documented props give you. That is exactly the "custom CSS that reproduces a component's look" failure the core skill forbids.
3. **Only use documented props to adjust appearance** (a variant/size/color prop, if `docs-show` lists one for that component) — never a prop value invented because it "should" produce the right look.
4. **Build only what the design (plus the prompt, if any) actually shows.** A design showing three states (empty/loading/populated) means build three; a design showing one state means build one — don't invent the other two "for completeness." Same scope discipline as `build-ui-from-prompt`, and the `simple-vue-components` skill's "no new features, functions, or logic" rule still applies in full: a design shows visuals, not application logic, so any interactivity still needs to be either explicitly requested or left stubbed for a dev.

## When the design shows something the library can't do

If a design element has no reasonable component match (a bespoke chart type, an unusual custom control), don't approximate it with hand-built markup/CSS. Follow [When the library can't do something](../simple-vue-components/SKILL.md#when-the-library-cant-do-something) — report the gap and describe the smallest addition that would close it.
