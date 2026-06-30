# 06 UI Guide

Version: v2.2

## UI Principles

SMARTPD UI must support warehouse and manufacturing users first.

Principles:

- Keep Korean labels clear and operational.
- Use compact ERP-style layouts.
- Prioritize scanning, receiving, stock lookup, and exception handling.
- Make destructive actions explicit with confirmation.
- Preserve visual status semantics across modules.
- Avoid marketing-style UI inside operational screens.
- Keep mobile touch targets usable for warehouse workers.

## Current UI Architecture

Current files:

```text
public/index.html
public/dashboard.html
public/docs.html
src/style.css
src/main.js
```

Current pages:

- Landing page
- Dashboard page
- Help/manual page

Current dashboard layout:

```text
Topbar
Sidebar
Main content panels
Toast layer
Undo toast
```

## Dashboard

Current dashboard modules:

- Inbound confirmation panel
- Inventory status panel
- Setup wizard panel
- Stock shortage detail panel

Target dashboard modules:

- KPI cards
- Stock risk
- Inbound plan
- Outbound plan
- Production impact
- QC hold status
- Purchase order status
- Project readiness

## Colors

Current CSS tokens:

```css
--bg: #09090B;
--bg2: #101014;
--bg3: #17171C;
--bg4: #1E1E25;
--acc: #4F8EF7;
--ok: #3DD68C;
--warn: #F5A623;
--dan: #F56565;
```

Semantic use:

- Blue: primary action, active scan, active workflow
- Green: success, accepted, enough stock
- Yellow: warning, low stock, pending attention
- Red: danger, shortage, destructive action, rejection
- Dark neutral: ERP work surface

## Icons

Current icon library:

```text
Tabler Icons Webfont
```

Usage rules:

- Use scan/barcode icons for receiving and barcode actions.
- Use box/package icons for inventory.
- Use alert icons for shortages and validation.
- Use check icons for completion.
- Use trash icons only with confirmation.

## Responsive Rules

Current CSS includes breakpoints:

```text
max-width: 850px
max-width: 480px
max-width: 360px
```

Mobile behavior:

- Sidebar becomes bottom navigation.
- Main panels reduce padding.
- Tables support horizontal scrolling.
- Toasts move above bottom navigation.
- Stats cards collapse to two columns.

## Component Style Rules

Buttons:

- `.bp`: primary
- `.bs`: secondary
- `.bg`: ghost
- `.bok`: success
- `.bwarn`: warning
- `.bdan`: danger

Cards:

- Use for bounded work units and repeated status blocks.
- Keep operational density.
- Avoid nested decorative cards.

Tables:

- Use compact rows.
- Keep status chips visible.
- Allow horizontal scrolling on mobile.

Forms:

- Validate required fields before proceeding.
- Preserve user input when navigating backward.

## Conflict Report

- Some source files display Korean mojibake in shell output.
- Current landing page has more marketing-style presentation than operational ERP screens; this is acceptable for entry page but should not spread into warehouse workflows.
