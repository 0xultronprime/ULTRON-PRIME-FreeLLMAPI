# VIDEO PLAN — ULTRON PRIME FreeLLMAPI rebuild

**Channel:** ULTRON PRIME — https://www.youtube.com/@ultronprime_zero
**Format:** 8–10 min, 16:9, screen-recorded demo + voiceover
**Repo:** ULTRON PRIME FreeLLMAPI (fork of tashfeenahmed/freellmapi)
**Rule for the whole video:** your own keys, your own machine. Every demo
uses the local server on `localhost` — never show a real provider key, a real
unified key, or anyone else's account on screen. Blur keys wherever they
appear; the Keys page shows secrets, so record it with keys already added
and the values hidden.

---

## Outline

### 0:00–0:45 — HOOK
- "87 free AI providers. 1,313 free model endpoints. 10 billion tokens a
  month. One endpoint — and you never pay for the models."
- Show the original repo's README numbers + the GitHub stars.
- "I rebuilt it as ULTRON PRIME FreeLLMAPI — same router, new black/red
  theme, and four features the original doesn't have. Here's what changed,
  and the live demo."

### 0:45–2:30 — WHAT THE ORIGINAL DOES
- Who built it: tashfeenahmed — credit on screen, link in description.
  This is a fork, not my original work.
- The idea in one line: you add your own free-tier provider keys once, and
  every app talks to one OpenAI-compatible endpoint (`/v1`) with one
  unified key.
- The router: picks the best healthy model per request, fails over to the
  next provider on 429/5xx, tracks every free-tier cap (RPM/RPD/TPM/TPD).
- Quick tour: Keys page (providers), Models page (catalog), Playground
  (chat), Fallback chains, Fusion, Analytics.

### 2:30–4:30 — WHAT'S NEW IN THE ULTRON PRIME VERSION
- Rebrand: black/red/silver theme, dark-first, channel logo + banner in
  `client/public/assets/`, `PROTOCOL • BYPASS • OVERRIDE` in the header.
- NEW 1 — Saved presets: save a setup (model + system prompt + sampling +
  web search) under a name, load it back in one click. Show saving "Deep
  research" and loading it again.
- NEW 2 — Request inspector: send a message, open the Inspector, show the
  exact JSON request, the routed-via model, the measured latency, the real
  token usage — then "Copy as cURL" and paste it into a terminal.
- NEW 3 — Cost / latency estimate under the model picker: token estimate
  for the prompt you're typing, speed class of the model — and the honest
  part: cost is always $0.00, because these are free tiers.
- NEW 4 — Keyboard shortcuts: `Ctrl+Enter` sends, `Ctrl+Alt+N` new chat,
  `Ctrl+Alt+I` toggles the inspector.

### 4:30–7:30 — LIVE DEMO (screen recording, terminal)
1. `npm install` → `npm run build` → show the build passing (server +
   CLI + client). Open `client/dist` to prove the dashboard built.
2. `node server/dist/index.js` → server boots on `:3001`, catalog sync
   runs, DB seeds. `curl localhost:3001/api/ping` → 200.
3. `curl localhost:3001/v1/models -H "Authorization: Bearer …"` →
   models list, `auto` + `fusion` always there. (Key blurred on screen.)
4. Dashboard: add one free provider key (e.g. Groq) in Keys — blur the
   key while typing. Playground: pick a model, watch the estimate update
   as you type, send a question.
5. Inspector: show the raw request + response, copy as cURL, run it in
   the terminal and show the same answer coming back.
6. Presets: save the setup as "Deep research", switch models, load the
   preset back — everything restores.

### 7:30–8:30 — SCOPE & HONEST LIMITS
- Say it plainly: free tiers have caps — frontier models have the smallest
  daily allowances, quality degrades through the day and resets at UTC
  midnight. This is personal experimentation, not production, no SLA.
- One account per provider, no reselling, don't share the endpoint, don't
  hammer a free tier as production — same rules as the original.
- What this fork does NOT do: it doesn't give you paid models for free,
  it doesn't bypass any provider's limits, and a $0.00 estimate is not a
  promise of unlimited usage — the caps are real.

### 8:30–9:30 — OUTRO + LINKS
- Recap in one line: "87 providers in, one endpoint out — now in
  ULTRON PRIME black and red, with presets, a real request inspector,
  and honest $0.00 estimates."
- Links (description + pinned comment):
  - ULTRON PRIME FreeLLMAPI repo (this fork)
  - Original: github.com/tashfeenahmed/freellmapi
  - ULTRON PRIME channel: youtube.com/@ultronprime_zero
- Call to action: "Next video — I take this router and wire it into a
  real app. Subscribe so you don't miss it."

---

## B-roll / graphics checklist
- [ ] Original repo README numbers screenshot (87 providers / 1,313 endpoints)
- [ ] Channel logo + banner (client/public/assets/)
- [ ] Terminal recordings for each demo step (record clean, no typos)
- [ ] Browser shot of the ULTRON PRIME dashboard (dark theme, header logo)
- [ ] Close-up of the Inspector panel + the estimate under the model picker
- [ ] Lower-third: "YOUR OWN KEYS — local server only" during the Keys demo

## Pre-publish checks
- [ ] No real provider key, unified key, or setup code visible in any frame
- [ ] Original author credited in video + description (tashfeenahmed)
- [ ] License note in description (MIT)
- [ ] Links verified (fork repo, original repo, channel)
