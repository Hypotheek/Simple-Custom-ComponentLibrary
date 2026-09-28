---
name: build-ui-from-prompt
description: Governs scope when building or editing frontend UI from a plain-text request alone — no design/mockup/screenshot and no backend code provided alongside it. Applies together with the simple-vue-components skill, which governs how those components are actually used; this skill governs what gets built and how much.
when_to_use: Use when asked to build, add, or change UI and the only input is a written description — no attached/linked design (screenshot, Figma, mockup) and no backend code (routes, types, schema) to wire up to. If either of those exists, use build-ui-from-design and/or build-ui-from-backend instead (or in addition).
paths: "**/*.vue"
user-invocable: true
---

# build-ui-from-prompt

Building UI from words alone is the easiest way to accidentally invent things, because nothing constrains the output but your own judgment. Constrain it deliberately.

## Build exactly what the prompt says, nothing else

1. **Turn the prompt into a checklist of literal requirements** before writing anything — every noun and stated behavior becomes one line. "A settings page with a form for name and email and a save button" is three items: a form, two fields, one button. Not a page title, not a cancel button, not a success toast — those weren't asked for.
2. **Map each checklist item to a real component** via `docs-list`/`docs-show` (see the `simple-vue-components` skill for the exact workflow). Use the [layout & spacing table](../simple-vue-components/SKILL.md#layout--spacing-never-hand-roll-css) for structure.
3. **Don't add anything not on the checklist** — no extra sections, no placeholder content beyond what's needed to show the layout works, no "typical" fields or buttons a similar page might have elsewhere. If the prompt is genuinely ambiguous about a structural detail (spacing, column count), pick the plainest reading and say what you assumed — don't pad it out with extra decisions to compensate.
4. **Interactivity is wiring, not logic.** A save button gets a `@click` that calls a function — if the prompt (or surrounding code) doesn't already define what that function does, stub the wiring (`@click="onSave"`) and leave `onSave`'s body for the dev, or ask what it should do. Do not invent what "save" does (an API call, a `console.log`, a toast) on your own. The `simple-vue-components` skill's "no new features, functions, or logic" rule applies in full here.
5. **If a requirement has no matching component or layout primitive**, that's a real gap — say so plainly and stop, per [When the library can't do something](../simple-vue-components/SKILL.md#when-the-library-cant-do-something). Don't hand-roll markup to cover it.

## Quick self-check before finishing

- Could you point to the exact words in the prompt that justify every element on screen? If not, remove it.
- Did you write any function whose behavior wasn't specified? If yes, replace its body with a stub and flag it to the user.
- Did you write any CSS? If yes, it should only be spacing/positioning at the call site, and only because no layout primitive covers it.
