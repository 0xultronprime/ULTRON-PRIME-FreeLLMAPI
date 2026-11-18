// ULTRON PRIME presets section for the Playground settings rail.
//
// Saves the current setup — model, system prompt, sampling knobs, web-search
// toggle — under a name, and loads it back in one click. Presets live in
// localStorage (lib/ultron-presets.ts); this component owns no state, every
// change goes up to PlaygroundPage, like the rest of the rail.

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SamplingSettings } from '@/lib/playground-sampling'
import type { UltronPreset } from '@/lib/ultron-presets'

export interface UltronPresetCurrent {
  model: string
  systemPrompt: string
  sampling: SamplingSettings
  webSearch: boolean
}

export function UltronPresets({
  presets,
  current,
  onSave,
  onLoad,
  onDelete,
}: {
  presets: UltronPreset[]
  current: UltronPresetCurrent
  onSave: (name: string) => void
  onLoad: (preset: UltronPreset) => void
  onDelete: (id: string) => void
}) {
  const [name, setName] = useState('')

  const save = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    onSave(trimmed)
    setName('')
  }

  return (
    <div className="space-y-2">
      <div className="space-y-0.5">
        <span className="ultron-section-label block">ULTRON Presets</span>
        <p className="text-[11px] leading-snug text-muted-foreground">
          Save this setup — model, system prompt, sampling, web search — and load it back in one click.
        </p>
      </div>
      <div className="flex gap-1.5">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); save() } }}
          placeholder="Preset name, e.g. Deep research"
          aria-label="Preset name"
          maxLength={80}
          className="h-8 min-w-0 flex-1 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        />
        <Button
          type="button"
          size="sm"
          disabled={name.trim().length === 0}
          onClick={save}
        >
          Save
        </Button>
      </div>
      {presets.length === 0 ? (
        <p className="text-[11px] text-muted-foreground">
          No presets yet. Current setup: <span className="font-mono">{current.model}</span>
          {current.systemPrompt.trim() ? ' + system prompt' : ''}.
        </p>
      ) : (
        <ul className="space-y-1">
          {presets.map(p => (
            <li
              key={p.id}
              className="group flex items-center gap-1 rounded-lg border border-border/60 px-2 py-1.5"
            >
              <button
                type="button"
                onClick={() => onLoad(p)}
                title={`Load preset "${p.name}" — model ${p.model}`}
                className="min-w-0 flex-1 truncate text-left text-xs font-medium hover:text-primary"
              >
                {p.name}
                <span className="block truncate font-mono text-[10px] font-normal text-muted-foreground">
                  {p.model}
                </span>
              </button>
              <button
                type="button"
                onClick={() => onDelete(p.id)}
                aria-label={`Delete preset ${p.name}`}
                title={`Delete preset ${p.name}`}
                className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:text-destructive"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
