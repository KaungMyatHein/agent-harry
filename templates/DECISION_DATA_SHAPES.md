# DECISION_DATA_SHAPES.md

Every agent's handoff includes a `decisionData` structured object that the orchestrator embeds in the dashboard's Decision Data panel. The shape depends on the agent. Four shape variants are defined here.

This file is loaded by the orchestrator at dashboard-render time and by agents that need to confirm their own shape. Agents that don't render the dashboard don't need to load it.

## Type 1 — `insights` (used by: discovery-researcher, ideation-facilitator, critique-partner)

Numbered list of decision-critical findings with evidence and per-item confidence.

```yaml
decisionData:
  type: insights
  label: "Top 5 insights · with evidence + confidence"  # one-line section heading
  items:
    - text: "<strong>Cart abandonment peaks at the verify-phone step</strong>"
      evidence: "\"I gave up because the SMS never came\" — 6/12 interviews · GA4 funnel drop 41%"
      conf: high   # high | medium | low
    - text: "..."
      evidence: "..."
      conf: medium
    # Max 5 items per insights panel. Trim aggressively.
```

## Type 2 — `table` (used by: feature-prioritizer, competitive-analyst)

Structured comparison/scoring table. Use for any data where rows × columns is the natural shape.

```yaml
decisionData:
  type: table
  label: "Re-scored backlog · top 6 with deltas + MVP call"
  cols:
    - { label: "Feature" }
    - { label: "Reach",  num: true }   # num: true → right-aligned, monospace
    - { label: "Impact", num: true }
    - { label: "Effort", num: true }
    - { label: "RICE",   num: true }
    - { label: "MVP" }
  rows:
    - cells:
        - { html: "<strong>Guest checkout</strong>" }
        - { num: true, html: "9" }
        - { num: true, html: "8" }
        - { num: true, html: "3" }
        - { num: true, html: "76 <span class=\"delta-up\">↑</span>" }
        - { html: "<span class=\"pill-in\">in</span>" }
    - dropped: true                    # dropped: true → muted text + strikethrough label
      cells:
        - { html: "Wishlist sync", cls: "label" }
        - { num: true, html: "0.4 <span class=\"delta-down\">↓</span>" }
        # ...
```

Inline span classes available: `.delta-up` (green ↑), `.delta-down` (red ↓), `.pill-in` (green "in"), `.pill-out` (gray "out"), `.pill-open` (orange "open"). Max 10 rows per scoring panel.

## Type 3 — `callout` (used by: product-positioner, pm-strategist, pm-launch-architect)

Single highlighted quote with supporting context. Use for strategic decisions where ONE sentence carries the whole bet, plus elaborate underneath.

```yaml
decisionData:
  type: callout
  flavor: launch   # optional — "launch" uses orange palette instead of strategist cyan
  label: "The bet · one sentence + falsification + tradeoffs"
  quote: 'We win by being the <em>fastest</em> mobile checkout in Southeast Asia for cash-on-delivery merchants — not by feature breadth.'
  meta: '<strong>Falsifiable:</strong> if 3-tap doesn\'t lift conversion ≥18% by week 6, the bet fails.<br><br><strong>Tradeoffs we accept:</strong> ...'
```

The `<em>` in the quote gets accent color. The `meta` field is freeform HTML — usually 2–4 short paragraphs.

## Type 4 — `metrics` (used by: pm-metrics-architect)

Stacked rows of measurement-plan layers (north-star / input / health / counter).

```yaml
decisionData:
  type: metrics
  label: "4-layer measurement plan · north-star · input · health · counter"
  layers:
    - layer: "North-star"
      layerKey: "northstar"     # optional class for color emphasis
      title: "Completed checkouts per active merchant per day"
      small: "ONE number · falsifiable · tracks what users get, not what we ship"
    - layer: "Input × 3"
      title: "New activations / day · Sessions per merchant · Cart conversion %"
      small: "Variables the team can move weekly"
    - layer: "Counter × 1"
      layerKey: "counter"
      title: "Support tickets per merchant per week"
      small: "Catches winning the wrong way"
```

## Per-Agent Shape Map

