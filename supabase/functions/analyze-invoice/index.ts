declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (request: Request) => Response | Promise<Response>): void;
};

type ErrorCode =
  | "MISSING_API_KEY"
  | "NETWORK_ERROR"
  | "INVALID_INVOICE_FILE"
  | "AI_RESPONSE_PARSING_ERROR"
  | "METHOD_NOT_ALLOWED"
  | "UNSUPPORTED_CONTENT_TYPE";

type InvoiceLine = {
  itemCode?: string;
  itemName: string;
  specification?: string;
  quantity: number | null;
  unit?: string;
  unitPrice?: number | null;
  amount?: number | null;
  remark?: string;
};

type InvoiceAnalysis = {
  supplierName?: string;
  supplierBusinessNo?: string;
  invoiceNo?: string;
  invoiceDate?: string;
  purchaseOrderNo?: string;
  currency?: string;
  totalAmount?: number | null;
  taxAmount?: number | null;
  lines: InvoiceLine[];
  memo?: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function errorResponse(code: ErrorCode, message: string, status: number, details?: unknown): Response {
  return jsonResponse(
    {
      ok: false,
      error: {
        code,
        message,
        details,
      },
    },
    status,
  );
}

function normalizeNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;

  const cleaned = value.replace(/[^\d.-]/g, "");
  if (!cleaned) return null;

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeAnalysis(value: unknown): InvoiceAnalysis {
  if (!value || typeof value !== "object") {
    throw new Error("AI response is not an object.");
  }

  const record = value as Record<string, unknown>;
  const rawLines = Array.isArray(record.lines) ? record.lines : [];

  return {
    supplierName: typeof record.supplierName === "string" ? record.supplierName : undefined,
    supplierBusinessNo: typeof record.supplierBusinessNo === "string" ? record.supplierBusinessNo : undefined,
    invoiceNo: typeof record.invoiceNo === "string" ? record.invoiceNo : undefined,
    invoiceDate: typeof record.invoiceDate === "string" ? record.invoiceDate : undefined,
    purchaseOrderNo: typeof record.purchaseOrderNo === "string" ? record.purchaseOrderNo : undefined,
    currency: typeof record.currency === "string" ? record.currency : "KRW",
    totalAmount: normalizeNumber(record.totalAmount),
    taxAmount: normalizeNumber(record.taxAmount),
    lines: rawLines.map((line) => {
      const lineRecord = line && typeof line === "object" ? (line as Record<string, unknown>) : {};
      return {
        itemCode: typeof lineRecord.itemCode === "string" ? lineRecord.itemCode : undefined,
        itemName: typeof lineRecord.itemName === "string" ? lineRecord.itemName : "",
        specification: typeof lineRecord.specification === "string" ? lineRecord.specification : undefined,
        quantity: normalizeNumber(lineRecord.quantity),
        unit: typeof lineRecord.unit === "string" ? lineRecord.unit : undefined,
        unitPrice: normalizeNumber(lineRecord.unitPrice),
        amount: normalizeNumber(lineRecord.amount),
        remark: typeof lineRecord.remark === "string" ? lineRecord.remark : undefined,
      };
    }),
    memo: typeof record.memo === "string" ? record.memo : undefined,
  };
}

function extractJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON object found in AI response.");
    return JSON.parse(match[0]);
  }
}

async function parseRequest(request: Request): Promise<{ mediaType: string; base64: string; fileName?: string }> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file") || formData.get("invoice") || formData.get("image");

    if (!(file instanceof File)) {
      throw new TypeError("Missing invoice file.");
    }

    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      throw new TypeError(`Unsupported invoice file type: ${file.type || "unknown"}`);
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    let binary = "";
    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }

    return {
      mediaType: file.type,
      base64: btoa(binary),
      fileName: file.name,
    };
  }

  if (contentType.includes("application/json")) {
    const body = await request.json();
    const mediaType = typeof body.mediaType === "string" ? body.mediaType : "";
    const base64 = typeof body.base64 === "string" ? body.base64 : "";
    const fileName = typeof body.fileName === "string" ? body.fileName : undefined;

    if (!base64 || (!mediaType.startsWith("image/") && mediaType !== "application/pdf")) {
      throw new TypeError("Invalid invoice image/file.");
    }

    return { mediaType, base64, fileName };
  }

  throw new SyntaxError(`Unsupported content type: ${contentType || "empty"}`);
}

