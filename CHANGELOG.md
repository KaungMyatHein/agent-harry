# Changelog

Most recent first. Format: `## YYYY-MM-DD — short summary`, then bullet list.

---

## 2026-06-16 — v5.2.4: Re-simulation regression fixes — 6 inconsistencies from the v5.2.x edits

**Patch, non-breaking.** A second full-pipeline simulation + adversarial re-audit of the v5.2.1–v5.2.3 fix-chains caught six inconsistencies the fixes themselves introduced. The two parallel re-audits confirmed every field/event chain otherwise consistent (IA handoff echo, brand_status enum, provisional chain, action-priority compliance shapes, audit-ledger tables). Fixed:

1. **(Critical) `ia_inferred` polarity inversion.** lo-fi's IA pre-intake (Check #3 table, refusal D, the skip-path steps) set `ia_inferred: false` when the IA was *skipped* — but the canonical frontmatter spec and BOTH Deliver readers (`design-engineer`, `figma-designer`) treat `ia_inferred: true` = skipped/no-map. A literal IA-skip would have written `false`, which readers interpret as "map exists" → they'd run action-priority compliance against an absent map. Aligned all five sites (lo-fi ×3, SHARED_CONTEXT ×2) to the canonical `skip ⇒ ia_inferred: true` (and the loaded path now explicitly sets `false`).
2. **(Med) Orchestrator Success-Metrics requirement still said "Check the chat history for the confirmation signal"** — contradicting the v5.2.2 durable `confirmed:` field. Now gates on the non-empty `confirmed:` timestamp.
3. **(Med) prd-author manifest schema mismatch** — the v5.2.2 "Framework" column made `cols` = 6 but the example rows still had 5 cells. Added the Framework cell to both example rows.
4. **(Low-Med) Value-prop boundary leftover** — pm-strategist's skill-integration table still listed a bare "Value proposition" deliverable, contradicting the v5.2.3 boundary. Annotated it "hypothesis only — hand the statement/canvas copy to product-positioner."
5. **(Low) Cold-Start Express Path over-promised** — it consolidated the four soft opt-outs but didn't note the **hard** Research-First Gate still applies on a zero-artifact cold start. Added that note (it only consolidates the soft opt-outs; it never bypasses the two hard gates).
6. **(Low) figma-designer's `ia_for_feature.screens` read dropped `nav_location`** vs lo-fi's writer spec + design-engineer's reader. Aligned the field list.

Lesson logged: every cross-agent edit needs a writer↔reader polarity/shape check — the Critical here was a value-inversion that mechanical "field exists in both files" checks pass but semantic checks catch.

## 2026-06-16 — v5.2.3: Pipeline-audit P2 fixes — clarity, provisional brand, anti-deadlock

**Patch, non-breaking.** Four of the five P2 (enhancement/maintainability) findings from the pipeline audit:

1. **Orchestrator ordering was scattered across six near-identical "Awareness" prose sections** — the sequence relationships between the project-level artifacts were never shown in one place. Added an **Artifact Ordering Map** table (artifact · when-proposed · who-enforces · blocks-what · cardinality · severity) + the canonical happy-path sequence at the top of the routing block. The detail sections remain; the table is the single source for the order.
2. **Client-brand Validation deadlock** — a client-brand decode required client sign-off the designer often can't get in-session, forcing either a fake `y` or an indefinite block. Added a **`provisional`** Validation Stop Gate state: saves the decode with `provisional_self_confirmed:` (and `validated:` empty), and downstream consumers load it while flagging `brand_provisional: true` — honest middle ground, re-run to `validated:` once the client confirms. Wired through brand-decoder, SHARED_CONTEXT, lo-fi, design-engineer, figma-designer (brand_status gains a `provisional` value).
3. **Brand concept had no staleness mechanism** (the fingerprint does) — added an age-based nudge: consumers surface "this decode is N months old" when the active timestamp is > ~9 months, advisory only (brand has no machine-checkable `lastModified`).
4. **pm-strategist ↔ product-positioner value-prop overlap** — made the split explicit in both agents: pm-strategist owns the value-prop **hypothesis** (strategic bet), product-positioner owns the value-prop **statement/copy** (Strategyzer canvas, shippable wording).

**Deliberately NOT done — fingerprint pre-intake shared-protocol extract (the 5th P2).** The audit flagged the ~70-line fingerprint pre-intake block as duplicated across agents. Extracting it to a shared file would break Agent Harry's deliberate **self-contained-agent** design principle (every agent is readable and runnable standalone, with its full refusal copy inline) and add an installed file. After v5.2.1 softened lo-fi's copy, only two agents (figma-designer, design-engineer) still share the identical hard-refuse block — a Low-severity drift risk not worth fighting the architecture for. Left inline by design; the canonical reference is `SHARED_CONTEXT.md` § Product Fingerprint.

This clears the pipeline-audit backlog (P0 → v5.2.1, P1 → v5.2.2, P2 → v5.2.3, minus the one intentional deferral).

## 2026-06-16 — v5.2.2: Pipeline-audit P1 fixes — durable gate signals + anti-friction

**Patch, non-breaking.** The four P1 findings from the v5.2.1 pipeline audit (pre-existing structural issues, not v5.2-specific) are now fixed:

1. **Success-Metrics Gate had no file-level confirmation signal** — "confirmed" lived only in conversation state, so `prd-author` (especially on a later or direct invocation) couldn't verify it. Added a durable `confirmed:` timestamp to the `pm-metrics-architect` handoff frontmatter (parallel to `brand-concept.md`'s `validated:`). The orchestrator stamps it when the Success-Metrics Gate clears on `y` (alongside the `gate_clear` event); `prd-author` and the gate now check the field, not memory. (`pm-metrics-architect`, `orchestrator`, `prd-author`, `SHARED_CONTEXT`.)
2. **prd-author ↔ feature-prioritizer contract was unpinned** — the prioritizer never declared an output path and prd-author hardcoded a "RICE" score column that broke under ICE/Kano/MoSCoW/CoD. Pinned the prioritizer's output to `./design-workspace/<slug>/define/prioritization.md` with a required `scoring_framework` + `items[]` (slug/score/tag) frontmatter contract; prd-author Globs that exact path and reads the framework instead of assuming RICE. Manifest column is now framework-agnostic ("Source score" + "Framework").
3. **Cold-start friction wall** — on a zero-artifact project, the serial refuse-with-opt-out checks (fingerprint, IA, brand, journey) stacked into a wall that punished the hurried "just prototype this" user. Added a **Cold-Start Express Path** to the orchestrator: on a clear speed signal, it surfaces ONE consolidated opt-out gate and routes straight to `lo-fi-designer`, instead of letting each agent refuse in turn.
4. **lo-fi-designer fingerprint was a hard block** — lo-fi is the cheapest, earliest exploration step, yet it required a ~$0.50 fingerprint curation before any ASCII wireframe. Softened lo-fi's fingerprint pre-intake to a **nudge that proceeds by default** (`visual_drift_risk: true`), while `figma-designer` / `design-engineer` keep the hard refuse (their output is where drift is expensive). Documented the agent-dependent severity in `SHARED_CONTEXT` § Product Fingerprint.

Remaining backlog (P2, not yet implemented): orchestrator ordering-table refactor, fingerprint pre-intake shared-protocol extract, client-brand `provisional` Validation state, brand-concept staleness nudge, pm-strategist↔positioner value-prop boundary.

## 2026-06-16 — v5.2.1: Pipeline-simulation fixes — 5 v5.2 wiring gaps closed

**Patch, non-breaking.** A full Discovery→Deliver **process simulation** plus a 3-cluster adversarial agent audit (all 20 agents) surfaced five P0 wiring bugs in the just-shipped v5.2 IA/brand integration. All were functional silent-fail risks (the IA/brand features would degrade quietly when used), not polish. Fixed:

1. **`ia_inferred` handoff break** — `lo-fi-designer` referenced an `ia_inferred` signal that it never actually wrote to its handoff frontmatter, so `design-engineer` couldn't detect an IA-skip. lo-fi now writes `ia_status` / `ia_inferred` / `ia_for_feature` (the per-feature `screen_inventory` + `action_priority_map` subset) + `brand_status` into frontmatter; both Deliver agents read the canonical field instead of inferring from prose (also a token win — they inherit the subset rather than re-loading the whole IA file).
2. **IA trusted an unvalidated brand concept** — `information-architect`'s brand pre-intake checked existence only, while the other four consumers gate on a non-empty `validated:` timestamp. Aligned to the 4-state table; an unvalidated decode is treated as absent.
3. **figma-designer parity gap** — the Figma-led Deliver path ignored the IA action-priority map and brand concept entirely, while the code-led path enforced both. figma-designer now consumes both (button **component** variants from the map, brand vocabulary for frame copy) with the same compliance attestation; the path is explicitly marked NOT exempt.
4. **Action-priority enforcement had no teeth** — it was advisory prose with no check or record, unlike the fingerprint (which has a compliance step + frontmatter attestation). Added an action-priority compliance check + per-screen `action_priority_compliance` frontmatter block to both Deliver agents.
5. **IA "refresh candidate" orphan** — the orchestrator routed to an IA refresh mode that didn't exist. Added `information-architect` **Mode B (Amend)** — incremental slot-in of a new feature mid-release (load existing IA, read only the new PRD, slot in without restructuring, diff + Stop Gate) — and pointed the orchestrator routing note at it.

`SHARED_CONTEXT.md` § Information Architecture "Enforcement (downstream)" updated to name figma-designer and document the handoff-echo + attestation contract. Remaining audit findings (P1: Success-Metrics `confirmed:` file signal, prioritizer path/score contract, cold-start express gate, lo-fi fingerprint soft-nudge; P2: orchestrator ordering-table refactor, fingerprint shared-protocol extract, client-brand `provisional` state, brand staleness nudge) are logged as backlog, not yet implemented.

