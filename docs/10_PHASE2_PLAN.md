# 10 Phase 2 Plan

Version: v2.2

## Objective

Phase 2 turns the current static/simulated manufacturing material management app into a safer, more integrated ERP foundation without rewriting existing working features.

## Priority 1: AI Invoice Proxy

Current status:

- Supabase Edge Function `analyze-invoice` exists.
- Browser app does not currently contain invoice UI or direct Anthropic call.

Next actions:

1. Deploy Edge Function.
2. Set `ANTHROPIC_API_KEY` Supabase secret.
3. Add or locate AI invoice UI.
4. Call Edge Function URL from browser:

```text
https://ekvpssrmjukpodsqjpmu.supabase.co/functions/v1/analyze-invoice
```

5. Map result to PO or invoice registration flow.

## Priority 2: Camera Barcode

Goal:

- Replace barcode simulation with real camera scanning.

Approach:

- Use ZXing-js.
- Keep current simulated scan flow as fallback during transition.
- Keep manual input option.
- Preserve current warehouse-first receiving UX.

Files likely affected:

```text
public/dashboard.html
src/main.js
src/style.css
```

## Priority 3: Excel Import Export

Goal:

- Support warehouse and purchasing data exchange with Excel.

Approach:

- Use SheetJS.
- Add export for inventory and stock ledger.
- Add import preview before write.
- Validate item code, unit, quantity, date, and duplicate rows.

Files likely affected:

```text
public/dashboard.html
src/main.js
src/style.css
```

## Priority 4: PWA

Goal:

- Make SMARTPD installable and resilient for warehouse use.

Approach:

- Add `manifest.json`.
- Add `service-worker.js`.
- Cache static shell.
- Keep ERP transaction data network-first.

Files likely affected:

```text
public/index.html
public/dashboard.html
public/manifest.json
public/service-worker.js
```

## Priority 5: Realtime

Goal:

- Sync multi-user material changes.

Approach:

- Add Supabase client.
- Subscribe to inventory, ledger, inbound, outbound, and QC changes.
- Define conflict handling before implementation.

Dependency:

- Requires database schema.

## Priority 6: Mobile Optimization

Goal:

- Improve warehouse mobile workflows.

Approach:

- Keep main app responsive unless a separate mobile flow is justified.
- Prioritize receiving, issue, count, and lookup.
- Avoid duplicate business logic between desktop and mobile.

## Priority 7: Dashboard Enhancement

Goal:

- Add management KPI dashboard using real ERP data.

Target KPIs:

- Stockout risk count
- Low stock count
- Inbound due today
- QC hold quantity
- PO delayed count
- Production blocked count
- Inventory movement volume

## Required Checks After Each Feature

```text
node --check src\main.js
node --check scripts\build.js
npm.cmd run build
```

If Edge Function changes:

```text
npx.cmd -p typescript tsc --noEmit --target ES2022 --lib ES2022,DOM,DOM.Iterable --module ESNext supabase/functions/analyze-invoice/index.ts
```

## Current Risks

- No persisted database schema.
- UI/source encoding issues may affect Korean labels.
- Current branch strategy is not fully established in repository.
- Existing app uses inline event handlers and global functions, so feature additions must be careful.
