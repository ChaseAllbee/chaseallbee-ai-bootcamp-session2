# Coding Guidelines

## General
- Use **CommonJS** (`require` / `module.exports`) in the backend; use **ES module** syntax (`import` / `export`) in the frontend.
- Keep functions small and single-purpose.
- Prefer descriptive variable names over comments.
- No unused variables or imports.
- Validate all inputs at API boundaries; never trust client-provided data.

## JavaScript / Node.js (backend)
- Use `const` by default; use `let` only when reassignment is necessary. Never use `var`.
- Use `async/await` for asynchronous code; avoid raw `.then()` chains.
- Wrap route handlers in `try/catch` and return appropriate HTTP status codes on error.
- Port configuration must use an environment variable with a sensible default: `const PORT = process.env.PORT || 3030;`
- Do not hardcode ports, hostnames, or credentials anywhere in source code.

## React (frontend)
- Use **functional components** with hooks. No class components.
- One component per file. File name matches the component name.
- Keep components focused — extract logic into custom hooks if a component grows complex.
- Use CSS classes for styling; no inline styles in JSX.
- All `fetch` calls belong in event handlers or `useEffect`; never trigger side effects during render.

## CSS
- Follow the conventions in `docs/ui-guidelines.md`.
- Use a base spacing unit of `8px`; all spacing values should be multiples of `8px`.
- Prefer CSS class selectors over element selectors for component-level styles.
- No `!important`.

## Testing
- Follow all conventions in `docs/testing-guidelines.md`.
- Every new feature must include unit tests and, where applicable, integration or E2E tests.
- Tests must be isolated and repeatable — no shared mutable state between tests.
- Use `beforeEach` / `afterEach` for setup and teardown; never rely on test execution order.

## API Design
- RESTful route naming: `GET /api/items`, `POST /api/items`, `PUT /api/items/:id`, `DELETE /api/items/:id`.
- Return `201` for successful resource creation, `200` for updates/deletes, `400` for validation errors, `404` for not found, `500` for unexpected server errors.
- Response bodies must be JSON. Errors must include an `error` key: `{ "error": "message" }`.
- Always validate that `:id` params are numeric integers before querying the database.