## 2026-06-16 — v5.2: Atria gap-closing — information-architect + brand-decoder (18 → 20 agents)

**Additive, non-breaking.** Two new agents close three gaps surfaced by a real design-test rejection (the "Atria" assessment): messy information architecture, inconsistent action priorities, and brand-concept misalignment. Driven by a `/grill-me` session that resolved every branch of the design tree before a line was written. Both gaps were genuine capability holes — the pipeline was run in full and the output was still messy, which pointed at *missing owners*, not misuse.

The work principle for this release: **a once-per-product concern cannot live inside a per-feature agent.** That cardinality argument is why IA is its own agent rather than a beefed-up `lo-fi-designer`, and why brand-decode is its own agent rather than a section bolted onto `product-fingerprint-curator`.

- **Added — `information-architect` agent** (`templates/.claude/agents/information-architect.md`, Define phase, sonnet):
  - Runs **once per release**, between `prd-author` and the first `lo-fi-designer` run, producing `./design-workspace/<project_slug>/information-architecture.md`
  - Owns the cross-feature structure: **object model** (entities + relationships), **navigation hierarchy** (2 alternatives + 1 recommendation, grouped by user mental model not data model), **screen inventory** (one row per screen `lo-fi-designer` will design), and a product-wide **action-priority map**
  - The **Action-Priority Map** is the load-bearing fix for "inconsistent action priorities": Part A is 3–5 product-wide global invariants (one primary per screen, destructive never primary, consistent placement, same-action-same-priority); Part B is a per-object primary/secondary/tertiary table. `lo-fi-designer` reads it to *place* actions; `design-engineer` reads it to *assign button variants*
  - Five-step method: object model → job-to-object map → navigation structure → action-priority map → sitemap + screen inventory, ending at a Stop Gate before `lo-fi-designer` runs
- **Added — `brand-decoder` agent** (`templates/.claude/agents/brand-decoder.md`, cross-cutting, sonnet):
  - **Decodes an existing brand** (client work, design test, established product) into `<project-root>/brand-concept.md` — concept statement, worldview/values, mental model, vocabulary (use/avoid), on/off-brand tells. Recommended at Discovery start
  - Distinct from its siblings: `product-fingerprint-curator` captures how the product *looks* (and explicitly disclaims brand); `product-positioner` *creates* outward positioning. `brand-decoder` decodes existing brand *meaning* — the inward interpretive layer neither owned. If there's no brand to decode (greenfield), it refuses and routes to `product-positioner`
  - The **Validation Stop Gate** is the core mechanic: the decode is presented back with an explicit "is this how you (or your client) actually think about your brand?" — and for client work, flags that it must be validated *with the client*. An unvalidated decode is a hypothesis (`validated:` timestamp set only on confirmation), never trusted by downstream agents
- **Integration** — both are refuse-with-opt-out at their consumers, consistent with the fingerprint pattern (no new hard orchestrator gates):
  - `lo-fi-designer` gains Pre-Intake Check #3 (IA, refuse-with-opt-out → `ia_structure_skipped`) and #4 (brand concept, soft)
  - `design-engineer` reads the action-priority map for button variants and the brand vocabulary for copy
  - `product-positioner` + `ideation-facilitator` consume `brand-concept.md` at intake (refuse-with-opt-out → `brand_concept_skipped`)
  - `critique-partner` gains an **IA lens** — three checks: orphan screens, action-priority-map adherence, grouping-vs-rationale
  - `orchestrator` adds both to the roster + routing notes (`prd-author → information-architect → lo-fi-designer`; brand-decode recommended at Discovery start for existing brands)
- **Audit ledger schema** (`templates/SHARED_CONTEXT.md`): registers `ia_created`, `ia_structure_skipped`, `prds_skipped`, `brand_decoded`, `brand_concept_skipped`
- **SHARED_CONTEXT** gains two protocol sections — § Information Architecture and § Brand Concept — parallel to § Product Fingerprint
- **Deferred (out of v5.2 scope, by design):** no auto-detection of IA/brand drift (user-in-the-loop only; `critique-partner` surfaces on request); brand-decoder does not invent brands (greenfield → positioner); IA does not make visual decisions

### Why these and not a bigger change

The `/grill-me` session explicitly chose the *smallest structural addition that closes the gap*: refuse-with-opt-out (not new hard gates, to avoid orchestrator overload), two agents (not three — brand was kept separate from IA so neither owns two concerns), and concrete artifacts (the Action-Priority Map table, the Validation Stop Gate) rather than vague "be consistent / understand the brand" advice that wouldn't change downstream output.

## 2026-05-29 — v5.1: Multi-feature scaling readiness — 3 surgical additions, 6 ideas explicitly rejected

**Additive, non-breaking.** Three small surfaces that make Agent Harry more navigable as a project accumulates features, without introducing parallel storage or scope creep. Driven by a `/grill-me` session that stress-tested a 9-item improvement plan; six items were dropped (premature, duplicative, or scope-violating), three survived in reframed form.

The work principle for this release: **reuse existing infrastructure (audit ledger, fingerprint, SHARED_CONTEXT) before adding new files.** Two of the rejected ideas (`_features.yaml` registry, `_patterns.md` ledger) were specifically rejected to avoid the drift-from-second-source-of-truth problem.

- **Added — `/agent-harry-features` slash command** (`templates/.claude/commands/agent-harry-features.md`):
  - Read-only projection over `.harry-audit.jsonl` — lists every `feature_slug` ever recorded, with derived `first_seen`, `last_touched`, agents involved, `cost_delta` sum, and latest handoff path
  - Status (`active` / `stale` / `null`) is **inferred at render time** from the ledger — no `feature_status` field added to the schema, no `_features.yaml` written, no `deprecate` write command
  - Detail mode: `/agent-harry-features <slug>` shows full timeline for one feature
  - Filters: `--recent N`, `--days N`, `--status <active|stale|null>`
  - Sits alongside `/agent-harry-audit` and `/agent-harry-cost` — same source file, same read-only contract, per-project scope
- **Added — `--promote <pattern>` flag on `/agent-harry-fingerprint`** (`templates/.claude/commands/agent-harry-fingerprint.md` + `templates/.claude/agents/product-fingerprint-curator.md`):
  - New Mode P (Promote) on the curator — appends a cross-feature pattern to the fingerprint's new `## Promoted Patterns (v5.1)` section
  - Validates feature slugs against the audit ledger (minimum 2 required — single-feature decisions are not product norms)
  - Conflict check against existing anti-patterns; user must explicitly proceed past contradictions (logged in `contradicts_anti_pattern` audit field)
  - **No `mcp__figma` required for Mode P** — promotion is text-only (pattern name + features-used + optional Figma URL stored as a string, not pulled)
  - Resolves the "cross-feature memory" question without introducing a separate pattern ledger or handoff schema — patterns worth reusing live in the fingerprint, where Deliver agents already load them at intake
- **Added — `Roadmap link (v5.1)` field in `SHARED_CONTEXT.md` Project Context table**:
  - External reference only (Notion / Linear / Jira / Productboard URL — or `"none"`)
  - Agent Harry does NOT own, write, or sync roadmap content — strategy stays in the team's real product tool
  - `critique-partner` may read the link at large scale to surface outcome-alignment prompts; small projects typically leave it as `"none"`
- **Audit ledger schema** (`templates/SHARED_CONTEXT.md` § Event-specific optional fields): registers new event type `pattern_promoted` with fields `pattern_name`, `used_in_features` (string[]), `evidence_figma_url` (string or null), `contradicts_anti_pattern` (string or null).
- **Fingerprint file schema** (in `product-fingerprint-curator.md` File Output Schema): adds optional `## Promoted Patterns (v5.1)` section, inserted between `## Composition Patterns` and `## Anti-patterns`. Section appears only after the first `--promote` call; section length counts against the existing ~200-line cap.

### Explicitly rejected (with reasons — documented to prevent re-litigation)

These six ideas were considered, grilled, and dropped. Recorded here so the next "we should add X" review starts from the existing decision instead of re-running the same debate:

