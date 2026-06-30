# 05 API Specification

Version: v2.2

## Current APIs

### Supabase Edge Function: analyze-invoice

URL:

```text
https://ekvpssrmjukpodsqjpmu.supabase.co/functions/v1/analyze-invoice
```

Local source:

```text
supabase/functions/analyze-invoice/index.ts
```

Method:

```text
POST
```

Purpose:

- Analyze invoice, tax invoice, delivery note, or receiving document files.
- Hide `ANTHROPIC_API_KEY` from browser code.
- Return structured JSON for future PO/invoice registration flow.

Supported request formats:

```text
multipart/form-data
```

Accepted field names:

```text
file
invoice
image
```

Supported file types:

```text
image/*
application/pdf
```

Alternative JSON request:

```json
{
  "mediaType": "image/png",
  "base64": "base64-encoded-file",
  "fileName": "invoice.png"
}
```

Success response:

```json
{
  "ok": true,
  "data": {
    "supplierName": "Supplier",
    "supplierBusinessNo": "000-00-00000",
    "invoiceNo": "INV-001",
    "invoiceDate": "2026-07-01",
    "purchaseOrderNo": "PO-001",
    "currency": "KRW",
    "totalAmount": 100000,
    "taxAmount": 10000,
    "lines": [
      {
        "itemCode": "MAT-001",
        "itemName": "Material",
        "specification": "Spec",
        "quantity": 10,
        "unit": "EA",
        "unitPrice": 10000,
        "amount": 100000,
        "remark": ""
      }
    ],
    "memo": ""
  },
  "invoice": {},
  "poData": {}
}
```

Error response:

```json
{
  "ok": false,
  "error": {
    "code": "INVALID_INVOICE_FILE",
    "message": "Error message",
    "details": "Optional details"
  }
}
```

Current error codes:

- `MISSING_API_KEY`
- `NETWORK_ERROR`
- `INVALID_INVOICE_FILE`
- `AI_RESPONSE_PARSING_ERROR`
- `METHOD_NOT_ALLOWED`
- `UNSUPPORTED_CONTENT_TYPE`

## Planned APIs

### Inventory

```text
GET /inventory
GET /inventory/:itemId
POST /inventory/adjustments
```

### Stock Ledger

```text
GET /stock-ledger
GET /stock-ledger?itemId=:itemId
POST /stock-ledger/posting
```

### Purchase Orders

```text
GET /purchase-orders
POST /purchase-orders
PATCH /purchase-orders/:id
POST /purchase-orders/:id/approve
```

### Inbound

```text
GET /inbound-receipts
POST /inbound-receipts
POST /inbound-receipts/:id/confirm
```

### Outbound

```text
GET /material-issues
POST /material-issues
POST /material-issues/:id/post
```

### Quality

```text
GET /quality-inspections
POST /quality-inspections
POST /quality-inspections/:id/release
POST /quality-inspections/:id/reject
```

### KPI

```text
GET /kpis/inventory-health
GET /kpis/inbound-status
GET /kpis/production-risk
GET /kpis/qc-hold
```

## Conflict Report

- Current frontend does not call any API in `public/` or `src/`.
- Current API surface is limited to the Supabase Edge Function.
- Planned APIs depend on a future Supabase schema.
