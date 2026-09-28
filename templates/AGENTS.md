# AGENTS.md

Instructions for any AI coding agent (Claude Code, Cursor, or otherwise) working on frontend UI in this project. This project builds its UI with `simple-vue-components`, a private Vue 3 component library.

## The job, and only the job

This library exists so an AI agent can assemble frontend UI **entirely out of existing `S*` components**, correctly wired to whatever data/design/prompt it's given. That is the whole job. It is not:

- a license to write new JavaScript functions, composables, or methods beyond what's needed to bind an existing component to existing data
- a license to add features, screens, states, or affordances nobody asked for — no "while I'm at it" loading spinners, confirm dialogs, validation, empty states, or extra buttons
- a license to invent an API endpoint, a data field, a prop, an event, or a component that doesn't already exist
- a license to write custom CSS/`<style>` blocks that recreate a look the library already owns

If a task needs something beyond composing existing components with existing data/logic, **stop and say so** — name the gap, don't fill it. That decision belongs to the devs, not the agent.

**An implied need is not permission, no matter how obviously it follows.** "Make this an SPA" implies routing; "make the table sortable" implies sort logic; "add search" implies a filter function. None of those name the code itself, so none of them authorize writing it — even though writing it looks like the only way to actually deliver what was asked. When a request only *implies* code, stop, name exactly what that code would be, explain why the request implies it, and wait for the user to explicitly confirm that specific piece before touching it. See the `simple-vue-components` skill's "explicit means explicit" rule for the full version of this.

## Always load: `simple-vue-components`

Load the `simple-vue-components` skill (`.claude/skills/simple-vue-components/SKILL.md`) for **any** work that touches a `.vue` file using or needing an `S*` component. It is the source of truth for what components exist and what props/events/slots they actually accept, and for the full "no new features/functions/logic" rule — nothing here overrides it.

## Then, based on what you were given

| You were given | Also load | Why |
| --- | --- | --- |
| A plain-text description only — no design, no backend code | `build-ui-from-prompt` | Keeps scope to exactly what the words asked for. |
| A design — screenshot, Figma link/frame, mockup image | `build-ui-from-design` | Maps visuals to existing components instead of pixel-matching with custom CSS. |
| Backend code — routes, types/DTOs, schema, an OpenAPI/GraphQL spec | `build-ui-from-backend` | Treats the given backend as the only source of truth for data shape and available operations. |
| More than one of the above | All matching skills, together | E.g. a prompt + a Figma frame + an API schema: scope discipline from the prompt skill, visual mapping from the design skill, data-shape discipline from the backend skill — all at once, all on top of `simple-vue-components`. |
| Nothing UI-related (backend-only work, tooling, config, non-Vue files) | None of these | These skills only govern frontend UI built with this library. |

Each skill lives at `.claude/skills/<name>/SKILL.md`.

## If you're not sure which applies

Check whether a design reference or backend code actually exists before assuming there isn't one — building from a prompt alone when a Figma link or an API file was available (just not mentioned yet) throws away the more precise source of truth. When genuinely only a prompt exists, `build-ui-from-prompt` is correct on its own.
