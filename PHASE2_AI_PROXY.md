# Phase 2 AI Invoice Proxy

작성일: 2026-07-01

## 변경 요약

Supabase Edge Function `analyze-invoice`를 추가했습니다.

브라우저 호출 URL:

```text
https://ekvpssrmjukpodsqjpmu.supabase.co/functions/v1/analyze-invoice
```

생성 파일:

```text
supabase/functions/analyze-invoice/index.ts
```

## 목적

브라우저 코드에 `ANTHROPIC_API_KEY`를 노출하지 않고, 서버 측 Supabase Edge Function에서만 Anthropic API를 호출하도록 합니다.

## 요청 형식

`multipart/form-data`:

```text
file
invoice
image
```

또는 `application/json`:

```json
{
  "mediaType": "image/png",
  "base64": "base64-encoded-file",
  "fileName": "invoice.png"
}
```

지원 파일:

- `image/*`
- `application/pdf`

## 성공 응답

```json
{
  "ok": true,
  "data": {
    "supplierName": "공급사명",
    "supplierBusinessNo": "사업자번호",
    "invoiceNo": "거래명세서번호",
    "invoiceDate": "2026-07-01",
    "purchaseOrderNo": "PO-001",
    "currency": "KRW",
    "totalAmount": 100000,
    "taxAmount": 10000,
    "lines": []
  },
  "invoice": {},
  "poData": {}
}
```

`data`, `invoice`, `poData`를 함께 반환하여 기존 `submitPOFromAI` 또는 invoice registration flow에서 필요한 구조로 연결하기 쉽게 했습니다.

## 에러 처리

구현된 에러 코드:

- `MISSING_API_KEY`: Supabase secret `ANTHROPIC_API_KEY` 없음
- `NETWORK_ERROR`: Anthropic API 연결 또는 응답 실패
- `INVALID_INVOICE_FILE`: 파일 누락, 잘못된 파일 형식, 잘못된 base64 입력
- `AI_RESPONSE_PARSING_ERROR`: AI 응답 JSON parsing 실패
- `METHOD_NOT_ALLOWED`: POST 외 method 호출
- `UNSUPPORTED_CONTENT_TYPE`: 지원하지 않는 content type

## Supabase 설정

필요 secret:

```text
ANTHROPIC_API_KEY
```

예시:

```text
supabase secrets set ANTHROPIC_API_KEY=your_key_here --project-ref ekvpssrmjukpodsqjpmu
```

배포:

```text
supabase functions deploy analyze-invoice --project-ref ekvpssrmjukpodsqjpmu
```

## 현재 앱 연결 상태

현재 GitHub 저장소에는 기존 AI invoice UI 또는 Anthropic 직접 호출 코드가 발견되지 않았습니다.

검색 범위:

```text
public/
src/
package.json
```

검색어:

```text
Anthropic, anthropic, invoice, AI, api_key, ANTHROPIC, fetch(
```

결과:

```text
기존 브라우저 직접 호출부 없음
```

따라서 이번 변경은 Edge Function proxy 추가까지 완료했고, 기존 UI 교체는 해당 UI 코드가 추가되거나 복원된 뒤 진행해야 합니다.

## 브라우저 연결 예시

```javascript
const formData = new FormData();
formData.append("file", invoiceFile);

const response = await fetch("https://ekvpssrmjukpodsqjpmu.supabase.co/functions/v1/analyze-invoice", {
  method: "POST",
  body: formData
});

const result = await response.json();

if (!response.ok || !result.ok) {
  throw new Error(result.error?.message || "AI 거래명세서 분석에 실패했습니다.");
}

submitPOFromAI(result.poData || result.invoice || result.data);
```

## 검증

실행한 검사:

```text
node --check src\main.js
node --check scripts\build.js
npx.cmd -p typescript tsc --noEmit --target ES2022 --lib ES2022,DOM,DOM.Iterable --module ESNext supabase/functions/analyze-invoice/index.ts
npm.cmd run build
```
