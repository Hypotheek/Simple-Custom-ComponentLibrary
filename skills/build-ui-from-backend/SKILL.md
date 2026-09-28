---
name: build-ui-from-backend
description: Governs wiring simple-vue-components UI to backend code that was actually provided (API routes, types/DTOs, a schema, an OpenAPI/GraphQL spec) — treating it as the only source of truth for data shape and available operations. Applies together with the simple-vue-components skill, which governs how those components are actually used.
when_to_use: Use when backend code or a data contract is provided or referenced alongside a UI request — route handlers, types/interfaces/DTOs, a database model, an OpenAPI/GraphQL schema, or an existing API client. If no backend code exists, use build-ui-from-prompt instead.
paths: "**/*.vue"
user-invocable: true
---

# build-ui-from-backend

The backend code you were actually given is the *only* source of truth for what data exists and what operations are possible. Never fill a gap in it by guessing a field name, a type, or an endpoint that "probably" exists.

## Read the real contract before wiring anything

1. **Find the actual shape** — read the route handler's response, the DTO/type/interface, the schema, or the model referenced. Use its real field names and types verbatim; don't rename, reshape, or "clean up" them in the frontend.
2. **Find the actual operations** — only call endpoints/mutations/functions that literally exist in the code you were given. Follow this project's existing convention for calling them (an existing API client, composable, or fetch wrapper) rather than inventing a new calling pattern.
3. **If the UI needs data or an action the backend doesn't provide**, that is a real gap — stop and say so, naming exactly what's missing (e.g. "there's no endpoint returning a user's order count, which the design implies"). Do not invent a plausible field, a fake endpoint, or a client-side calculation to paper over it. That decision belongs to the devs.

## Wiring data into components

- Match backend field names to the correct library prop shape using `docs-show` (see the `simple-vue-components` skill) — chart components in particular take different shapes per component (`data` vs `segments` vs `points`), and none of them match an arbitrary backend response shape by accident. A thin mapping step (`data.map(row => ({ label: row.name, value: row.count }))`) is fine; inventing new fields inside that mapping is not.
- Formatting for display (a date string, a currency amount) is fine. Calculating a new value the backend doesn't already provide (a derived total, a percentage, a status the backend doesn't send) is not — that's exactly the "no invented business logic" rule from the `simple-vue-components` skill, and it applies in full here.
- Loading/error states for a real async call are structural, not invented features — use them if the library has a component for it (`SSpinner`, `SSkeleton`, `SAlert`, `SEmpty`) and the prompt/design implies the call is actually async. Don't add retry logic, caching, or optimistic updates unless asked.

## Quick self-check before finishing

- Every field you bind to a prop — can you point to where it comes from in the backend code you were given?
- Every function call you wrote — does it call something that already exists in that backend code (or an existing client for it), verbatim?
- Any calculation or transform beyond simple formatting — was it explicitly asked for?
