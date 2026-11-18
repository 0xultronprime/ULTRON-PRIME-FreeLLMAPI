// ULTRON PRIME request inspector: the record of the last Playground request
// and what came back, plus the helpers that render it safely.
//
// The request body is the exact JSON sent to POST /v1/chat/completions. The
// response for a streamed reply is reconstructed from the deltas (the SSE
// frames themselves are not retained) — the panel labels it as such. Token
// usage comes from the stream's trailing usage frame when the provider sends
// one, so it is real accounting, not an estimate.
//
// Safety: the Authorization header carries the local unified key. The panel
// always DISPLAYS it masked; only an explicit "Copy as cURL" click puts the
// real key on the clipboard, and the panel says so next to the button.

export interface UltronRequestHeader {
  name: string
  value: string
}

export interface UltronUsage {
  prompt_tokens?: number
  completion_tokens?: number
  total_tokens?: number
}

export type UltronResponseKind = 'pending' | 'stream' | 'json' | 'error'

export interface UltronRequestRecord {
  id: string
  startedAt: number
  method: 'POST'
  url: string
  headers: UltronRequestHeader[]
  /** The exact JSON body sent. */
  body: unknown
  status?: number
  latencyMs?: number
  routedVia?: string | null
  fallbackAttempts?: number | null
  usage?: UltronUsage
  finishReason?: string
  responseKind: UltronResponseKind
  /** First chunk of the answer (stream) or the full JSON (buffered path). */
  responsePreview?: string
  /** Full raw response JSON, only on the buffered / error paths. */
  responseRaw?: string
  error?: string
}

/** Rough token count for display only: ~4 chars per token, labelled with ≈. */
export function estimateTokens(text: string): number {
  return Math.max(0, Math.ceil(text.length / 4))
}

function maskValue(name: string, value: string): string {
  if (/^authorization$/i.test(name)) {
    const scheme = value.split(' ')[0] ?? 'Bearer'
    const token = value.split(' ').slice(1).join(' ') || value
    const tail = token.length > 4 ? token.slice(-4) : '••••'
    return `${scheme} ••••••••${tail}`
  }
  return value
}

/** Headers as the panel shows them: Authorization masked, everything else as-is. */
export function displayHeaders(headers: UltronRequestHeader[]): UltronRequestHeader[] {
  return headers.map(h => ({ name: h.name, value: maskValue(h.name, h.value) }))
}

/** Truncate one value for display: data-URL images collapse to a placeholder,
// long strings are cut with their length kept. */
function sanitizeValue(value: unknown, depth: number): unknown {
  if (typeof value === 'string') {
    if (value.startsWith('data:image/')) {
      const mime = value.slice(0, value.indexOf(';'))
      return `<${mime} image data, ${value.length.toLocaleString()} chars — elided>`
    }
    if (value.length > 2000) {
      return `${value.slice(0, 2000)}… [truncated, ${value.length.toLocaleString()} chars total]`
    }
    return value
  }
  if (Array.isArray(value)) {
    return depth > 4 ? `[${value.length} items]` : value.map(v => sanitizeValue(v, depth + 1))
  }
  if (value && typeof value === 'object') {
    if (depth > 4) return '{…}'
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, sanitizeValue(v, depth + 1)]),
    )
  }
  return value
}

/** The request body as the panel shows it (and as cURL sends it). */
export function displayBody(body: unknown): unknown {
  return sanitizeValue(body, 0)
}

function shellQuote(text: string): string {
  return `'${text.replace(/'/g, `'\\''`)}'`
}

/** A runnable cURL for the recorded request. Uses the REAL Authorization
// header (without it the request would fail) and the sanitised body — image
// payloads are elided, so a request with staged images is marked as such. */
export function buildCurl(record: UltronRequestRecord): string {
  const lines = [`curl -X ${record.method} ${shellQuote(record.url)}`]
  for (const h of record.headers) {
    lines.push(`  -H ${shellQuote(`${h.name}: ${h.value}`)}`)
  }
  lines.push(`  --data ${shellQuote(JSON.stringify(displayBody(record.body)))}`)
  return lines.join(' \\\n')
}
