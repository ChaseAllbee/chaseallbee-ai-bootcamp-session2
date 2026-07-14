# GitHub Copilot Instructions

> **Note**: This file is located at `.github/copilot-instructions.md` and is used by GitHub Copilot to understand project context.

This file contains high-level instructions for GitHub Copilot to follow when generating code for this project. For detailed guidance, refer to the documentation files in the `docs/` directory.

## Documentation Overview

- [Project Overview](../docs/project-overview.md) - Overview of the project
- [Functional Requirements](../docs/functional-requirements.md) - Core feature requirements (due dates, editing, sorting, etc.)
- [UI Guidelines](../docs/ui-guidelines.md) - Visual design principles, color palette, typography, and component standards
- [Testing Guidelines](../docs/testing-guidelines.md) - Unit, integration, and E2E test conventions, locations, and tooling
- [Coding Guidelines](../docs/coding-guidelines.md) - Language conventions, API design, and style rules

---

## Project Structure

This is a monorepo using npm workspaces:

- `packages/frontend/` — React app (CRA, port 3000)
- `packages/backend/` — Express.js API server (port 3030, configurable via `PORT` env var)
- `tests/e2e/` — Playwright end-to-end tests
- `docs/` — Project documentation

---

## Coding Style

Follow all conventions in [docs/coding-guidelines.md](../docs/coding-guidelines.md).