function buildAnthropicContent(input: { mediaType: string; base64: string; fileName?: string }) {
  const filePart =
    input.mediaType === "application/pdf"
      ? {
          type: "document",
          source: {
            type: "base64",
            media_type: input.mediaType,
            data: input.base64,
          },
        }
      : {
          type: "image",
          source: {
            type: "base64",
            media_type: input.mediaType,
            data: input.base64,
          },
        };

  return [
    filePart,
    {
      type: "text",
      text:
        "거래명세서, 세금계산서, 송장 또는 입고 관련 문서를 분석하세요. " +
        "반드시 JSON 객체만 반환하세요. " +
        "스키마: { supplierName, supplierBusinessNo, invoiceNo, invoiceDate, purchaseOrderNo, currency, totalAmount, taxAmount, lines: [{ itemCode, itemName, specification, quantity, unit, unitPrice, amount, remark }], memo }. " +
        "알 수 없는 값은 빈 문자열 또는 null로 두세요. 수량과 금액은 숫자로 반환하세요." +
        (input.fileName ? ` 파일명: ${input.fileName}` : ""),
    },
  ];
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return errorResponse("METHOD_NOT_ALLOWED", "POST 요청만 지원합니다.", 405);
  }

  const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!anthropicApiKey) {
    return errorResponse("MISSING_API_KEY", "서버 환경변수 ANTHROPIC_API_KEY가 설정되지 않았습니다.", 500);
  }

  let invoiceInput: { mediaType: string; base64: string; fileName?: string };
  try {
    invoiceInput = await parseRequest(request);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return errorResponse("UNSUPPORTED_CONTENT_TYPE", "지원하지 않는 요청 형식입니다.", 415, error.message);
    }
    return errorResponse("INVALID_INVOICE_FILE", "유효한 거래명세서 이미지 또는 PDF 파일이 아닙니다.", 400, String(error));
  }

  let anthropicResponse: Response;
  try {
    anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2048,
        temperature: 0,
        messages: [
          {
            role: "user",
            content: buildAnthropicContent(invoiceInput),
          },
        ],
      }),
    });
  } catch (error) {
    return errorResponse("NETWORK_ERROR", "AI 분석 서버에 연결하지 못했습니다.", 502, String(error));
  }

  if (!anthropicResponse.ok) {
    const details = await anthropicResponse.text();
    return errorResponse("NETWORK_ERROR", "AI 분석 서버 응답이 실패했습니다.", 502, {
      status: anthropicResponse.status,
      details,
    });
  }

  try {
    const result = await anthropicResponse.json();
    const textBlock = Array.isArray(result.content)
      ? result.content.find((content: Record<string, unknown>) => content.type === "text")
      : undefined;
    const text = typeof textBlock?.text === "string" ? textBlock.text : "";
    const analysis = normalizeAnalysis(extractJson(text));

    return jsonResponse({
      ok: true,
      data: analysis,
      invoice: analysis,
      poData: {
        supplierName: analysis.supplierName,
        purchaseOrderNo: analysis.purchaseOrderNo,
        invoiceNo: analysis.invoiceNo,
        invoiceDate: analysis.invoiceDate,
        items: analysis.lines,
        totalAmount: analysis.totalAmount,
        taxAmount: analysis.taxAmount,
        memo: analysis.memo,
      },
    });
  } catch (error) {
    return errorResponse("AI_RESPONSE_PARSING_ERROR", "AI 분석 결과를 처리하지 못했습니다.", 502, String(error));
  }
});
