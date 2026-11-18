// ULTRON PRIME request inspector: the raw request the Playground just sent
// and what came back, in one scrollable panel.
//
// Request: the exact JSON body + headers (Authorization shown masked).
// Response: status, measured latency, routed-via, fallback attempts, real
// token usage when the provider reported it — and the answer preview. A
// streamed reply is labelled as reconstructed from deltas; the buffered path
// shows the full raw JSON.
//
// Copy as cURL puts the REAL local unified key on the clipboard (without it
// the command would fail) — the panel says so next to the button.

import { TerminalSquare } from 'lucide-react'
import { CopyButton } from '@/components/copy-button'
import {
  buildCurl,
  displayBody,
  displayHeaders,
  type UltronRequestRecord,
} from '@/lib/ultron-request-record'

function StatusBadge({ record }: { record: UltronRequestRecord }) {
  if (record.responseKind === 'pending') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <span className="ultron-live-dot size-1.5 rounded-full" />
        streaming…
      </span>
    )
  }
  if (record.responseKind === 'error') {
    return <span className="text-[11px] font-medium text-destructive">error{record.status ? ` · HTTP ${record.status}` : ''}</span>
  }
  return (
    <span className="text-[11px] font-medium text-foreground">
      HTTP {record.status ?? 200}
      {record.latencyMs != null ? ` · ${record.latencyMs.toLocaleString()} ms` : ''}
    </span>
  )
}

export function UltronInspector({ record }: { record: UltronRequestRecord | null }) {
  if (!record) {
    return (
      <div className="space-y-1 rounded-xl border border-border/60 bg-card px-3 py-2.5 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">No request recorded yet</p>
        <p>Send a message and the exact request + response will appear here — method, headers, JSON body, latency, token usage, and a copy-as-cURL button.</p>
      </div>
    )
  }

  const bodyText = JSON.stringify(displayBody(record.body), null, 2)
  const usage = record.usage

  return (
    <div className="space-y-3 rounded-xl border border-border/60 bg-card px-3 py-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium">
          <TerminalSquare className="size-4" />
          Request inspector
        </span>
        <StatusBadge record={record} />
        <span className="ms-auto flex items-center gap-1">
          <CopyButton text={bodyText} label="Copy request JSON" className="size-6" />
          <CopyButton text={buildCurl(record)} label="Copy as cURL" className="size-6" />
        </span>
      </div>

      <div className="space-y-1">
        <p className="font-mono text-[11px] break-all">
          <span className="font-semibold">{record.method}</span> {record.url}
        </p>
        <div className="space-y-0.5 font-mono text-[11px] text-muted-foreground">
          {displayHeaders(record.headers).map(h => (
            <p key={h.name} className="break-all">
              <span className="text-foreground/80">{h.name}:</span> {h.value}
            </p>
          ))}
        </div>
        <pre className="ultron-inspector-scroll max-h-44 overflow-auto rounded-lg bg-muted/50 p-2 font-mono text-[11px] leading-relaxed whitespace-pre-wrap break-words">
          {bodyText}
        </pre>
      </div>

      <div className="space-y-1 border-t border-border/60 pt-2">
        <p className="text-xs font-medium">Response</p>
        <p className="text-[11px] text-muted-foreground">
          {record.responseKind === 'stream' && 'Streamed (SSE) — reconstructed from deltas. '}
          {record.responseKind === 'json' && 'Buffered JSON response. '}
          {record.routedVia ? <>Routed via <span className="font-mono text-foreground/80">{record.routedVia}</span>. </> : null}
          {record.fallbackAttempts != null && record.fallbackAttempts > 0 ? <>{record.fallbackAttempts} fallback{record.fallbackAttempts > 1 ? 's' : ''}. </> : null}
          {usage?.total_tokens != null ? (
            <>Tokens: {usage.prompt_tokens ?? '?'} in / {usage.completion_tokens ?? '?'} out / {usage.total_tokens} total. </>
          ) : record.responseKind !== 'pending' && record.responseKind !== 'error' ? (
            <>No usage frame reported by the provider. </>
          ) : null}
          {record.finishReason ? <>Finish: <span className="font-mono">{record.finishReason}</span>. </> : null}
          {record.error ? <span className="text-destructive">{record.error}</span> : null}
        </p>
        {record.responseRaw ? (
          <pre className="ultron-inspector-scroll max-h-44 overflow-auto rounded-lg bg-muted/50 p-2 font-mono text-[11px] leading-relaxed whitespace-pre-wrap break-words">
            {record.responseRaw}
          </pre>
        ) : record.responsePreview ? (
          <pre className="ultron-inspector-scroll max-h-44 overflow-auto rounded-lg bg-muted/50 p-2 font-mono text-[11px] leading-relaxed whitespace-pre-wrap break-words">
            {record.responsePreview}
          </pre>
        ) : null}
      </div>

      <p className="text-[10px] leading-snug text-muted-foreground">
        Copy as cURL includes your local unified key — share it carefully.{' '}
        <span className="ultron-kbd">Ctrl+Enter</span> send ·{' '}
        <span className="ultron-kbd">Ctrl+Alt+N</span> new chat ·{' '}
        <span className="ultron-kbd">Ctrl+Alt+I</span> toggle inspector
      </p>
    </div>
  )
}
