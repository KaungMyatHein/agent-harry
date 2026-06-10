# Competitive Analysis

Snapshot of the competitive landscape for Agent Harry, researched 2026-06-10. Developer-facing, like `RATIONALE.md` — agents never load this file at runtime.

**TL;DR:** No competitor covers the full Discovery → Define → Deliver → Handoff pipeline. The middle of the pipeline (hi-fi screens, prototype code) is being commoditized — fast and nearly free. Agent Harry's defensible position is the combination of **context-embedded prototyping** (the system knows your research, PRD, persona, fingerprint, and codebase) and **process governance** (Stop Gates + audit ledger). Frame the product as *agentic design*, not as "18 subagents."

---

## Positioning: Vibe Design vs Agentic Design

The one-line frame:

> **Vibe design generates screens. Agentic design runs the design process — with a human at every gate.**

The distinction is drawn on **process, not technology**. Figma's Design Agent and Stitch's real-time agent are technically agents too — they use tools and run multi-step generation. What they don't own is the process. Defining the split by process keeps the frame intact no matter how agentic the generation tools become:

- **Vibe design** = telling an agent to produce a screen. Iterate by feel until it looks right.
- **Agentic design** = agents running the design process itself — research, definition, exploration, validation, handoff — with the human approving at every gate.

| | Vibe Design (Stitch, Figma Make, Figma Agent, one-shot Claude) | Agentic Design (Agent Harry) |
|---|---|---|
| Loop | prompt → look → "not quite" → re-prompt | diagnose → plan → execute → validate → handoff |
| Quality judged by | Feel — "does it look right?" | Criteria — persona fit, fingerprint compliance, success metrics |
| Context | Lives in the user's head; re-typed into every prompt | Embedded in the system (PRD, persona, fingerprint, codebase) |
| Decision trail | None — no record of why this layout won | Audit ledger + lo-fi alternatives + gate decisions |
| Output | Screens | Decided design + runnable prototype + handoff spec |

Honest caveats baked into the frame:

- "Agentic" is often read as *fully autonomous*. Harry's differentiator is the opposite: **governed autonomy** — Stop Gates, refuse-with-opt-out, ledger receipts. The 2026 "operator UX" literature independently names approvals + receipts + audit logs as the trust mechanism for agent autonomy, so the human-in-the-loop model is a strength to lead with, not soften.
- Harry's prototype output is **prototype-grade with production-visual polish** (D2/D3): real DS components and tokens, all 5 states, mock API with what's-faked documented. Say "production-visual prototype," not "production-ready" — the handoff spec is where engineering takes over.

---

## What "designing with Agent Harry" means vs generation tools

The difference is not the output. It is what the system knows before it draws, and what happens after.

**1. What it knows (context embedding)**

| | Stitch / Make / Figma Agent | Agent Harry |
|---|---|---|
| Input | Prompt (+ DS tokens, for Figma Agent) | Prompt + discovery research + PRD + persona + journey + fingerprint + entry-point + existing codebase |
| Your existing screens | Unknown | Entry-point continuity — new screens visually continue from the screen the user arrives from |
| Who the user is | Unknown | Persona task language ("Pull up existing patient", not "Search users") |
| Why this feature exists | Unknown | Flows down from research → PRD |

Analogy: generation tools are a talented freelancer who has never seen your product. Agent Harry is the in-house designer who knows its history.

**2. How it works (decision-first, not generate-first)**

Generation tools produce first and let you react. Harry decides first: lo-fi presents three layouts (Primary / Alternative / Risky), the user picks, success metrics get confirmed, and only then does hi-fi or code get built. Every decision crosses a Stop Gate and lands in the ledger.

**3. What comes out (in your repo, not a sandbox)**

The code-first path generates inside your repository, in your stack, using your actual DS components and tokens — with all 5 states (empty / loading / populated / error / edge), a mock API, and state-toggle routes. Then `handoff-engineer` produces the engineering spec. Generation tools output frames or sandbox code that must be ported.

**4. What happens at feature #10 (consistency over time)**

Each generation in a vibe tool is independent — five features can come out in five styles (Figma Agent holds tokens well, but not composition patterns). Harry's fingerprint enforces visual DNA and anti-patterns on every feature.

**Where vibe tools win** — be honest about this:

- Greenfield / idea exploration: no product exists yet, Stitch/Make show something in 5 minutes; Harry's gates make it slower.
- One-off screens / marketing pages: context-free work doesn't need the pipeline.
- Raw visual polish: dedicated rendering pipelines can out-shine MCP-driven frame generation.

Harry is built for the product designer's actual day job: **adding features to an existing product.**

---

## Competitor group 1: AI design / design-to-code tools

Workflow coverage matrix (researched June 2026):

| Tool | Research | PRD | Lo-fi | Hi-fi | Code | Usability testing | Eng handoff | DS consistency |
|------|----------|-----|-------|-------|------|---------|---------|----------------|
| **Agent Harry** | ✅ | ✅ | ✅ | ✅ (Figma MCP) | ✅ in your repo | plan only | ✅ specs | ✅ fingerprint |
| Figma Make / Design Agent | – | – | ✅ | ✅ | prototype-grade | – | Dev Mode | ✅ best-in-class tokens |
| Lovable | – | – | – | rendered | ✅ full-stack, own sandbox | – | – | ✅ token panel + auto-verify |
| v0 (Vercel) | – | – | – | rendered | ✅ prod, own sandbox | – | code = handoff | shadcn tokens |
| Bolt.new | – | – | – | rendered | ✅ full-stack | – | – | templates only |
| Google Stitch (free) | – | – | – | ✅ | export | – | – | generated DS |
| UX Pilot | – | – | ✅ | ✅ | basic | predictive heatmaps only | – | partial |
| Magic Patterns | – | – | – | ✅ | ✅ | feedback links | export | ✅ DS import (Pro+) |
| Subframe | – | – | – | ✅ in code | ✅ prod React | – | eliminated | ✅ token cascade |
| Uizard | – | – | ✅ | mid-fi | – | – | basic | weak |
| Relume | – | – | ✅ + sitemap | mid-fi | components | – | export | its DS, not yours |
| ChatPRD | partial | ✅ | – | – | – | – | – | n/a |
| Maze / Dovetail | ✅ real users | – | – | – | – | ✅ real users | – | n/a |

