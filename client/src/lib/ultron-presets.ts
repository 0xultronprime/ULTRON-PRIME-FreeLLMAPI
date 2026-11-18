// ULTRON PRIME presets for the Playground: save a named bundle of everything
// that shapes the NEXT request — model, system prompt, sampling knobs and the
// web-search toggle — and load it back in one click.
//
// Stored in localStorage only (same as the sampling knobs and the system
// prompt); nothing leaves the browser and nothing touches the server.
// Pure on purpose (bar the two localStorage wrappers at the bottom), in the
// same style as lib/playground-sampling.ts.

import { normalizeSampling, type SamplingSettings } from './playground-sampling'

/** localStorage key holding the Playground's saved presets. */
export const ULTRON_PRESETS_KEY = 'ultron.playground.presets.v1'

export interface UltronPreset {
  id: string
  name: string
  model: string
  systemPrompt: string
  sampling: SamplingSettings
  webSearch: boolean
  createdAt: number
}

export type UltronPresetDraft = Omit<UltronPreset, 'id' | 'createdAt'>

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

/** One stored row forced back into shape; null when it is not a preset at all. */
export function parsePreset(raw: unknown): UltronPreset | null {
  if (!isRecord(raw)) return null
  if (typeof raw.id !== 'string' || raw.id.length === 0) return null
  if (typeof raw.name !== 'string' || raw.name.trim().length === 0) return null
  if (typeof raw.model !== 'string' || raw.model.length === 0) return null
  return {
    id: raw.id,
    name: raw.name.trim().slice(0, 80),
    model: raw.model,
    systemPrompt: typeof raw.systemPrompt === 'string' ? raw.systemPrompt : '',
    sampling: normalizeSampling(raw.sampling),
    webSearch: raw.webSearch === true,
    createdAt: typeof raw.createdAt === 'number' ? raw.createdAt : 0,
  }
}

/** A stored list forced back into shape; a corrupt entry costs that preset, never the list. */
export function parsePresets(raw: string | null | undefined): UltronPreset[] {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .map(parsePreset)
      .filter((p): p is UltronPreset => p !== null)
      .sort((a, b) => b.createdAt - a.createdAt)
  } catch {
    return []
  }
}

export function serializePresets(presets: UltronPreset[]): string {
  return JSON.stringify(presets.map(p => ({
    id: p.id,
    name: p.name,
    model: p.model,
    systemPrompt: p.systemPrompt,
    sampling: p.sampling,
    webSearch: p.webSearch,
    createdAt: p.createdAt,
  })))
}

export function readPresets(): UltronPreset[] {
  try {
    return parsePresets(localStorage.getItem(ULTRON_PRESETS_KEY))
  } catch {
    return []
  }
}

export function writePresets(presets: UltronPreset[]): void {
  try {
    localStorage.setItem(ULTRON_PRESETS_KEY, serializePresets(presets))
  } catch {
    // Private-mode / disabled storage: presets just do not persist.
  }
}

function newPresetId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

/** A draft saved as a new preset (newest first). Same name twice is allowed —
// the id, not the name, is the identity. */
export function createPreset(draft: UltronPresetDraft): UltronPreset {
  return {
    ...draft,
    name: draft.name.trim().slice(0, 80),
    systemPrompt: draft.systemPrompt ?? '',
    sampling: normalizeSampling(draft.sampling),
    webSearch: draft.webSearch === true,
    id: newPresetId(),
    createdAt: Date.now(),
  }
}
