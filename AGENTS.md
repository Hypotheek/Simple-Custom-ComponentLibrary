# AGENTS.md

Instructions for any AI coding agent working in this repository.

## Scope: this repo is the library itself

`simple-vue-components` is implemented here, under `src/components/`. Writing or editing a component's own `.vue` file, adding a new component, or updating `scripts/categories.mjs` is **implementing** the library — the rules below don't apply to that work; use ordinary engineering judgment there.

The rules below apply whenever you're **consuming** `S*` components as a client would — Storybook stories, `.storybook/` config that renders components, docs examples, or any other file that uses `<SButton>`, `<SCard>`, etc. rather than defining one. They're also exactly what ships to every project that installs this package (`templates/CLAUDE.md` and `templates/AGENTS.md`, copied into a consumer project by `postinstall` / `npx simple-vue-components setup`) — this file and those templates should stay in sync in spirit, since it's the same library from the other side.

## The job, and only the job

This library exists so an AI agent can assemble frontend UI **entirely out of existing `S*` components**, correctly wired to whatever data/design/prompt it's given. That is the whole job. It is not:

- a license to write new JavaScript functions, composables, or methods beyond what's needed to bind an existing component to existing data
- a license to add features, screens, states, or affordances nobody asked for — no "while I'm at it" loading spinners, confirm dialogs, validation, empty states, or extra buttons
- a license to invent an API endpoint, a data field, a prop, an event, or a component that doesn't already exist
- a license to write custom CSS/`<style>` blocks that recreate a look the library already owns

If a task needs something beyond composing existing components with existing data/logic, **stop and say so** — name the gap, don't fill it. That decision belongs to the devs, not the agent.

## Always load: `simple-vue-components`

Load the [`simple-vue-components`](skills/simple-vue-components/SKILL.md) skill for **any** work that touches a `.vue` file consuming an `S*` component. It is the source of truth for what components exist and what props/events/slots they actually accept, and for the full "no new features/functions/logic" rule — nothing here overrides it.

## Then, based on what you were given

| You were given | Also load | Why |
| --- | --- | --- |
| A plain-text description only — no design, no backend code | [`build-ui-from-prompt`](skills/build-ui-from-prompt/SKILL.md) | Keeps scope to exactly what the words asked for. |
| A design — screenshot, Figma link/frame, mockup image | [`build-ui-from-design`](skills/build-ui-from-design/SKILL.md) | Maps visuals to existing components instead of pixel-matching with custom CSS. |
| Backend code — routes, types/DTOs, schema, an OpenAPI/GraphQL spec | [`build-ui-from-backend`](skills/build-ui-from-backend/SKILL.md) | Treats the given backend as the only source of truth for data shape and available operations. |
| More than one of the above | All matching skills, together | E.g. a prompt + a Figma frame + an API schema: scope discipline from the prompt skill, visual mapping from the design skill, data-shape discipline from the backend skill — all at once, all on top of `simple-vue-components`. |
| Nothing UI-related (backend-only work, tooling, config, non-Vue files) | None of these | These skills only govern frontend UI built with this library. |

## If you're not sure which applies

Check whether a design reference or backend code actually exists before assuming there isn't one — building from a prompt alone when a Figma link or an API file was available (just not mentioned yet) throws away the more precise source of truth. When genuinely only a prompt exists, `build-ui-from-prompt` is correct on its own.
