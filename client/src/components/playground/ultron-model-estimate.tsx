// ULTRON PRIME model estimate, shown under the Playground model picker.
//
// Honest by construction: every model here rides a free tier, so the cost is
// always $0.00 — what varies is the token estimate for THIS prompt and how
// fast the model class tends to answer. The speed label is relative (size
// tier), not a measured number; the real latency of each reply shows in the
// inspector after it lands.
//
// Token estimate: ~4 characters per token, labelled with ≈. Nothing here is
// sent to the server and nothing changes the request.

const SPEED_LABELS: Record<number, string> = {
  1: 'Deep · slowest',
  2: 'Balanced',
  3: 'Fast',
  4: 'Fastest',
}

export function UltronModelEstimate({
  isRouted,
  sizeTier,
  intelligenceRank,
  providerCount,
  promptChars,
  maxTokens,
}: {
  /** True for auto / fusion / auto:<chain>: the router picks the model, so
      there is no per-model estimate until the reply lands. */
  isRouted: boolean
  sizeTier: number
  intelligenceRank: number
  providerCount: number
  /** Characters in the current prompt: composer + system prompt + staged text files. */
  promptChars: number
  /** max_tokens when the knob is switched on, otherwise null (provider default). */
  maxTokens: number | null
}) {
  const tokensIn = Math.max(0, Math.ceil(promptChars / 4))
  const speed = SPEED_LABELS[sizeTier] ?? '—'

  return (
    <div className="space-y-0.5 rounded-lg border border-border/60 bg-muted/40 px-2.5 py-2 text-[11px] leading-snug text-muted-foreground">
      <div className="flex items-center justify-between gap-2">
        <span>
          ≈ {tokensIn.toLocaleString()} tokens in
          {maxTokens !== null ? ` · up to ${maxTokens.toLocaleString()} out` : ' · out: provider default'}
        </span>
        <span className="shrink-0 font-medium text-foreground">$0.00</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        {isRouted ? (
          <span>Auto routing — free tier, estimate after the reply</span>
        ) : (
          <span>
            Speed: {speed}
            {intelligenceRank < 999 ? ` · rank #${intelligenceRank}` : ''}
            {providerCount > 1 ? ` · ${providerCount} providers` : ''}
          </span>
        )}
        <span className="shrink-0">free tier</span>
      </div>
    </div>
  )
}
