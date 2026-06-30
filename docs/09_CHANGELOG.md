# 09 Changelog

Semantic versioning starts at `v2.2` for SMARTPD Phase 2 documentation.

## v2.2 - Current Release

Date: 2026-07-01

### Added

- Project documentation standard under `/docs`.
- Supabase Edge Function documentation for AI invoice analysis.
- ERP module roadmap and database schema planning documents.
- Git workflow and Codex development rules.

### Existing Implementation

- Static HTML/CSS/JavaScript app.
- Landing page, dashboard page, and manual page.
- Inbound confirmation simulation.
- Inventory status and edit simulation.
- Barcode scan simulation.
- Responsive CSS.
- Supabase Edge Function `analyze-invoice`.
- Cross-platform build script.

### Known Gaps

- No Supabase database migrations.
- No authentication implementation.
- No live API integration from frontend.
- No real camera barcode scanning.
- No PWA files.
- No Realtime sync.
- No full MRP/PO/QC/outbound stock ledger implementation.

## Future Entries

### v2.3 - Planned

- Connect AI invoice proxy to browser UI when invoice UI exists.
- Add camera barcode scanning.
- Add Excel import/export.

### v2.4 - Planned

- Add PWA support.
- Add Supabase Realtime sync.
- Improve mobile warehouse workflow.

### v3.0 - Planned

- Add Supabase schema and persistent ERP transactions.
- Add authentication and role-based access.
- Add stock ledger and quality inspection workflows.
