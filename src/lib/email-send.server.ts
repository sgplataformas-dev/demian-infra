// Envio de e-mail transacional via Resend (https://resend.com), no lugar do
// relay de e-mail da Lovable Cloud (@lovable.dev/email-js). Mesma forma de
// outras integracoes deste projeto: fetch direto contra a API REST, sem SDK.
//
// PLACEHOLDER: defina RESEND_API_KEY no .env.local / Vercel antes de usar em
// producao. Se preferir outro provedor (Postmark, SES, etc.), troque apenas
// o corpo de sendTransactionalEmail — o restante do pipeline (fila, retries,
// DLQ) nao precisa mudar.

export class EmailSendError extends Error {
  status: number;
  retryAfterSeconds: number | null;
  constructor(status: number, message: string, retryAfterSeconds: number | null = null) {
    super(message);
    this.name = "EmailSendError";
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export type TransactionalEmailPayload = {
  to: string;
  from: string;
  subject: string;
  html: string;
  text?: string;
  message_id?: string;
  idempotency_key?: string;
};

function parseRetryAfter(header: string | null): number | null {
  if (!header) return null;
  const parsed = Number(header);
  if (!Number.isNaN(parsed)) return parsed;
  const date = new Date(header);
  return Number.isNaN(date.getTime())
    ? null
    : Math.max(0, Math.ceil((date.getTime() - Date.now()) / 1000));
}

export async function sendTransactionalEmail(payload: TransactionalEmailPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY");
  }

  const idempotencyKey = payload.idempotency_key ?? payload.message_id;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers,
    body: JSON.stringify({
      to: payload.to,
      from: payload.from,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    const safeErrorText = errorText.length > 500 ? `${errorText.slice(0, 500)}...` : errorText;
    throw new EmailSendError(
      response.status,
      `Resend API error: ${response.status} ${safeErrorText}`,
      parseRetryAfter(response.headers.get("Retry-After")),
    );
  }
}
