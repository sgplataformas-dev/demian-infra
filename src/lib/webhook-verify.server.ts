// Verificacao de assinatura no formato "Standard Webhooks" (standardwebhooks.com),
// o mesmo esquema usado pelos Auth Hooks nativos do Supabase (ex.: "Send Email
// Hook"). Reimplementado aqui com Web Crypto em vez de depender de um pacote
// — mesmo algoritmo, sem SDK externo.
//
// Secret no formato que o painel do Supabase gera: "whsec_<base64>".
// Headers enviados pelo Supabase: webhook-id, webhook-timestamp, webhook-signature
// (uma lista separada por espaco de "v1,<assinatura base64>").

export class WebhookVerifyError extends Error {
  code: "missing_headers" | "stale_timestamp" | "invalid_signature" | "invalid_json";
  constructor(code: WebhookVerifyError["code"], message: string) {
    super(message);
    this.code = code;
  }
}

const TOLERANCE_SECONDS = 5 * 60;

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function bytesToBase64(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

async function hmacSha256Base64(secretBytes: Uint8Array, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    secretBytes as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return bytesToBase64(new Uint8Array(signature));
}

/**
 * Verifies a Standard Webhooks request (Supabase Auth Hooks use this format)
 * and returns the parsed JSON body. Throws WebhookVerifyError on any failure.
 */
export async function verifyStandardWebhook(request: Request, secret: string): Promise<unknown> {
  const id = request.headers.get("webhook-id");
  const timestamp = request.headers.get("webhook-timestamp");
  const signatureHeader = request.headers.get("webhook-signature");

  if (!id || !timestamp || !signatureHeader) {
    throw new WebhookVerifyError(
      "missing_headers",
      "Missing webhook-id/webhook-timestamp/webhook-signature headers",
    );
  }

  const timestampSeconds = Number(timestamp);
  if (
    !Number.isFinite(timestampSeconds) ||
    Math.abs(Date.now() / 1000 - timestampSeconds) > TOLERANCE_SECONDS
  ) {
    throw new WebhookVerifyError("stale_timestamp", "Webhook timestamp outside tolerance window");
  }

  const body = await request.text();
  const signedContent = `${id}.${timestamp}.${body}`;

  const secretBase64 = secret.startsWith("whsec_") ? secret.slice("whsec_".length) : secret;
  const secretBytes = base64ToBytes(secretBase64);
  const expected = await hmacSha256Base64(secretBytes, signedContent);

  const candidates = signatureHeader
    .split(" ")
    .map((part) => part.split(",")[1])
    .filter((value): value is string => Boolean(value));

  const isValid = candidates.some((candidate) => constantTimeEqual(candidate, expected));
  if (!isValid) {
    throw new WebhookVerifyError("invalid_signature", "Invalid webhook signature");
  }

  try {
    return JSON.parse(body);
  } catch {
    throw new WebhookVerifyError("invalid_json", "Invalid JSON in webhook body");
  }
}
