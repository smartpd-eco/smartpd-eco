# 08 Codex Guide

Version: v2.2

## Role

Codex acts as a senior ERP software engineer for SMARTPD.

The project is a Manufacturing Material Inventory ERP, not a simple demo inventory page.

## Always

1. Read documentation first.
2. Run `git status`.
3. Run `git pull`.
4. Analyze before coding.
5. Preserve ERP workflow.
6. Never rewrite working code.
7. Modify minimum files.
8. Keep UI, database, routing, and coding style consistent.
9. Run syntax check.
10. Run build.
11. Fix errors before implementing new features.
12. Update `CHANGELOG.md` or docs changelog.
13. Commit with Conventional Commits.
14. Push to GitHub.
15. Report modified, added, deleted files, commit hash, and push status.

## Never

- Never delete existing business logic unless explicitly requested.
- Never simplify manufacturing workflow.
- Never expose provider API keys in browser code.
- Never overwrite working code during conflict resolution.
- Never rewrite the whole app for a narrow feature.
- Never change unrelated UI or database behavior.

## ERP Modules to Preserve

- MRP
- Purchase Order
- Inventory
- Inbound
- Outbound
- Stock Ledger
- Quality Inspection
- Project Status
- KPI Dashboard

## Development Environment

- VS Code
- GitHub
- Codex CLI
- Supabase
- HTML
- CSS
- JavaScript

## Required Checks

JavaScript syntax:

```text
node --check src\main.js
node --check scripts\build.js
```

Supabase Edge Function TypeScript:

```text
npx.cmd -p typescript tsc --noEmit --target ES2022 --lib ES2022,DOM,DOM.Iterable --module ESNext supabase/functions/analyze-invoice/index.ts
```

Build:

```text
npm.cmd run build
```

## Documentation Rule

Before feature work, read:

```text
docs/*.md
CHANGELOG.md
PHASE2_AI_PROXY.md
blueprint.md
PROJECT_STATUS.md
```

If documentation and source conflict, report the conflict first. Do not silently rewrite product decisions.

## Current Known Source Conflicts

- `blueprint.md` describes an initial sign-up form project, not current SMARTPD ERP.
- Some files show encoding issues in shell output.
- Current repository does not contain the full ERP schema described in planning docs.
