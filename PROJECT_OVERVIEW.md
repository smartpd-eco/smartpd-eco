# SMARTPD Project Overview

Version: v2.2
Date: 2026-07-01

## Project Summary

SMARTPD is a Manufacturing Material Inventory ERP for warehouse, inventory, purchasing, production, quality, shipping, and management users.

The current repository is a static HTML/CSS/JavaScript application with simulated ERP workflows and one Supabase Edge Function for AI invoice analysis.

## Folder Structure

```text
smartpd-eco/
  .github/
    workflows/
      deploy.yml
  .idx/
    dev.nix
    mcp.json
  .vscode/
    settings.json
  docs/
    01_PROJECT_STATUS.md
    02_PRD.md
    03_ROADMAP.md
    04_DB_SCHEMA.md
    05_API_SPEC.md
    06_UI_GUIDE.md
    07_GIT_WORKFLOW.md
    08_CODEX_GUIDE.md
    09_CHANGELOG.md
    10_PHASE2_PLAN.md
  public/
    dashboard.html
    docs.html
    index.html
  scripts/
    build.js
  src/
    main.js
    style.css
  supabase/
    functions/
      analyze-invoice/
        index.ts
  CHANGELOG.md
  PHASE2_AI_PROXY.md
  PROJECT_OVERVIEW.md
  blueprint.md
  firebase.json
  package.json
```

## Architecture Diagram

```text
User Browser
  |
  |-- public/index.html
  |-- public/dashboard.html
  |-- public/docs.html
  |
  |-- src/style.css
  |-- src/main.js
  |
  |-- Supabase Edge Function
        |
        |-- analyze-invoice
              |
              |-- Anthropic Messages API

Build
  |
  |-- npm run build
        |
        |-- scripts/build.js
              |
              |-- dist/

Deployment
  |
  |-- GitHub Pages workflow
  |-- Firebase Hosting config points to dist/
```

## Current Progress

Estimated completion toward full Manufacturing ERP target:

```text
25%
```

Rationale:

- Static UI and simulated workflows exist.
- AI proxy foundation exists.
- Core persistent ERP backend, database schema, authentication, stock ledger, and live module integration are not yet implemented.

## Completed Modules

Confirmed from current source:

- Landing page
- Dashboard shell
- Help/manual page
- Inbound scan/confirmation simulation
- Inventory status table
- Inventory inline edit simulation
- Stock shortage visual status
- Purchase memo panel
- Initial setup wizard
- Responsive CSS
- Supabase AI invoice proxy
- Cross-platform build script

## Remaining Modules

Remaining for full ERP:

- Supabase database schema and migrations
- Authentication and roles
- MRP
- Purchase Order lifecycle
- Inbound persistence
- Outbound persistence
- Stock Ledger
- Quality Inspection
- Project Status
- KPI Dashboard with live data
- Real barcode camera scanning
- Excel import/export
- PWA
- Supabase Realtime
- Mobile warehouse optimization

## Documentation and Code Conflicts

- `blueprint.md` still describes a generic sign-up form project.
- `package.json` version is `1.0.0`, while documentation baseline starts at `v2.2`.
- Some Korean text appears corrupted in shell output for existing docs/source.
- Current code does not include the full Phase 1 feature list described in prior planning conversations.

## Recommendation

Before adding more ERP features, resolve these foundations:

1. Establish `develop` and feature branches.
2. Decide whether to update `package.json` version to `2.2.0`.
3. Fix or confirm Korean source encoding.
4. Create Supabase migrations for core ERP tables.
5. Implement camera barcode scanning as the next warehouse-priority feature.