| Agent | decisionData.type | What goes in it |
|---|---|---|
| `discovery-researcher` | insights | Top 5 insights (text + evidence + confidence) |
| `competitive-analyst` | table | Pattern matrix: pattern · apps · convention · risk (max 7 rows) |
| `product-positioner` | callout | The positioning statement; meta has the value-prop options |
| `feature-prioritizer` | table | Scoring table (top 8) with deltas and MVP pills |
| `ideation-facilitator` | insights | 3–5 concept candidates with one-line tradeoff |
| `low-fi-designer` | insights | 3 layout alternatives (primary/alternative/risky) — text + DS-vs-new component count + confidence (max 3 items) |
| `design-engineer` | table | Screens built: screen · states covered · DS components · new components · polish level (max 6 rows) |
| `usability-tester` | insights | Findings (max 5) with severity in the conf chip |
| `handoff-engineer` | table | Spec scope: screens · component states · tokens · open dev questions |
| `pm-strategist` | callout | The bet · falsification · tradeoffs |
| `pm-launch-architect` | callout (flavor: launch) | Beachhead + ICP · meta has named accounts + motion + kill-switch |
| `pm-metrics-architect` | metrics | 4 layers — north-star / input / health / counter |
| `critique-partner` | insights | Concerns (max 5); conf chip carries severity |
| `orchestrator` | (skip) | Orchestrator itself never produces decisionData — it embeds what the just-completed sub-agent produced |

## Field-to-Shape Mapping for v3.7 Agents

The v3.7 split agents (`low-fi-designer`, `design-engineer`) carry richer semantic data than the 4 existing shape types natively model. Rather than introducing a 5th shape type (which would require dashboard.html render changes), we map the richer fields into the existing `insights` / `table` shapes' free-form slots.

### `low-fi-designer` → `insights` shape (max 3 items)

Each insight item represents one of the 3 ASCII layouts (primary / alternative / risky).

Encoding for richer fields:

| Semantic field | Encoded where |
|---|---|
| `chosen_layout` | `text` HTML prefix: `<strong>Primary</strong> — <one-line summary>` |
| `flow_screens` count | `text` suffix: `... · 5 screens` |
| `new_components_count` | `evidence` left half: `Uses 8 DS components, 2 new` |
| `ds_components_used[]` | `evidence` (compact list, max 5 names) |
| `figjam_url` | `evidence` right half: `... · <a href="...">Figjam</a>` |
| `confidence` per layout | `conf` chip (high / medium / low) |

Example item:
```yaml
- text: "<strong>Primary</strong> — sidebar + tabbed main + persistent command bar · 5 screens"
  evidence: "Uses 8 DS (TopBar, Sidebar, Tabs, Card, ...), 2 new (CommandPalette, FlowProgress) · Figjam"
  conf: high
```

Long-form data (full ASCII layouts, full component tables, per-layout rationale) lives in the handoff body — the panel surfaces only the headline data.

### `design-engineer` → `table` shape (max 6 rows = scope-cap aligned)

Each row represents one screen in the built flow.

Encoding for richer fields:

| Semantic field | Encoded where |
|---|---|
| `screens_built[]` | one row per screen |
| `states_covered[]` | "States" column: comma-joined or count (e.g. `5/5` or `empty, loading, populated, error, edge`) |
| `polish_level` (D2 / D3) | column header in `label` or per-row column |
| `stack_detected` | table `label` (top of panel): `Production-visual (D2) · Next.js + Tailwind` |
| `iteration_count` | table `label` suffix: `... · iteration 2 of 3` |
| `prototype_path` | first column's path link, or in `label` |

Example:
```yaml
decisionData:
  type: table
  label: "Production-visual (D2) · Next.js + Tailwind · iteration 2 of 3"
  cols:
    - { label: "Screen" }
    - { label: "States",     num: true }
    - { label: "DS used",    num: true }
    - { label: "New",        num: true }
    - { label: "File" }
  rows:
    - cells:
        - { html: "<strong>checkout/index</strong>" }
        - { num: true, html: "5/5" }
        - { num: true, html: "6" }
        - { num: true, html: "1" }
        - { html: "<code>prototypes/checkout/page.tsx</code>" }
```

Cumulative cost is NOT in the panel — it's surfaced separately via the dashboard's top-bar cost meter and via `/agent-harry-audit`'s session totals.

## Length Discipline

Each agent's decisionData stays within the output caps in `SHARED_CONTEXT.md` Token Budget Rules (max 6 insights / 4 gaps / 10 scoring rows / etc.). The Decision Data panel is for the *headline* data the user needs to decide; full methodology, sample bias audit, dropped ideas, etc. still live in the MD handoff file. The dashboard's job is to make the `y / revise / pivot` choice possible without opening MD; the MD is the audit trail.
