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
| `interaction-designer` | table | Flow list: flow · state count · key decisions · Figma node (max 6) |
| `usability-tester` | insights | Findings (max 5) with severity in the conf chip |
| `handoff-engineer` | table | Spec scope: screens · component states · tokens · open dev questions |
| `pm-strategist` | callout | The bet · falsification · tradeoffs |
| `pm-launch-architect` | callout (flavor: launch) | Beachhead + ICP · meta has named accounts + motion + kill-switch |
| `pm-metrics-architect` | metrics | 4 layers — north-star / input / health / counter |
| `critique-partner` | insights | Concerns (max 5); conf chip carries severity |
| `orchestrator` | (skip) | Orchestrator itself never produces decisionData — it embeds what the just-completed sub-agent produced |

## Length Discipline

Each agent's decisionData stays within the output caps in `SHARED_CONTEXT.md` Token Budget Rules (max 6 insights / 4 gaps / 10 scoring rows / etc.). The Decision Data panel is for the *headline* data the user needs to decide; full methodology, sample bias audit, dropped ideas, etc. still live in the MD handoff file. The dashboard's job is to make the `y / revise / pivot` choice possible without opening MD; the MD is the audit trail.
