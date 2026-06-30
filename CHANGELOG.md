# Changelog

## 2026-07-01

### Added

- Added Supabase Edge Function `analyze-invoice` for AI invoice analysis.
- Added structured invoice analysis JSON response for existing PO/invoice registration flows.
- Added documented error handling for missing API key, network failures, invalid invoice files, and AI response parsing failures.
- Added `PHASE2_AI_PROXY.md` with deployment, request, response, and integration notes.

### Fixed

- Updated the build command to use a Node-based copy script so local Windows builds and Linux CI builds can use the same command.
