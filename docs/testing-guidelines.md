# Testing Guidelines

## Overview

This project uses three layers of testing. Each layer has a distinct purpose, location, and toolchain. All new features must include appropriate tests at the relevant layer(s).

---

## Test Layers

### Unit Tests — Jest

Test individual functions and React components in isolation. No HTTP servers, no network calls.

| Property | Value |
|---|---|
| Framework | Jest |
| Backend location | `packages/backend/__tests__/` |
| Frontend location | `packages/frontend/src/__tests__/` |
| File naming | `*.test.js` / `*.test.ts` |
| Run command | `npm run test:backend` / `npm run test:frontend` |

**Rules:**
- Test one unit at a time with no external dependencies.
- Each test must set up its own state (`beforeEach`) and clean up after itself (`afterEach`).
- Name test files to match the module under test (e.g., `app.test.js` tests `app.js`).
- Backend unit tests use an isolated in-memory SQLite instance per test — do not import the shared `app` instance.
- Frontend unit tests use `@testing-library/react` and `msw` to mock API calls.

---

### Integration Tests — Jest + Supertest

Test backend API endpoints with real HTTP requests against the Express app. No browser, no frontend.

| Property | Value |
|---|---|
| Framework | Jest + Supertest |
| Location | `packages/backend/__tests__/integration/` |
| File naming | `*.test.js` / `*.test.ts` |
| Jest config | `packages/backend/jest.integration.config.js` |
| Run command | `npm run test:integration` |

**Rules:**
- Name files based on the API surface being tested (e.g., `items-api.test.js`).
- Use `afterAll` to close the database connection.
- Use helper functions (e.g., `createItem`) to set up prerequisite data rather than relying on seed data.
- Tests must be independent — each test creates and cleans up its own data.
- The default `npm run test:backend` run excludes the `integration/` directory; integration tests run separately.

---

### End-to-End (E2E) Tests — Playwright

Test complete UI workflows through browser automation.

| Property | Value |
|---|---|
| Framework | Playwright |
| Location | `tests/e2e/` |
| File naming | `*.spec.js` / `*.spec.ts` |
| Config | `playwright.config.js` (root) |
| Run command | `npm run test:e2e` |
| Browser | Chromium only |

**Rules:**
- Use the **Page Object Model (POM)** pattern. Place page classes in `tests/e2e/pages/`.
- Limit to **5–8 tests** per spec file covering critical user journeys. Prefer quality over quantity.
- Each test must be fully isolated — use unique identifiers (e.g., a timestamp + random suffix) in test data to avoid collisions across runs.
- Tests must pass on multiple consecutive runs without manual cleanup.
- Do not share state between tests. Use `beforeEach` to navigate to a fresh page state.
- Install Playwright browsers with `npm run test:e2e:install` before first run.

---

## Port Configuration

Always use environment variables with sensible defaults for port configuration so CI/CD workflows can dynamically assign ports.

```js
// Backend
const PORT = process.env.PORT || 3030;

// Frontend (React default, override with PORT env var)
// Playwright baseURL defaults to http://localhost:3000
```

The Playwright `webServer` config in `playwright.config.js` respects `PORT` and `BACKEND_PORT` environment variables.

---

## Running Tests

```bash
# Unit tests (backend + frontend)
npm test

# Backend unit tests only
npm run test:backend

# Backend integration tests only
npm run test:integration

# Frontend unit tests only
npm run test:frontend

# E2E tests (requires running app or webServer auto-start)
npm run test:e2e

# All tests
npm run test:all
```

---

## Coverage

- Backend unit and integration tests collect coverage automatically via Jest (`--coverage` flag).
- Frontend unit tests collect coverage via `react-scripts test --coverage`.
- Coverage reports are written to `packages/backend/coverage/` and `packages/frontend/coverage/`.

---

## What to Test

| Feature type | Unit | Integration | E2E |
|---|---|---|---|
| Database schema / queries | ✅ | — | — |
| API request validation | — | ✅ | — |
| API response shape | — | ✅ | — |
| React component rendering | ✅ | — | — |
| Full user journey (add, edit, delete) | — | — | ✅ |
| Error states visible in UI | ✅ | — | ✅ |