| Idea | Why rejected |
|---|---|
| Per-feature subfolder (`design-workspace/<project>/features/<slug>/`) | One-way door requiring updates to 9 files / 20+ references for cosmetic gain. Flat layout is fine; `/agent-harry-features` solves the navigation problem without restructuring |
| `_features.yaml` registry file | Audit ledger already has `feature_slug`, `ts`, `agent`, `files_written`, `handoff_ref` — a separate registry duplicates the ledger and drifts. Derived command (`/agent-harry-features`) reads ledger directly |
| Run-count-based fingerprint staleness counter | Existing Figma `lastModified` check (already integrated into 4 Deliver agents via `fingerprint_stale_detected` event) is a strictly better signal than a run-count proxy. Adding a counter creates a duplicate, lower-quality warning |
| Auto cross-feature context injection (pre-load related features' Executive Summaries) | Conflicts with `product-fingerprint.md` as the single cross-feature source of truth. Pattern promotion (`--promote`, see above) handles the genuine cases; auto-injection adds token cost, stale-decision propagation risk, and hidden coupling |
| `_patterns.md` separate pattern reuse ledger | Same drift-from-second-source problem as `_features.yaml`. Promoted patterns belong in the fingerprint where Deliver agents already load them |
| Auto Figma→code component drift detection in bootstrapper Mode B | Existing flow surfaces missing components naturally via `figma-designer`'s "needs bootstrap extend" gap. Automating detection removes the audit-clarity signal ("when did DatePicker get added?") and adds false-positive risk on renames |

### Explicitly deferred (not rejected — waiting for actual user friction signal)

- Cross-feature handoff schema (`consumes_decisions_from`, `exposes_decisions_to` frontmatter fields) — duplicate of fingerprint promotion; reconsider only if promotion proves insufficient
- Product roadmap as an Agent-Harry-owned file — scope creep; the `Roadmap link` reference field is sufficient. Reconsider only if `critique-partner` repeatedly needs to read roadmap content (not just link metadata) at large scale
- Feature lifecycle gate (`deprecated` status, `/agent-harry-features deprecate <slug>` write command) — premature for current scale. Reconsider when a user reports deprecated features actually cluttering `/agent-harry-features` output. Today, status is `active` / `stale` / `null` only (all inferred from ledger contents)

### Migration

None required. v5.1 is fully additive:

- Existing fingerprints continue to work unchanged — `## Promoted Patterns` appears only when a user runs `--promote`
- Existing audit ledgers continue to work unchanged — `pattern_promoted` is a new event type, not a modification of existing fields
- Existing project templates that haven't filled in the `Roadmap link` row in SHARED_CONTEXT are fine — `"none"` is a valid value and downstream agents tolerate absence
- No agent file path changes; no slash-command rename or removal

### Files touched

- `templates/SHARED_CONTEXT.md` — added `Roadmap link (v5.1)` row in Project Context table + `pattern_promoted` event entry in audit ledger event-specific table
- `templates/.claude/commands/agent-harry-fingerprint.md` — added Mode P routing in argument parsing + steps to execute + cost expectation + when-to-invoke
- `templates/.claude/commands/agent-harry-features.md` — **new file**
- `templates/.claude/agents/product-fingerprint-curator.md` — added Mode P section + `## Promoted Patterns` schema in file output + `pattern_promoted` audit event spec; expanded "When You Run" from 3 triggers to 4

---

## 2026-05-25 — v5.0: Rip dashboard + Queue Mode — chat is the only decision surface

**Breaking change.** Removes the entire dashboard surface (visual HTML companion + click-driven Queue Mode). Across 7 versions (v3.1–v4.3), the dashboard was never used in practice. Chat is the canonical decision surface. Structured `decisionData` now renders as markdown in chat at every Stop Gate. Full rationale: `RATIONALE.md` § "Why dashboard was removed (v5.0)".

- **Deleted from templates:**
  - `templates/dashboard.html` — static HTML mirror written at every Stop Gate
  - `templates/dashboard-server.py` — Python stdlib HTTP server for Queue Mode
  - `templates/.harry-queue.json` — queue state file
  - `templates/.claude/commands/agent-harry-loop.md` — polling slash command
- **Deleted from docs:**
  - `docs/wiki/concepts/dashboard.md`
  - `docs/wiki/commands/agent-harry-loop.md`
  - `docs/dashboard-demo.html` — historical demo artifact
- **`orchestrator.md` rewritten:**
  - Removed "Dashboard Rendering" protocol section (~50 lines)
  - Removed "Queue Mode" section (~10 lines)
  - Removed `.harry-queue.json` check in Success-Metrics Gate confirmation logic — now uses chat history only
  - **New "Decision Data Rendering" section** maps the 4 shapes (insights / table / callout / metrics) to markdown rendered in chat between the Executive Summary stat-card and the TL;DR
  - New anti-pattern: "Write any HTML companion file — chat is the only decision surface"
- **`DECISION_DATA_SHAPES.md` retargeted:**
  - Same 4 shape variants; rendering target shifted from inline HTML strings (for `innerHTML` injection) to chat markdown
  - Added minimal HTML→markdown back-compat shim: `<strong>` → `**`, `<em>` → `*`, `<code>` → backticks, `<br>` → newline, `<a href>` → markdown link. Anything else stripped.
  - Pre-v5.0 CSS class indicators (`.delta-up`, `.pill-in`, etc.) replaced with unicode/markdown equivalents
- **Sub-agent file cleanup:**
  - `pm-metrics-architect.md` — Confirmation Mode framing strips "dashboard's command-chip hint" block; keeps TL;DR copy and Decision Data label
  - `prd-author.md` — manifest framing updated from "dashboard's Decision Data panel" to "chat's Decision Data block"
- **Slash command cleanup:**
  - `agent-harry-notion-sync.md` — drops "if the dashboard is running" conditional; chat is always the surface
- **SHARED_CONTEXT.md cleanup:**
  - Removed "Dashboard companion (v3.1, enriched in v3.3)" section
  - Removed "Queue Mode (v3.2 — autonomous click-driven loop)" section
  - Replaced with single "Decision Data in chat (v5.0)" section pointing at `DECISION_DATA_SHAPES.md`
  - Audit Ledger description drops "dashboard.html overwrites each turn" clause
  - Notion Sync exclusion list drops `.harry-queue.json` and `dashboard.html` bullets
- **SKILL.md cleanup:**
  - Install flow stops copying dashboard files
  - Refresh flow gains v5.0 dashboard-orphan notice listing the 4 files (`dashboard.html`, `dashboard-server.py`, `.harry-queue.json`, `.claude/commands/agent-harry-loop.md`) for projects refreshing from pre-v5.0 — lists them, does NOT auto-delete (user runs `rm` manually)
  - File tree drops dashboard entries
  - `.gitignore` template drops `.harry-queue.json` entry (queue file no longer exists)
- **`templates/.gitignore`** drops the `.harry-queue.json` line.
- **README.md (templates):** "Visual companion" and "Click-driven mode — Queue Mode" sections removed; new "Decision Data in chat" section explains the post-v5.0 surface; commands table drops `/agent-harry-loop` and adds `/agent-harry-cost`; file map updated.
- **Wiki cleanup:** removed `concepts/dashboard.md` and `commands/agent-harry-loop.md`; swept references from `concepts.md`, `commands.md`, `index.md`, `getting-started.md`, `guides/troubleshooting.md` ("dashboard doesn't show latest state" entry removed), `guides/refresh-after-update.md` (new v5.0 cleanup section), `concepts/stop-gate.md` (4 dashboard refs stripped), `concepts/success-metrics-gate.md` (chip-hint framing dropped), `commands/agent-harry-notion-sync.md` (exclusion list), `concepts/audit-ledger.md` (one clause), `reference/glossary.md` (Dashboard entry replaced with "Decision Data block"; Queue Mode entry removed), `agents/pm-metrics-architect.md` (chip hint wording).
- **RATIONALE.md:** added closing § "Why dashboard was removed (v5.0)" capturing the historical retraction. Cost-meter sentence updated to note the colored banner is gone with no passive replacement (use `/agent-harry-cost` on demand). DECISION_DATA_SHAPES description updated.

**Per-project migration:** projects refreshing from pre-v5.0 will see an orphan-file notice with the 4 files to remove. Refresh does NOT auto-delete them (they may have been edited). They're harmless if left in place — the orchestrator no longer touches them.

**Token-cost impact:** orchestrator drops ~1–2k output per Stop Gate (no more HTML write). Decision Data chat-render costs ~200–600 tokens — the same content sub-agents already produced in their handoffs, surfaced once. Net: ~$0.005–0.015 less per Stop Gate.

---

## 2026-05-24 — v4.0: Product Fingerprint (project-level visual + composition vocabulary)

Adds the **product fingerprint** — a project-level artifact at `<project-root>/product-fingerprint.md` that captures the existing product's visual language and composition vocabulary from 3–7 designer-picked "exciting" Figma frames. Read by `lo-fi-designer`, `figma-designer`, and `design-engineer` at intake so new feature work matches the product's actual norms, not just DS tokens.

Motivated by: DS tokens describe vocabulary but not *how it's composed*. Two products with the same DS can feel completely different — one dense and clinical, the other airy and playful. Without a fingerprint, Agent Harry's Deliver agents produced DS-correct but product-foreign work. New features looked bolted on. The fingerprint closes that gap with a small, curated, reusable artifact.

- **New agent `product-fingerprint-curator`** — `templates/.claude/agents/product-fingerprint-curator.md`. Tools: `Read, Write, Glob, Grep, mcp__figma`. Model: sonnet. Phase: `cross-cutting`. Curates 3–7 Figma references, synthesizes visual language (density, color stance, typography stance, copy tone, motion stance, imagery, corner radius, shadow, spacing rhythm) + composition patterns (page scaffolding by role, empty-state, form, data display, primary CTA placement, confirmation/destruction) + **mandatory 3–5 anti-patterns** ("this product doesn't do X"). Writes `<project-root>/product-fingerprint.md`, ~200 lines, full-loaded by Deliver agents. Mode A (first curation) + Mode B (refresh).
- **New slash command `/agent-harry-fingerprint`** — `templates/.claude/commands/agent-harry-fingerprint.md`. Invokes the curator. `--refresh` flag for re-curation after product evolves.
- **Pre-intake fingerprint check (mandatory across all three Deliver agents)** — `lo-fi-designer`, `figma-designer`, `design-engineer` each validate the fingerprint BEFORE any other intake question. Existence check + lightweight freshness check (compare Figma `lastModified` vs frozen `figma_node_last_modified_at_curation`; archive-prefix name heuristic). Missing → refuse with `skip fingerprint` opt-out. Stale → refuse with `proceed with stale fingerprint` opt-out. Parallel to Research-First Gate and Success-Metrics Gate's refuse-with-explicit-opt-out model.
- **`lo-fi-designer` — fingerprint-aware variant rules + entry-point intake** — Primary layout anchors on entry-point layout FIRST (continuity), fingerprint composition second. Alternative anchors on a secondary fingerprint pattern that differs from entry point. Risky may diverge but MUST annotate `breaks_antipattern` / `breaks_composition` with rationale. Anti-patterns hard-enforced on Primary + Alternative; Risky exempt only with annotation. New intake Question 4 captures entry-point (Figma URL user-provided OR code path auto-discovered from PRD + feature_slug). Handoff frontmatter gains `entry_point`, `fingerprint_compliance`, `fingerprint_status`.
- **`design-engineer` — fingerprint signals + code auto-discovery** — Reads full fingerprint at intake; auto-discovers existing code paths from PRD + feature_slug (Globs `app/` / `pages/` / `src/` for feature keywords, plus universal primitives from `components/ui/*` and root layout). Surfaces discovered paths transparently at intake; user overrides via `revise — study X instead of Y`. Applies fingerprint signals to layout primitives, density, copy tone, component variants. Mode B audit gains "Fingerprint divergence" section (max 4 findings, severity-ranked).
- **`figma-designer` — fingerprint signals + Mode B audit** — Reads full fingerprint at intake; applies visual language to component-variant picks (density, corner_radius, shadow), copy tone to all text, anti-patterns as forbidden moves. First screen visually continues from entry-point reference. Mode B audit gains the same "Fingerprint divergence" section as design-engineer.
- **`SHARED_CONTEXT.md` updates** — New "Product Fingerprint (Critical Input — v4.0)" section parallel to Research-First/Success-Metrics Gates. Context Source Hierarchy adds Product Fingerprint as tier-2 source. Per-feature Deliver artifact paths table updated with new frontmatter fields. Audit Ledger event types table gains 4 new events: `fingerprint_skipped`, `fingerprint_stale_detected`, `fingerprint_stale_proceeded`, `fingerprint_refreshed`. Ownership table updated; event-specific optional fields table updated.
- **`orchestrator.md` updates** — `product-fingerprint-curator` added to sub-agents table. New "Product Fingerprint Awareness (Routing Note)" section after Success-Metrics Gate. Orchestrator does NOT enforce the fingerprint gate itself — agents do their own pre-intake check. Orchestrator's role: mention pre-check will fire when routing to lo-fi/figma/design-engineer; at Define→Deliver boundary, suggest curator in next-move when fingerprint missing.
- **Rename `low-fi-designer` → `lo-fi-designer`** — naming consistency cleanup. The agent file, identifier across all 18 referencing files, and grep variants (`low-fi` → `lo-fi`) all updated. `low-fidelity` (formal spelling) preserved.

Agents total: 16 → **17**. New cross-cutting `product-fingerprint-curator`. Opus model agents unchanged (orchestrator + critique-partner only). Slash commands: 4 → 5 (`/agent-harry-fingerprint` added). Token-cost per pipeline: curator first run ~$0.50, refresh ~$0.20, pre-intake check at each Deliver agent ~$0.02.

What's out of scope (v4.0 → deferred to v4.1+):
- `critique-partner` using fingerprint anti-patterns as critique criteria
- `usability-tester` / `handoff-engineer` / `prd-author` fingerprint integration
- Screenshots / live URLs as alternative reference inputs (Figma URLs only in v4.0)
- Auto-staleness detection beyond `lastModified` (no visual hashing)
- Auto-refresh on stale detection (user-in-the-loop only)
- Quality-bar gating purpose (current scope is consistency, not quality enforcement)

---

## 2026-05-23 — v3.9: `figma-designer` agent (hi-fi Figma side of the Deliver fork)

Adds a 16th agent: `figma-designer`, the Figma-side counterpart to `design-engineer`. Same pipeline slot (after `lo-fi-designer`), same hi-fi expectation, different surface. Designers who live in Claude Code can now generate hi-fi Figma frames for an approved lo-fi flow without manually redrawing every screen.

Motivated by: Agent Harry had a code-side Deliver path (`design-engineer`) but no Figma-side equivalent. Designer-developers (the maintainer's actual workflow) wanted "the design-engineer experience, but for Figma" — same intake discipline, same scope cap, same Stop Gate, output to Figma frames instead of code files.

- **New agent `figma-designer`** — `templates/.claude/agents/figma-designer.md`. Tools: `Read, Write, Glob, Grep, mcp__figma`. Model: sonnet. Decision authority: `propose`. Phase: deliver. Consumes `lo-fi-<feature-slug>.md` + `prds/<feature-slug>.md`, resolves a user-specified Design System, invokes `use_figma` (per `/figma-use` skill) to generate frames with real DS component instances, real PRD content, applied tokens, and the declared state set per screen.
- **Scope discipline** — 1 flow per invocation, ALL screens in the flow (no artificial cap; batches into multiple `use_figma` calls for >10 screens). Max 3 states per screen by default (default + empty + error); user can opt into a 4th (loading) at intake. Mirrors `design-engineer`'s 1-flow rule but removes its screen subset shortcut — designer cannot ship a half-flow.
- **DS-or-refuse gate** — Question 3 of the intake (Design System source) is REQUIRED. Without a DS answer, agent refuses with *"Hi-fi Figma without a DS produces meaningless visuals."* User can override with explicit phrase `"proceed with generic Material defaults"` — agent falls back to Material 3 and flags `ds_status: defaulted` in the handoff.
- **Pipeline slot** — registered in `orchestrator.md` agent table between `lo-fi-designer` and `design-engineer`. Both Research-First Gate (line ~50) and Success-Metrics Gate (line ~63) extended to include `figma-designer` in their Deliver-agent lists. Post-metrics routing now offers `design-engineer` OR `figma-designer` off a lo-fi handoff — user picks the surface they want first. If a `figma-hifi` artifact exists with no code prototype, orchestrator proposes `design-engineer` next (code the approved Figma).
- **Mode B — Existing Figma File Audit** — agent accepts a Figma file URL and audits hi-fi frames against the lo-fi handoff: flow coverage gap matrix, DS divergence (detached instances, hardcoded tokens, bespoke duplicates), content gaps, component sprawl. Mirrors `design-engineer`'s Mode B shape.
- **Iteration budget** — 3-revise soft cap derived from `.harry-audit.jsonl` per `SUBAGENT_AUDIT_PROTOCOL.md` Step 3, same as `design-engineer`. Cost estimates: ~$0.10 per single-screen tweak, ~$0.30 per multi-screen content refresh, ~$1.00+ for a full re-render (warned).
- **`SHARED_CONTEXT.md` updates** — Research-First Gate and Success-Metrics Gate Deliver-agent lists extended. New "Per-feature Deliver artifact paths" table under File Conventions documents the four stable slug-derived paths (`lo-fi-`, `prototype-`, `figma-hifi-`, `spec-`) and the per-agent frontmatter keys.
- **`templates/README.md` updates** — agent count 15 → 16; new row in agent table; `figma-designer` added to Mode B coverage table and `.claude/agents/` file map.
- **Root `README.md` updates** — agent count 10 → 16 across install/refresh copy; file map under "What's inside" corrected to the actual current agent set.
- **Spike deferred** — Phase 0 plan called for a live `use_figma` capability spike. The `/figma-use` skill resource was not directly loadable in the build session, so the spike was deferred to first-run validation. The agent's Anti-Patterns include the canonical warning ("Calling `use_figma` without loading the `/figma-use` skill (or `skill://figma/figma-use/SKILL.md` resource) first — common, hard-to-debug failures result"). First user-session invocation is the live capability test; if `use_figma` does not produce DS-instanced hi-fi frames at the requested fidelity, file a v3.9.1 patch updating the agent's "What You Do" with the actual capability surface (e.g. fall back to structured Figma import spec output).
- **No model routing change** — `figma-designer` is sonnet, same as every phase agent. Opus reserved for orchestrator + critique-partner (per RATIONALE.md cost discipline).
- **No SKILL.md change needed** — install + refresh both copy all `templates/.claude/agents/*.md` (no allowlist).

Agents total: 15 → **16**. Opus model agents unchanged (orchestrator + critique-partner only). Slash commands unchanged. Token-cost per pipeline: figma-designer single invocation adds ~$0.30–1.00 depending on flow size; the Deliver path is now a user-choice fork (figma-designer XOR design-engineer XOR both sequentially) rather than a mandatory code-only path.

---

## 2026-05-22 — v3.8: Passive audit ledger + `/agent-harry-audit` render command

Chat compacts. `dashboard.html` overwrites every Stop Gate. Handoff frontmatter is scattered across files. There was no cross-session audit trail answering *"ဘယ်နေ့မှာ ဘယ် agent ဘာလုပ်တယ်, ဘယ်ဖိုင်တွေ touch လုပ်တယ်, ဘယ်လောက်ကုန်တယ်."* v3.8 adds a passive append-only JSONL ledger written by the orchestrator at every Stop Gate, plus a slash command to render it as a human-readable timeline.

No new agent. Logging is mechanical — no LLM judgment needed. The orchestrator is already at the Stop Gate moment writing `dashboard.html`; appending one JSONL line costs ~50 tokens. See `RATIONALE.md` § "Why a passive ledger over a logging agent" for the design call.

- **New file `<project-root>/.harry-audit.jsonl`** — append-only JSONL ledger created on first Stop Gate after install/refresh. One JSON object per line, 10 core fields (`ts`, `session_id`, `agent`, `mode`, `phase`, `event`, `decision`, `cost_delta`, `cumulative_cost`, `files_impacted`, `handoff_ref`) plus event-specific optional fields (`gate`, `reason`, `delta_text`, `cap_hit`). Gitignored by default — contains raw paths, Figma URLs, decision deltas. Per-project scope (no workspace-wide aggregation).
- **New slash command `/agent-harry-audit`** — `templates/.claude/commands/agent-harry-audit.md`. Reads the ledger and renders a markdown timeline grouped by date → session → event table. Default scope: last 7 days, current project, all events. Flags: `--all`, `--days N`, `--agent <name>`, `--event <type>`, `--session <s_id>`. Multiple filters AND together. Output to chat only (no file write — render is ephemeral). Read-only; never mutates the ledger.
- **New file `templates/.gitignore`** — single shipped `.gitignore` for fresh projects. Ignores `.harry-audit.jsonl` and `.harry-queue.json`. Install copies directly to project if no `.gitignore` exists; if one exists, appends missing entries under a `# Agent Harry` header (idempotent).
- **Events captured** — `stop_gate` (every gate firing), `gate_block` / `gate_clear` (Research-First + Success-Metrics transitions), `pivot`, `cancel`, `scope_refused` (e.g. `design-engineer` 1-flow cap), `iteration_cap_hit` (e.g. `design-engineer` 3rd revise). Not captured: agent start, mode switch, file write — those are derivable from `stop_gate` entries and would noise the ledger.
- **`orchestrator.md` — new "Audit Ledger Write" section** — under Dashboard Rendering. Same Stop Gate moment that overwrites `dashboard.html` also appends to `.harry-audit.jsonl`. Includes `session_id` generation rule (`s_YYYYMMDD_NNNN`, counter resets daily), cumulative-cost tracking discipline, `files_impacted` extraction from sub-agent handoff frontmatter (max 10 paths per entry), and graceful-degrade rule (ledger write failure does NOT block the Stop Gate — it's observability, not load-bearing).
- **Subagent-fallback rule** — added to `SHARED_CONTEXT.md` § Audit Ledger. When a subagent is invoked **directly** (not via the orchestrator), the subagent self-appends its own completion entry as part of its Output Format. Detects orchestrator-routing by inspecting the invocation prompt; skips the append to prevent duplicates. Most agents don't need explicit changes — the rule is documented once in SHARED_CONTEXT and applies via the Output Format requirement already in every agent file.
- **`SHARED_CONTEXT.md` — new "Audit Ledger" section** — full schema spec, file path, event types, who-writes-when rules, privacy + retention policy, anti-patterns. Single source of truth for the ledger format.
- **`SKILL.md` install + refresh extended** — Mode 1 step 12 (gitignore management), Mode 2 step 9.5 (preserve `.harry-audit.jsonl`) + 9.6 (gitignore append-warn). Both modes idempotent — re-install/refresh doesn't duplicate gitignore entries or overwrite existing ledger.
- **No dashboard change** — clean separation. `dashboard.html` keeps single-focus current-step centerpiece (v3.1 design); the ledger surfaces via the slash command. No top-bar cumulative cost across sessions, no last-N-sessions strip.
- **Retention** — never rotate. JSONL appends forever. Real-world projects (~5–10 sessions/week) stay under 5MB even after years. User can manually rotate (`mv .harry-audit.jsonl .harry-audit-archive.jsonl`) if file grows uncomfortably large.
- **`templates/README.md` slash commands table** — `/agent-harry-audit` row added.

Token cost: orchestrator's per-Stop-Gate write grows by ~50 tokens (one JSONL line). Across a 5–8 step pipeline that's ~$0.01 extra. The render command itself is user-triggered and costs ~$0.02 per run for a 7-day default scope. A full Discovery → Define → Deliver pipeline still lands in the $1.50–3.50 range, same as v3.7.

Slash commands total: 3 → **4**. Agents total: unchanged (still 15). Opus model agents unchanged (orchestrator + critique-partner only).

### v3.8 — post-grill amendments (bundled before ship)

A `/grill-me` pass on the v3.7 + v3.8 work surfaced 9 correctness/design gaps. Rather than ship v3.8 then patch v3.8.1, fixes are bundled into v3.8 itself (uncommitted state):

- **`files_written` field added to handoff schema** (Q1) — `SHARED_CONTEXT.md` handoff frontmatter now requires `files_written: [<paths>]`. The audit ledger's per-event `files_written` field is populated from this. Without this field, the ledger's primary user-facing question (*"which files were impacted?"*) could not be answered.
- **`cumulative_cost` removed from per-entry schema** (Q2) — orchestrator and subagents are stateless across invocations; storing per-entry running totals would drift. Render command (`/agent-harry-audit`) sums `cost_delta` at read time and displays per-session totals + grand cumulative in the footer.
- **Ledger ownership by event type, not by routing detection** (Q3) — replaces the fragile string-match detection of orchestrator-vs-direct invocation. Subagents own `stop_gate` / `scope_refused` / `iteration_cap_hit` events (they have the data, no orchestrator round-trip needed). Orchestrator owns `gate_block` / `gate_clear` / `pivot` / `cancel` (routing-level events). Single writer per event type = no race condition, no duplicates.
- **Slug establishment** (Q4) — `<project-slug>` and `<feature-slug>` were referenced across multiple agents without a source-of-truth rule. v3.8 establishes orchestrator-side derivation at session start (Diagnose phase): `project_slug` from cwd basename, `feature_slug` from goal kebab-case (filler-word-stripped), surfaced in first Executive Summary so user can `revise — feature_slug: <s>` if wrong. Embedded in every subagent invocation prompt; persisted in artifact frontmatter.
- **Iteration cap derived from ledger** (Q5) — `design-engineer`'s 3-revise soft cap had no storage location (subagent stateless). Now derived at intake by reading `.harry-audit.jsonl`, filtering by `session_id + agent + feature_slug`, walking backward counting consecutive `revise` decisions until hitting `y` / `pivot` / `cancel`. Per-session, per-feature isolated budgets.
- **DECISION_DATA_SHAPES field-to-shape mapping documented** (Q6-A1) — the richer v3.7 schema fields (`chosen_layout`, `iteration_count`, `figjam_url`, etc.) fold into existing `insights` / `table` shape slots rather than introducing a 5th shape type (which would need dashboard.html render changes). Encoding documented inline in `DECISION_DATA_SHAPES.md`.
- **Stack-based form factor inference** (Q6-B4) — `lo-fi-designer`'s ASCII layout example was desktop-biased (sidebar/main/command bar). v3.8 adds a Form Factor Inference table — SwiftUI / Flutter / React Native → mobile schematic (single-column, bottom tab bar); Next.js / Vue / Vanilla → web schematic (sidebar OR top-nav). Stack-detected at intake.
- **`project` → `project_slug` rename in handoff frontmatter** (Q6-C1) — existing field's value was always a kebab-case slug; rename clarifies intent. Plus new `feature_slug` and `session_id` frontmatter fields per Q4.
- **New `SUBAGENT_AUDIT_PROTOCOL.md` lazy-loaded appendix** (Q6-D2) — centralizes the 5-step subagent protocol (session_id derivation, ledger append, slug derivation, iteration-count derivation, required frontmatter fields). Each subagent's Output Format references it in 1 line instead of duplicating ~75 lines of boilerplate across 14 agents. Same pattern as `PM_SKILLS_MAP.md` (v3.6) and `DECISION_DATA_SHAPES.md` (v3.6 / v3.3).

Files touched by grill amendments: new `templates/SUBAGENT_AUDIT_PROTOCOL.md`; updated `templates/SHARED_CONTEXT.md` (schema + ledger writer + session_id sections), `templates/DECISION_DATA_SHAPES.md` (field mapping appendix), `templates/.claude/agents/orchestrator.md` (narrowed Audit Ledger Write to routing events; new Slug Establishment section), `templates/.claude/agents/lo-fi-designer.md` (Form Factor Inference; protocol reference; slug propagation), `templates/.claude/agents/design-engineer.md` (iteration count from ledger; protocol reference; slug propagation), 12 secondary agent files (1-line protocol reference), `templates/.claude/commands/agent-harry-audit.md` (cumulative-cost-on-read clarification), `SKILL.md` (copy step for SUBAGENT_AUDIT_PROTOCOL.md), `RATIONALE.md` (why centralized protocol).

## 2026-05-22 — v3.7: Split interaction-designer → lo-fi-designer + design-engineer

The bundled `interaction-designer` agent was overloaded — one file covered lo-fi wireframing, hi-fi Figma mockups, code prototypes, AND Mode B audits. v3.7 splits it into two role-specific agents at the natural seam between *"what's the layout?"* (Define-phase) and *"build it in real code"* (Deliver-phase). Sequence: `lo-fi-designer` (define) → `pm-metrics-architect` (gate) → `design-engineer` (deliver) → `handoff-engineer` (formal spec from prototype).

- **New agent `lo-fi-designer` (sonnet, define)** — `templates/.claude/agents/lo-fi-designer.md`. Asks for a Userflow Figjam (or generates one via `mcp__figma` `use_figma`; falls back to Mermaid flowchart if Figma MCP unavailable). Produces 3 ASCII layout alternatives — primary (structured), alternative (schematic), risky (schematic + "what could break"). Per-layout component table: DS-existing vs. NEW (name + 1-line purpose only — full spec deferred to `handoff-engineer`). Mode B audits existing userflow/wireframe artifacts.
  - Decision Data shape: `insights` — 3 rows (one per layout) with DS-vs-new component counts as evidence.
  - Tools: `Read, Write, Glob, Grep, Bash, mcp__figma, mcp__mobbin, WebSearch`.
- **New agent `design-engineer` (sonnet, deliver)** — `templates/.claude/agents/design-engineer.md`. Reads `lo-fi-<feature>.md` handoff. Builds production-ready frontend prototype in the project's actual stack with dummy data. Hard scope cap: **1 primary flow per invocation, 3–5 screens max**. All 5 states mandatory (empty/loading/populated/error/edge) as toggle-able routes. Mock API layer with realistic 800ms delay. Stack-detected file location: in-stack for Next.js/Flutter/SwiftUI, `prototypes/<slug>/` for vanilla. Polish bar: D2 (production-visual default) or D3 (full polish — animations, skeletons, toasts — opt-in). Iteration soft cap: 3 revise iterations before suggesting `pivot — re-do layout`. Cumulative cost estimate surfaced every revise. Mode B audits existing prototype code.
  - Decision Data shape: `table` — screen · states covered · DS components · new components · polish level.
  - Tools: `Read, Write, Edit, Glob, Grep, Bash, mcp__figma, mcp__mobbin`.
- **`interaction-designer` retired** — `templates/.claude/agents/interaction-designer.md` deleted. Refresh mode (Mode 2) now detects orphan agent files and prompts the user.
- **Refresh mode — orphan-check step added** — `SKILL.md` Mode 2 step 3.5: lists agent files in `<project>/.claude/agents/` that don't exist in `templates/.claude/agents/`, prompts *"These agent files exist locally but are no longer shipped — delete them?"*. Safe-by-default — no destructive auto-delete; `git rm` only on user `y`. Same check applies to `.claude/commands/`.
- **Stack auto-detection (shared between the two new agents)** — 3-tier: (1) `<project-root>/SHARED_CONTEXT.md` Project Context `Stack:` line, (2) repo scan (`package.json` / `pubspec.yaml` / `Package.swift` / `Cargo.toml`), (3) intake question if ambiguous. Cross-checked between `lo-fi-designer` (for DS component recommendations) and `design-engineer` (for actual code stack).
- **`SHARED_CONTEXT.md` — new Project Context section** — top-of-file table with `Product type`, `Stack`, `Design system`, `Notion workspace`, `Figma file` fields. Generator-mode install fills it; Bundled-mode install ships placeholders. `Stack:` is the tier-1 source for stack detection.
- **`orchestrator.md` — routing table updated** — `interaction-designer` row replaced by `lo-fi-designer` (define) + `design-engineer` (deliver). Data-First Routing Rule split: existing userflow Figjam → `lo-fi-designer`; existing prototype code → `design-engineer`. Post-Success-Metrics-Gate routing: PRDs done → `lo-fi-designer` → `design-engineer` → `handoff-engineer`. Gates list (Research-First + Success-Metrics) updated.
- **`DECISION_DATA_SHAPES.md` — Per-Agent Shape Map updated** — `interaction-designer` row removed; `lo-fi-designer` (insights, max 3) and `design-engineer` (table, max 6) rows added.
- **`SKILL.md` — Generator-mode scoping extended** — new Q2 *"Stack"* scoping question added to fill the SHARED_CONTEXT `Stack:` line; Q6 *"Prototype medium default"* updated to reflect lo-fi-designer / design-engineer / both choice.
- **`README.md` updated** — agents table 14 → 15, new rows for both agents, Mode B input table split, File Map updated.
- **No PM skills assigned** — neither new agent is in `PM_SKILLS_MAP.md` ownership. They're design/build agents, not PM. Existing PM skill ownership unchanged.
- **prd-author optional consumption** — `prd-author` reads `design-engineer`'s `prototype-<feature>.md` artifact if it exists, for the "What this looks like" PRD section. Soft dependency — `prd-author` runs fine without it.

Why this split (also in `RATIONALE.md`): one agent doing lo-fi schematic + hi-fi visual + production code is three different crafts, three different fidelity disciplines, and three different output contracts. The compound role muddied the orchestrator routing ("when do I use it for lo-fi vs code?") and the user's mental model. Splitting cleans the routing logic and lets each agent be sharper at its actual job.

Agents total: 14 → **15**. Opus model agents unchanged (still orchestrator + critique-partner only). Token cost per `design-engineer` run estimated ~$0.30–0.80 depending on polish bar and screen count; `lo-fi-designer` ~$0.10–0.20. A full Discovery → Define → Deliver pipeline with the new split still lands in the $1.50–3.50 range — slightly higher ceiling than v3.6 because real code costs real tokens, but iteration cap + scope cap keep it bounded.

## 2026-05-20 — v3.6: Token-budget refactor — quality-safe ~35% cut

The system was loading ~33k tokens per full pipeline run, mostly from duplicate rules and verbose rationale paragraphs being re-read on every agent invocation. v3.6 splits load-bearing rules from explanatory prose, extracts two appendix tables into lazy-loaded files, and dedups orchestrator.md against SHARED_CONTEXT.md. Behavior, gates, and decisionData shapes are **unchanged** — only the file layout shifts so agents read less per run.

- **New `templates/PM_SKILLS_MAP.md`** — the per-agent skill ownership table moved out of `SHARED_CONTEXT.md`. Every agent used to load the whole 13-row table on every run; now only the agents that actually invoke PM skills (`pm-strategist`, `pm-launch-architect`, `pm-metrics-architect`) reference it. SHARED keeps a 4-line pointer.
- **New `templates/DECISION_DATA_SHAPES.md`** — the 4 decisionData shape specs + per-agent shape map moved out of `SHARED_CONTEXT.md`. Only the orchestrator (at dashboard-render time) and agents producing decisionData need the full spec. SHARED keeps a 3-line pointer.
- **New `RATIONALE.md` (repo root, NOT in `templates/`)** — verbose "Reason for this rule:" / "Reasoning:" paragraphs that explained WHY each rule exists moved out of runtime files. Agents follow rules; they don't need to be persuaded of them. The file is dev-facing only; agents never load it.
- **`orchestrator.md` dedup against `SHARED_CONTEXT.md`** — Research-First Gate and Success-Metrics Gate sections in orchestrator no longer restate the rule verbatim from SHARED. They keep orchestrator-specific routing logic + dashboard framing + post-gate routing; they delegate the canonical rule text and refusal copy to SHARED. The full refusal-message templates (which appeared twice — once in SHARED, once in orchestrator) now live only in SHARED.
- **Agent references updated** — `pm-strategist.md`, `pm-launch-architect.md`, `pm-metrics-architect.md` now point to `PM_SKILLS_MAP.md` directly instead of `SHARED_CONTEXT.md PM Skills Map`.
- **`SKILL.md` install/refresh steps** — copy `PM_SKILLS_MAP.md` and `DECISION_DATA_SHAPES.md` alongside `SHARED_CONTEXT.md` on install; on refresh, only seed them if missing (pre-v3.6 projects) — never overwrite user customizations.

Quality preservation: every rule, gate, opt-out phrase, refusal option, and routing decision stays identical. The only thing that changed is **where the text lives** — load-bearing rules in SHARED, lazy-loadable appendices in dedicated files, dev rationale in `RATIONALE.md` outside the runtime path.

Token impact (measured on file line counts):

| File | Lines before | Lines after | Delta |
|---|---|---|---|
| `SHARED_CONTEXT.md` | 509 | ~370 | -139 lines / ~1,800 tokens per agent that loads it |
| `orchestrator.md` | 493 | ~454 | -39 lines / ~500 tokens per orchestrator invocation |
| `PM_SKILLS_MAP.md` | — | 34 | new, lazy-loaded |
| `DECISION_DATA_SHAPES.md` | — | 114 | new, lazy-loaded by orchestrator only |
| `RATIONALE.md` | — | 91 | new, **never loaded at runtime** |

Per full pipeline (orchestrator + 5–8 sub-agents): estimated ~30–40% reduction in input tokens.

## 2026-05-19 — v3.5: PRD-per-sub-feature + Notion sync

After v3.4's Success-Metrics Gate clears, two new capabilities ship to make the confirmed artifacts actionable for the rest of the team: per-feature PRDs (so engineering has something concrete to build against), and a one-shot Notion publish (so non-Claude-Code teammates can read what was decided).

- **New agent `prd-author` (sonnet)** — `templates/.claude/agents/prd-author.md`. Routes after the Success-Metrics Gate clears. Reads the confirmed `feature-prioritizer` handoff, extracts items tagged `in` for MVP, generates one PRD per item using the `pm-execution:create-prd` skill. Writes each to `./design-workspace/<project-slug>/prds/<feature-slug>.md`. Batch capped at 8 PRDs per run for token discipline; if the user has 10+ "in" items, proposes splitting into 2 batches.
  - Decision Data shape: `table` — manifest with slug · word count · source RICE · status pill (`new` / `updated` / `open` for PRDs with unresolved Open Questions).
  - Idempotent: re-running on a project updates existing PRD files; doesn't blindly overwrite. Per-PRD revision via `revise — <slug>: <delta>` regenerates one without rebatching all.
  - PRD template: Problem · Users · Success criteria (must reference confirmed metrics) · Scope in/out · User stories · Acceptance criteria · Tradeoffs · Open questions · Links. The "Scope: out" section is mandatory — explicit non-goals kill scope creep.
- **New slash command `/agent-harry-notion-sync`** — `templates/.claude/commands/agent-harry-notion-sync.md`. Pushes confirmed artifacts to Notion via the Notion MCP. First run prompts for parent page (search-based picker), saves config to `<project-root>/.notion-config.json`. Subsequent runs are incremental and idempotent — same artifact path always maps to the same Notion page ID.
  - Builds a structured tree: Project root → Overview (TOC) → Discovery → Define → Success Metrics (with ✓ Confirmed badge if Gate cleared) → PRDs (one page each) → Deliver.
  - `--dry-run` previews changes without writing. `--re-init` resets the config.
  - Page content = Executive Summary + 3-bullet TL;DR + Decision Data (rendered with Notion's matching block types). Long-form MD body stays on disk as audit trail; Notion gets the decision-grade summary.
- **Orchestrator routing extended** — after the Success-Metrics Gate clears, the orchestrator's smallest-next-move logic checks: if prioritization has "in" items AND no PRDs exist yet, propose `prd-author`. Otherwise propose `interaction-designer` Mode A (design-led) or `handoff-engineer` (spec-led). `/agent-harry-notion-sync` is surfaced as a sidebar option in the Stop Gate's next-move-suggestion text, not auto-invoked.
- **SHARED_CONTEXT.md** — `prd-author` row added to PM Skills Map (`pm-execution:create-prd`, `:write-prd`, `:user-stories`, `:job-stories`, `:wwas`, `:test-scenarios`). New "Notion Sync (v3.5)" section spelling out what does/doesn't sync, the config schema, idempotency rules, and anti-patterns.
- **`templates/dashboard.html`** — no template change; v3.3's existing Decision Data `table` shape renders the PRD manifest natively. The orchestrator just populates `decisionData` per the spec.
- **Demo state added** — state 11 "PRD Batch (v3.5)" in `docs/dashboard-demo.html` shows `prd-author`'s manifest table after generating 5 PRDs for the POS Checkout MVP scenario. One PRD has status `open` (unresolved Open Questions) demonstrating the partial-readiness flavor. Total state count grows 11 → 12.

Agents total: 13 → **14**. Slash commands total: 2 → **3**. Opus model agents unchanged (still orchestrator + critique-partner only).

Token cost: `prd-author` ~$0.10–0.20 per PRD × N items (max 8) = ~$0.80–1.60 worst case. Notion sync ~$0.05–0.10 per run. A full v2/v3/v3.5 pipeline still lands in the $1.50–3.00 range, inside the $3 ceiling.

## 2026-05-18 — v3.4: Success-Metrics Gate — force metrics + confirmation before Deliver

After Define is done, you should never just glide into Deliver without naming what success looks like. v3.4 codifies that as a second hard gate, mirroring the Research-First Gate but firing at the Define → Deliver boundary instead of nothing → Discovery.

- **Success-Metrics Gate (Hard Block)** — once any Define-phase artifact exists in `./design-workspace/<project-slug>/` (handoff from `product-positioner`, `feature-prioritizer`, `ideation-facilitator`, or `pm-strategist`), the Deliver-phase agents (`interaction-designer`, `usability-tester`, `handoff-engineer`, `pm-launch-architect`) are **blocked** until `pm-metrics-architect` has run AND the user has explicitly confirmed the metrics with `y`. Same Hybrid pattern as Research-First Gate — strict default plus an explicit opt-out phrase.
- **Auto-routing in the Alignment Loop** — when Define artifacts exist and `pm-metrics-architect` hasn't run, the orchestrator's smallest-next-move MUST be `pm-metrics-architect` Mode A. Not a Deliver agent. The TL;DR explicitly frames this as the gate-clearer: *"Define is complete. Before we move to Deliver, let's lock in success metrics so we know what we're optimizing for."*
- **Opt-out exists** — for users who have metrics outside Agent Harry, the phrases *"I have metrics already, skip the confirmation"* / *"skip metrics"* / *"Success metrics မလိုဘူး"* (and equivalents) clear the gate without running `pm-metrics-architect`. Same shape as the Research-First Gate opt-out.
- **Confirmation framing in `pm-metrics-architect`** — when invoked as the gate-clearer (the orchestrator's invocation prompt says so), the agent switches its output framing: Decision Data panel label becomes `Success metrics · pending your confirmation`, the TL;DR's open-question bullet becomes an explicit *"Confirm these metrics so Deliver can proceed?"* prompt, and the dashboard's `y` chip hint becomes `confirm success metrics` instead of generic `proceed`. The suggested-next strip names the first Deliver agent that will unblock on confirmation.
- **`/audit-pipeline` extended** — reports the Success-Metrics Gate status alongside the Research-First Gate. (Slash command file unchanged; the rule lives in the orchestrator's check, which `/audit-pipeline` already routes to.)
- **Demo state updated** — state 10 (PM Metrics Architect) in `docs/dashboard-demo.html` now shows the v3.4 confirmation framing. Click the state to preview: notice the new TL;DR confirmation copy, the changed chip hint, and the annotation explaining the gate's role.

Why this rule: without confirmed success metrics, Deliver artifacts optimize for nothing in particular — or worse, for the designer's implicit metrics, not the team's actual ones. The hidden-assumption problem surfaces post-launch when someone asks "is this working?" and the answer depends on who you ask. Forcing the metrics step + explicit confirmation makes the optimization target a deliberate decision instead of an inherited default.

Token-cost impact: zero. The gate routes an agent that was already in the lineup (`pm-metrics-architect`); it just changes WHEN it runs (always before Deliver, instead of opportunistically). The agent's own run cost (~$0.12 sonnet) is unchanged.

## 2026-05-18 — v3.3: Decision Data panel — surface critical data inline

v3.1/v3.2 made the dashboard interactive but kept the actual decision-critical data (research evidence, scoring tables, the bet, named accounts, measurement plan) hidden in MD handoff files. To make a `y / revise / pivot` call you'd often still open the MD file — which defeated the v3.1 intent of "the dashboard is where you read." v3.3 adds a **Decision Data panel** between the stat cells and the TL;DR so the headline data is visible inline.

- **New `.now-decision` panel in `templates/dashboard.html`** — renders between `.now-stats` and `.now-tldr` in the NOW card. Four shape variants for different agent types:
  - **`insights`** — numbered list, each row text + verbatim evidence + high/medium/low confidence chip. Used by `discovery-researcher`, `ideation-facilitator`, `usability-tester`, `critique-partner`.
  - **`table`** — scoring/comparison table with deltas (green ↑ / red ↓) and in/out/open pills. Used by `feature-prioritizer`, `competitive-analyst`, `interaction-designer`, `handoff-engineer`.
  - **`callout`** — single highlighted quote (the bet, beachhead) + supporting meta block. Used by `product-positioner`, `pm-strategist`, `pm-launch-architect` (with `flavor: launch` orange palette).
  - **`metrics`** — stacked rows for measurement-plan layers (north-star · input · health · counter). Used by `pm-metrics-architect`.
- **`SHARED_CONTEXT.md` gets a Decision Data Shapes appendix** — full spec of the 4 shape types, the per-agent shape map (which agent uses which shape), and length discipline (caps stay aligned with v2 token-budget rules).
- **`orchestrator.md` Dashboard Rendering updated** — orchestrator now reads the just-completed sub-agent's `decisionData` and embeds it in `dashboard.html` at every Stop Gate. If decisionData is missing, the panel is omitted; the dashboard degrades gracefully.
- **TL;DR vs Decision Data — clear split** — the TL;DR (3 bullets) now *references* the panel ("Top 2 insights are high-confidence" / "Guest checkout jumped to #2") rather than duplicating it. The panel owns the data; the TL;DR owns the framing.
- **Demo updated (`docs/dashboard-demo.html`)** — 5 states now showcase the Decision Data panel: a new "02. After Discovery" state with the insight list + evidence, "03. Mid-pipeline" with the scoring table, "08. PM Strategist" with the bet callout, "09. PM Launch Architect" with the beachhead callout (orange flavor), "10. PM Metrics Architect" with the 4-layer measurement plan. State count grows 10 → 11.

Token-cost impact: +1–2k output per Stop Gate (dashboard write goes ~2–3k from ~1–2k). Across a 5–8 step pipeline, +$0.05–0.15. Still well within the v2 $3 ceiling.

What stays in MD files (not on dashboard): full methodology, sample bias audit, dropped ideas, interview transcripts, full event taxonomy, edge-case state diagrams. The dashboard is the decision surface; the MD is the audit trail.

## 2026-05-18 — v3.2: Click-driven mode — local server + polling loop

v3.1 made the Stop Gate visual but the chips were read-only — you still had to type in chat. v3.2 makes the dashboard genuinely interactive: clickable chips POST to a local HTTP server, a new slash command runs a polling loop that drives the orchestrator on browser clicks. Click-and-walk-away UX without breaking the chat-as-source-of-truth invariant.

- **New file `templates/dashboard-server.py`** — tiny Python stdlib HTTP server on `localhost:3737`. No external deps. Serves `dashboard.html`, accepts button POSTs at `/api/action`, exposes queue state at `/api/queue`, supports `/api/reset` and `/api/health`. Writes click intent to `<project-root>/.harry-queue.json`.
- **`templates/dashboard.html` upgraded to interactive** — chips are now real `<button>` elements with `fetch()`-based handlers. `revise` and `pivot` reveal an inline text input below the chip row so you can type just the delta and submit. Connection-status pill (top-right) shows server reachability. Toast notifications confirm successful clicks. Polls `/api/queue` every 3 seconds to reflect queued state in the UI.
- **New slash command `templates/.claude/commands/agent-harry-loop.md`** — drives the polling loop. Uses `ScheduleWakeup` to schedule next ticks. Reads `.harry-queue.json` each cycle; when a click is queued, dispatches to the `orchestrator` subagent with the click's intent baked into the invocation prompt. Idle cycles cost ~$0.015 each (one cheap turn that just reads the file + schedules), capped at 20 polls (~20 min) before auto-pause.
- **New file `templates/.harry-queue.json`** — queue state schema. Fields: `queued_action` (the pending click or null), `last_action_processed` (audit trail), `poll_count`, `max_polls`, `session_started`. Single source of truth for the click→orchestrator handoff.
- **Orchestrator gets a Queue Mode note** — when invoked by `/agent-harry-loop`, the orchestrator does NOT call `ScheduleWakeup` itself (the slash command owns scheduling). Otherwise unchanged — same Executive Summary, same Stop Gate, same `dashboard.html` write at every turn.
- **SHARED_CONTEXT.md gets a "Queue Mode (v3.2)" subsection** — architecture summary, setup steps, stop conditions. Queue Mode is opt-in; chat-only mode (v3.1 behavior) still works exactly as before.
- **Install + Refresh modes updated** — copy `dashboard-server.py` + `.harry-queue.json` + `agent-harry-loop.md` slash command. Refresh preserves an existing `.harry-queue.json` (it may have in-flight state) but always overwrites the server, slash command, and HTML files.

Architecture decision (worth calling out):

> The `/agent-harry-loop` slash command runs in the **main Claude Code session**, not as a subagent. This is necessary because `ScheduleWakeup` is only available in the main session's dynamic-loop mode, not in subagent tool lists. The orchestrator subagent stays focused on product-design work; the loop driver handles the click polling.

Setup steps for click-driven mode:

```bash
# Terminal 1 — start the server (no deps, just Python stdlib)
cd <project> && python3 dashboard-server.py

# Browser — open the dashboard
open http://localhost:3737

# Terminal 2 — start Claude Code
cd <project> && claude
# Then: /agent-harry-loop <your goal>
```

Stop conditions for the loop: user clicks `cancel`, idle timeout (20 polls), orchestrator returns `complete`, user types `/end-loop` in chat, or queue corruption (after one retry).

## 2026-05-18 — v3.1: Visual Stop Gate companion — `dashboard.html`

After v3 shipped, reading text TL;DR cards step-by-step still felt tiring. v3.1 adds a self-contained visual dashboard that renders alongside the chat — the human reads the Exec Summary visually, types decisions in chat. Spec was grilled across 7 design branches before any code was written.

- **New file `templates/dashboard.html`** — a self-contained static HTML page (no JavaScript, no external assets) showing the current pipeline state in a single-focus layout: top bar (project + cost meter) · history breadcrumb (compressed) · BIG NOW card (status, agent, mode, phase pill, 4 stat cells, 3-bullet TL;DR, next-move suggestion, 5 command chips) · suggested-next strip · footer.
- **Orchestrator rewrites `dashboard.html` at every Stop Gate** — new "Dashboard Rendering" section in `orchestrator.md` instructs the orchestrator to overwrite `<project-root>/dashboard.html` with current pipeline state inlined as HTML. Auto-refreshes in the Claude Preview MCP panel. ~1–2k extra output tokens per Stop Gate, well within the $3 ceiling.
- **Cost meter is load-bearing** — top-bar cost value uses a color class: `budget-ok` (green, ≤$1.50) / `budget-warn` (yellow, $1.50–$2.50) / `budget-over` (red, >$2.50). Surfaces the v2 token-budget rule visually.
- **Read-only by design** — command chips in the dashboard display the literal text the user types in chat (`y / revise <delta> / pivot — <X> / grill me / cancel`). Clicks do nothing. Chat remains the source of truth, audit trail, and input surface. Silence is still not consent.
- **Single-focus layout matches Alignment Loop** — past steps are compressed crumbs, current step is the visual centerpiece, future is a non-binding "suggested" strip. No Kanban "Pending" column because there's no pre-committed plan.
- **Graceful degrade** — if `dashboard.html` doesn't exist (e.g. pre-v3.1 install that hasn't been refreshed), orchestrator skips the render silently and prints TL;DR in chat as before. Same for explicit "no dashboard" opt-out.
- **Install + Refresh modes updated** — both now copy `templates/dashboard.html` to project root. Refresh checks `SHARED_CONTEXT.md` for "Dashboard companion" marker and warns if the project is pre-v3.1.
- **SHARED_CONTEXT.md gets a "Dashboard companion (v3.1)" subsection** under the Always-On Stop Gate section — single source of truth for the architecture.

Resolved by pre-implementation grilling:
- Whole-experience problem (text volume + sequence + progress + input) → visual surface helps
- Chat behavior → truncated supplement (chat = timeline log, dashboard = TL;DR detail)
- Location → Claude Preview MCP panel (already in user's workflow)
- Interaction → read-only chips (clicks don't save typing for the common `y` path)
- Layout → single-focus with breadcrumb + suggested-next (Alignment-Loop friendly)
- Live-ness → Stop-Gate only (no mid-step "running…" animation in v1)
- Scope → static mockup first, then orchestrator integration

## 2026-05-18 — v3: PM Skills Integration + Alignment Loop (anti-waterfall orchestration)

Two structural shifts: Agent Harry now covers PM as well as design, and the orchestrator works *with* the user via an Alignment Loop instead of running a fixed Discovery → Define → Deliver waterfall.

- **3 new PM agents added** (all sonnet — fits the v2 token budget):
  - `pm-strategist` — vision, business model, market scan (SWOT/PESTLE/Porter/Ansoff), value proposition, pricing, north-star metric, market sizing
  - `pm-launch-architect` — GTM strategy, beachhead segment, ICP, sales/marketing motions, battlecards, growth loops, launch sequencing, pre-mortems, stakeholder maps
  - `pm-metrics-architect` — north-star + input + health + counter-metric design, OKR planning, tracking plans, instrumentation
- **PM Skills Map** added to `SHARED_CONTEXT.md` — every agent now knows which `pm-*` and `product-management:*` skills it owns and can invoke via the Skill tool instead of producing artifacts from scratch. Covers the full PM toolkit: strategy, market research, marketing/growth, GTM, product discovery, execution, tracking, plus general toolkit utilities.
- **Total agents now 13** (10 design + 3 PM). Opus still only on `orchestrator` + `critique-partner`; the other 11 stay on sonnet.
- **Orchestrator default mode shifted from Waterfall → Alignment Loop** — the orchestrator no longer produces a 5-phase pipeline upfront. Instead it:
  1. **Diagnoses** with at most 2 questions (or skips if the goal is concrete)
  2. **Proposes the smallest-next-move** — one agent, one mode, one tight goal
  3. **Runs** that single move
  4. **Realigns** — presents what was learned, proposes the next move, loops back to step 2
- **New `pivot — <new direction>` command** at every Stop Gate — lets the user steer the loop somewhere else without cancelling. Documented in orchestrator's Stop Gate response table.
- **Waterfall mode preserved as fallback** — when the user explicitly asks for a fixed plan ("plan the full pipeline", "lay out all phases"), orchestrator drops into the old Waterfall mode. Same Stop Gates between every step. User can break out with `pivot` at any gate.

The Alignment Loop is the answer to feedback that linear waterfall feels rigid even with Stop Gates — the orchestrator should *align with* the user, not present plans for approval.

## 2026-05-18 — v2.1: Always-On Stop Gate (per-step approval, even in bypass-permission mode)

- **Always-On Stop Gate added** — `SHARED_CONTEXT.md` and `orchestrator.md` now define a mandatory per-step approval gate. After every sub-agent run, the orchestrator MUST present the Executive Summary + TL;DR, then stop and wait for explicit user input. No auto-proceeding.
- **Bypass-permission mode does NOT waive this gate** — permission bypass authorizes *tools*, not *user-in-the-loop checkpoints*. The Stop Gate is a product-design discipline, not a sandbox restriction. Codified explicitly to prevent the regression.
- **Four-option prompt** — every Stop Gate ends with: `y` (proceed) / `revise <delta>` (iterate the same step) / `grill me` (invoke `grill-me` skill to stress-test) / `cancel` (halt). Silence is not consent.
- **Revision loop spec'd** — on `revise <delta>`, re-invoke the same sub-agent with the delta added to its Goal and the prior handoff as Input. The revised output re-fires the Stop Gate.
- **`grill-me` integration** — orchestrator proactively suggests `grill me` when output is foundational, confidence is low/medium, the output makes non-obvious tradeoffs, or the user has been moving fast.
- **Phase agents updated** — every one of the 9 phase + cross-cutting agents now ends its Output Format with the Stop Gate prompt requirement, so they self-stop even when invoked directly (not via orchestrator).

## 2026-05-18 — v2: Research-First Gate, Executive Summary, Token Budget

Three problems addressed after a real-world Agent Harry feature run cost ~$8 USD and produced AI-friendly-but-human-hostile long-form outputs without any research-first enforcement.

- **Research-First Gate (Hard Block)** — `SHARED_CONTEXT.md` and `orchestrator.md` now define a hard gate: Deliver-phase agents (`interaction-designer`, `usability-tester`, `handoff-engineer`) cannot be invoked unless a Discovery/Define handoff artifact exists or the user has explicitly opted out. Codifies the "don't shortcut Agent Harry pipeline" feedback from 2026-05-18.
- **New `/audit-pipeline` slash command** — `templates/.claude/commands/audit-pipeline.md`. Reports pipeline state (Discovery/Define/Deliver artifact counts), enforces the gate, and surfaces the cheapest unblock path. Designed to be cheap — reads only Executive Summary blocks, not long-form bodies.
- **Executive Summary block (Human-First, Always First)** — Every agent handoff now starts with a stat-card table + 3-bullet TL;DR + one-line next step. The long-form body lives below for AI handoff. Human-readable summary surfaces in <30 seconds; AI-readable detail still available downstream.
- **Token Budget rules** — `SHARED_CONTEXT.md` defines hard output caps (max 6 insights / 4 gaps / 4 concerns / 10 scoring rows / 5 open questions). Orchestrator estimates token cost upfront and refuses plans that exceed $3 USD without explicit user approval.
- **Model routing changed** — 8 phase agents (`discovery-researcher`, `competitive-analyst`, `product-positioner`, `feature-prioritizer`, `ideation-facilitator`, `interaction-designer`, `usability-tester`, `handoff-engineer`) switched from `opus` to `sonnet`. Opus reserved for `orchestrator` and `critique-partner`. Single biggest token cost reduction.
- **Synthesis discipline** — Orchestrator now reads only Executive Summary blocks from prior handoffs by default, not full long-form bodies. Long-form loaded only when a specific decision requires it.
- **Install + Refresh modes updated** — Both now copy `templates/.claude/commands/` alongside `.claude/agents/`. Refresh additionally checks whether the project's `SHARED_CONTEXT.md` is pre-v2 and warns the user to merge the new sections.

## 2026-05-18 — Initial release as `agent-harry`

- Renamed skill from `product-designer-os` to `agent-harry` (personal brand).
- `SKILL.md` description now carries equal-weight brand + semantic + Burmese triggers, so the skill routes whether the user says "install Agent Harry", "set up product designer agents", or "design agent တွေ install လုပ်ပေး".
- Added **Mode 2 — Refresh**: re-copies the 10 agent template files into an already-installed project while preserving `SHARED_CONTEXT.md` and `README.md`. Warns on uncommitted local edits.
- Added **Mode 3 — Update**: runs `git pull --ff-only` on `~/.claude/skills/agent-harry/` and shows the top of this CHANGELOG. Stops if the working tree is dirty (no auto-stash).
- Existing **Mode 1 — Install** (Bundled + Generator) preserved unchanged from the source bundle.
- Templates (`templates/SHARED_CONTEXT.md`, `templates/README.md`, `templates/.claude/agents/*.md`) carried over verbatim from the source bundle — 10 agents covering orchestrator, discovery-researcher, competitive-analyst, product-positioner, feature-prioritizer, ideation-facilitator, interaction-designer, usability-tester, handoff-engineer, critique-partner.
- Repo: `KaungMyatHein/agent-harry` (public, MIT license).
