# 02 Product Requirements Document

Product: SMARTPD Manufacturing Material Inventory ERP
Version: v2.2

## Business Objectives

SMARTPD supports manufacturing material operations across warehouse, inventory, purchasing, production, quality, shipping, and management teams.

Primary objectives:

- Reduce material receiving errors.
- Improve inventory visibility.
- Preserve a reliable stock ledger.
- Support purchasing decisions from shortage and demand signals.
- Connect quality inspection to inbound material availability.
- Provide management-level KPI visibility.
- Keep warehouse workflows fast enough for shop-floor use.

## Target Users

- Warehouse operators
- Inventory controllers
- Purchasing staff
- Production planners
- Quality inspectors
- Shipping staff
- Management users

## ERP Workflow

Target integrated workflow:

```text
MRP demand
  -> Purchase requisition
  -> Purchase order
  -> Inbound plan
  -> Receiving
  -> Quality inspection
  -> Inventory update
  -> Stock ledger posting
  -> Production issue / outbound
  -> Shipping
  -> KPI dashboard and management reporting
```

Current source implements only a subset of this workflow with static UI and simulated interactions.

## Functional Requirements

### MRP

- Calculate material demand from production requirements.
- Compare required quantities against available, reserved, and inbound stock.
- Generate shortage signals and purchase recommendations.

Current status: planned.

### Purchase Order

- Create, edit, approve, and track purchase orders.
- Link PO lines to suppliers, expected dates, and inbound receipts.
- Support AI invoice analysis as a data entry accelerator.

Current status: partially planned; AI proxy exists.

### Inventory

- Track item master, location, unit, current stock, minimum stock, and status.
- Support quantity adjustment with validation.
- Provide search and shortage indicators.

Current status: static/simulated UI exists.

### Inbound

- Receive material by barcode or manual input.
- Validate quantity and item identity.
- Allow short undo window for accidental receiving.

Current status: simulated UI exists.

### Outbound

- Issue material to production or shipping.
- Preserve stock ledger posting.

Current status: planned.

### Stock Ledger

- Record every stock movement as immutable transaction history.
- Include source document, user, timestamp, quantity, and balance after posting.

Current status: planned.

### Quality Inspection

- Hold inbound items for QC where required.
- Support accepted, rejected, rework, and quarantine statuses.
- Release accepted stock to available inventory.

Current status: planned.

### Project Status

- Show material readiness by project or production order.
- Highlight blocked production due to shortages or QC holds.

Current status: planned.

### KPI Dashboard

- Show inventory health, inbound performance, shortages, PO status, QC status, and production impact.
- Use live ERP data when Supabase schema exists.

Current status: static/simulated dashboard elements exist.

## Non-Functional Requirements

- Mobile-friendly for warehouse use.
- Fast scan and confirmation flow.
- Clear Korean labels.
- High contrast status colors.
- Backward compatibility with existing local/static workflow.
- No exposed AI provider API keys in browser code.
- Build must work on Windows local development and Linux CI.
- Future database updates must preserve auditability.

## Constraints

- Current frontend is static HTML/CSS/JavaScript.
- Current repository does not contain Supabase table migrations.
- Current browser app is not yet wired to Supabase persistence.
- Existing UI and business logic must not be rewritten wholesale.
