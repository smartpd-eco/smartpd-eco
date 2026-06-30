# 03 Roadmap

Version: v2.2

## Phase 1

Status: completed according to project direction, partially represented in current repository.

Implemented or represented:

- Static landing page
- Dashboard shell
- Inbound confirmation simulation
- Barcode scan simulation
- Inventory status table
- Stock warning indicators
- Purchase memo panel
- Setup wizard
- Help/manual page
- Responsive styling

## Phase 2

Status: in progress.

Priority order:

1. AI Invoice Proxy
2. Camera Barcode
3. Excel Import Export
4. PWA
5. Realtime
6. Mobile Optimization
7. Dashboard Enhancement

### 1. AI Invoice Proxy

Current status: Edge Function exists.

Remaining:

- Deploy Supabase Function.
- Set `ANTHROPIC_API_KEY` secret.
- Add browser-side UI integration when invoice UI exists.
- Map response to PO/invoice registration flow.

### 2. Camera Barcode

Planned:

- Add ZXing-js scanner.
- Keep manual fallback.
- Use camera-first workflow for warehouse operators.

### 3. Excel Import Export

Planned:

- Add SheetJS.
- Export inventory, inbound, outbound, PO, and QC data.
- Add import preview and validation before database write.

### 4. PWA

Planned:

- Add `manifest.json`.
- Add `service-worker.js`.
- Cache static shell carefully.
- Avoid caching live ERP transaction data incorrectly.

### 5. Realtime

Planned:

- Add Supabase Realtime subscriptions.
- Define conflict handling between local state and server state.
- Update inventory and dashboard views on remote changes.

### 6. Mobile Optimization

Planned:

- Review whether to keep a separate mobile page or make main dashboard responsive.
- Prioritize receiving, issue, count, and lookup workflows.

### 7. Dashboard Enhancement

Planned:

- Add live KPI cards using persisted ERP data.
- Include shortage, inbound delay, QC hold, stock value, and production risk indicators.

## Phase 3

Target:

- Supabase schema and migrations.
- Authentication and roles.
- Stock ledger.
- PO/inbound/outbound persistence.
- QC workflow.
- MRP demand calculation.

## Phase 4

Target:

- Advanced management dashboard.
- Supplier performance analytics.
- Production order material readiness.
- Shipping workflow.
- Audit reports.
- Permission matrix.

## Future Roadmap

- Barcode label printing with templates.
- Offline transaction queue.
- Approval workflows.
- Multi-site warehouse support.
- Lot/serial tracking.
- Expiration and shelf-life management.
- Mobile app wrapper if PWA is insufficient.