Key reads:

- **Every tool is a point solution.** Matching Harry's scope requires stitching ChatPRD + Figma + v0/Lovable + Maze (~$60–150+/mo, 3–4 subscriptions) with manual context transfer between them. Harry runs at ~$1–2/feature with persistent context.
- **The middle is commoditizing.** Google Stitch is free with Google distribution; Figma's Design Agent (beta, May 2026) generates DS-faithful frames natively. Motiff's shutdown (June 2026) shows mid-pipeline-only AI design tools consolidating toward Figma/Google.
- **Real-user testing is a genuine gap.** Harry plans tests; Maze runs them with real users. An MCP integration (Maze / UserTesting) is the natural fill.

---

## Competitor group 2: Claude Code agent frameworks

| System | Stars (2026-06) | Orchestration | HITL gates | Design depth |
|--------|-------|---------------|-----------|--------------|
| BMAD Method v6 | 48.9k | ✅ 4-phase gated | ✅ strongest in the field | low (one generic UX persona) |
| wshobson/agents | 36.6k | plugin marketplace | – | low |
| SuperClaude | 23.2k | behavioral injection | – | low |
| VoltAgent catalog | 21.5k | none (catalog) | – | low |
| contains-studio/agents | 12.4k | none (flat) | – | medium personas, **dormant since 2025-07** |
| SuperDesign | 6.6k | single agent | iteration only | Deliver-only |
| OneRedOak design-review | ~3.5k | single workflow | advisory | review-only |
| **Agent Harry** | personal | staged pipeline | ✅ always-on Stop Gates | **deep + end-to-end (unique)** |

Key reads:

- **No installable end-to-end agentic UX pipeline exists.** BMAD is closest in process discipline but engineering-first (no visual system, no Figma integration, no ledger). contains-studio is closest in design personas but flat, gateless, and dead. SuperDesign is closest in output but single-agent, Deliver-only.
- **Anthropic is absorbing the orchestration layer.** Native Agent Teams and Dynamic Workflows (May 2026) commoditize generic multi-agent orchestration. What remains defensible is domain opinion + governance — never market Harry as "18 subagents."
- **Distribution gap.** Every high-adoption competitor ships via the plugin-marketplace pattern. Packaging Harry as a Claude Code plugin is the obvious reach move.

---

## Threat assessment

Ranked by what actually threatens the system, not what looks similar:

| Threat | What it touches | Severity |
|--------|-------------|----------|
| BMAD shipping a UX module on its 49k-star community | The whole pipeline concept | 🔴 highest structural risk |
| Subframe / Onlook maturing context-aware code design | Code-first path's context edge | 🟠 watch |
| Figma Design Agent | `figma-designer` path only — 1 of 18 agents | 🟡 secondary; usable as a layer (Harry's figma-designer can orchestrate it: Harry keeps research/PRD/gates upstream) |
| v0 / Lovable | Prototype code — but in their sandboxes, their stacks, no repo/persona/fingerprint context | 🟡 secondary |
| Google Stitch free generation | Makes "generate screens" table stakes | 🟡 erodes the middle, not the system |
| Token-cost criticism of 18 sequential agents | Perception (BMAD v4/5 took the same hit) | 🟡 keep publishing the $1–3 ceiling story |

A common misread (including in early drafts of this analysis): treating Figma Agent as the top threat. It isn't — Agent Harry is not a Figma design generator. It is a **context-embedded prototyping system**; Figma Agent overlaps with one deliver path and can be absorbed as infrastructure the same way the Figma MCP already is.

---

## Strategic recommendations

1. **Reposition the headline.** Not "18 subagents" — "a governed, context-embedded design pipeline." Orchestration is a commodity; domain opinion + governance is the moat.
2. **Treat Figma Agent as a layer, not a rival.** If its hi-fi generation gets better than `use_figma` calls, let `figma-designer` drive it. Upstream (research, PRD, gates, fingerprint) stays Harry's.
3. **Close the distribution gap.** Package as a Claude Code plugin / marketplace listing.
4. **Acknowledge the real-user-testing gap.** `usability-tester` plans; Maze runs. An MCP bridge is the candidate fill.
5. **Keep the cost story loud.** The $1–3 per-pipeline ceiling and Opus/Sonnet routing pre-empt the "token hell" criticism that hit BMAD.
6. **Adopt the vocabulary.** "Vibe design vs agentic design" is the memorable frame — defined on process, with the human-at-every-gate qualifier attached.

---

## Sources

Researched 2026-06-10 via web search. Key sources: Vercel v0 blog + pricing, Lovable docs + Google Cloud press release (2026-06-03), Figma Design Agent launch blog + AI-credit docs, Google Stitch I/O 2026 coverage, Motiff discontinuation notice, UX Pilot / Magic Patterns / Subframe / Uizard / Relume official pricing, ChatPRD product pages, Maze 2026 AI research report, GitHub API star counts for BMAD-METHOD / wshobson/agents / SuperClaude / VoltAgent / contains-studio / SuperDesign / OneRedOak, InfoQ + quasa coverage of Claude Code Agent Teams and Dynamic Workflows, UX Planet / Digital Applied / icmd "agentic product design" and operator-UX articles.
