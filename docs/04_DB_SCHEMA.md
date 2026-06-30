# 04 Database Schema

Version: v2.2

## Current Database Status

No database table definitions, migrations, or Supabase SQL schema files are present in the current repository.

Current confirmed Supabase content:

```text
supabase/functions/analyze-invoice/index.ts
```

The Edge Function does not define tables. It only proxies invoice file analysis to Anthropic and returns structured JSON.

## Recommended Tables

The following schema is recommended for a Manufacturing Material Inventory ERP. It is not yet implemented in the repository.

## Core Master Data

### users

Primary key:

- `id`

Recommended columns:

- `username`
- `display_name`
- `role_id`
- `is_active`
- `created_at`

### roles

Primary key:

- `id`

Recommended columns:

- `code`
- `name`
- `description`

### items

Primary key:

- `id`

Recommended columns:

- `item_code`
- `item_name`
- `specification`
- `unit`
- `item_type`
- `minimum_stock`
- `default_location_id`
- `barcode`
- `is_active`

Recommended indexes:

- unique `item_code`
- unique nullable `barcode`
- index `item_name`

### suppliers

Primary key:

- `id`

Recommended columns:

- `supplier_code`
- `supplier_name`
- `business_no`
- `lead_time_days`
- `contact`
- `is_active`

## Warehouse and Inventory

### warehouses

Primary key:

- `id`

Recommended columns:

- `warehouse_code`
- `warehouse_name`
- `is_active`

### locations

Primary key:

- `id`

Foreign keys:

- `warehouse_id -> warehouses.id`

Recommended columns:

- `location_code`
- `location_name`

### inventory_balances

Primary key:

- `id`

Foreign keys:

- `item_id -> items.id`
- `warehouse_id -> warehouses.id`
- `location_id -> locations.id`

Recommended columns:

- `on_hand_qty`
- `available_qty`
- `reserved_qty`
- `qc_hold_qty`
- `updated_at`

Recommended indexes:

- unique `(item_id, warehouse_id, location_id)`
- index `item_id`
- index `warehouse_id`

### stock_ledger

Primary key:

- `id`

Foreign keys:

- `item_id -> items.id`
- `warehouse_id -> warehouses.id`
- `location_id -> locations.id`
- `created_by -> users.id`

Recommended columns:

- `transaction_type`
- `source_type`
- `source_id`
- `qty_in`
- `qty_out`
- `balance_after`
- `unit`
- `transaction_at`
- `memo`

Recommended indexes:

- index `(item_id, transaction_at)`
- index `(source_type, source_id)`
- index `transaction_type`

## Purchasing and Inbound

### purchase_orders

Primary key:

- `id`

Foreign keys:

- `supplier_id -> suppliers.id`
- `created_by -> users.id`

Recommended columns:

- `po_no`
- `status`
- `order_date`
- `expected_date`
- `memo`

### purchase_order_lines

Primary key:

- `id`

Foreign keys:

- `purchase_order_id -> purchase_orders.id`
- `item_id -> items.id`

Recommended columns:

- `line_no`
- `ordered_qty`
- `received_qty`
- `unit_price`
- `amount`

### inbound_receipts

Primary key:

- `id`

Foreign keys:

- `purchase_order_id -> purchase_orders.id`
- `received_by -> users.id`

Recommended columns:

- `receipt_no`
- `status`
- `received_at`

### inbound_receipt_lines

Primary key:

- `id`

Foreign keys:

- `inbound_receipt_id -> inbound_receipts.id`
- `purchase_order_line_id -> purchase_order_lines.id`
- `item_id -> items.id`

Recommended columns:

- `received_qty`
- `accepted_qty`
- `rejected_qty`
- `qc_required`

## Quality

### quality_inspections

Primary key:

- `id`

Foreign keys:

- `inbound_receipt_line_id -> inbound_receipt_lines.id`
- `inspector_id -> users.id`

Recommended columns:

- `status`
- `accepted_qty`
- `rejected_qty`
- `reason`
- `inspected_at`

## Production and Shipping

### production_orders

Primary key:

- `id`

Recommended columns:

- `production_order_no`
- `project_code`
- `status`
- `planned_start`
- `planned_finish`

### material_issues

Primary key:

- `id`

Foreign keys:

- `production_order_id -> production_orders.id`
- `issued_by -> users.id`

Recommended columns:

- `issue_no`
- `issued_at`
- `status`

### material_issue_lines

Primary key:

- `id`

Foreign keys:

- `material_issue_id -> material_issues.id`
- `item_id -> items.id`

Recommended columns:

- `issued_qty`
- `warehouse_id`
- `location_id`

### shipments

Primary key:

- `id`

Recommended columns:

- `shipment_no`
- `project_code`
- `status`
- `shipped_at`

## Relationships Summary

```text
suppliers -> purchase_orders -> purchase_order_lines
purchase_order_lines -> inbound_receipt_lines
inbound_receipt_lines -> quality_inspections
items -> inventory_balances
items -> stock_ledger
production_orders -> material_issues -> material_issue_lines
stock_ledger references source documents by source_type/source_id
```

## Conflict Report

Documentation recommends a complete ERP schema, but no matching Supabase migrations exist in code. This is an intentional planning document, not an implemented schema.
