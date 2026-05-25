---
title: First Feature Walkthrough
parent: Guides
nav_order: 1
description: "A realistic checkout-flow design session from start to handoff. ~15 minute read."
---

# First Feature Walkthrough — Checkout Flow

This walkthrough takes you through a complete Agent Harry session, end to end, for one realistic feature. You'll see what the orchestrator says, what each agent asks, what you type back, and what artifacts you end up with.

**Time to read:** about 15 minutes.
**Time a real session takes:** about 90 minutes of wall-clock (most of which is reviewing outputs).
**Total cost of the session shown below:** about $2.60.

If you haven't installed Agent Harry yet, start with [Getting Started](../getting-started.html) first.

---

## Scenario setup

You're working on a Next.js + Tailwind + shadcn/ui SaaS e-commerce project. The team wants to ship a redesigned checkout flow.

What you have:

- A partial PRD in Notion describing the flow at a high level
- An existing design system in Figma (`https://figma.com/file/.../design-system`)
- An existing Cart page that this flow will launch from (`app/cart/page.tsx`)
- A "Checkout" button somewhere on the cart that's wired to a dead route

What you don't have yet:

- A defined success metric (you're not sure if you're optimizing conversion rate, AOV, or time-to-checkout)
- A product fingerprint (you've never set one up for this project)
- Any hi-fi designs or prototype code

You've already filled in `SHARED_CONTEXT.md` per [Getting Started](../getting-started.html#step-3-fill-in-shared_contextmd-2-minutes). You're at the project root in Claude Code, ready to go.

---

## Turn 1 — Tell the orchestrator the goal

**You:**

> Design the checkout flow.

**Orchestrator:** *(Diagnose phase — at most 2 clarifying questions)*

> Two quick questions:
>
> 1. Is this a redesign of an existing flow, or a net-new flow? (I see an `app/checkout/page.tsx` placeholder; was anything ever shipped there?)
> 2. Who's the primary user? B2C shoppers, B2B procurement, or both?

**You:**

> Redesign — `app/checkout/page.tsx` was a placeholder that never went live. Primary user is B2C shoppers (one-off purchases, no procurement flows).

**Orchestrator:**

> Got it. Smallest next move: **`discovery-researcher` Mode B** — audit your partial Notion PRD before we move to design.
>
> The Research-First Gate is in front of us: I can't route to design work until Discovery or Define artifacts exist in this project. The fastest unblock is auditing what you already have (Mode B) rather than running a new research study (Mode A).
>
> Type `y` to run `discovery-researcher` Mode B, or `revise — <delta>` to change the proposal.

---

## Turn 2 — Hit the Research-First Gate

The orchestrator just told you about the [Research-First Gate](../concepts/research-first-gate.html). Before any Deliver-phase agent (lo-fi-designer, figma-designer, design-engineer) can run, there has to be a Discovery or Define artifact in the project's `design-workspace/` directory. You don't have one yet, so the gate blocks.

The orchestrator's offer is to clear the gate cheaply: audit your existing PRD in Mode B instead of running fresh research. That's the right call for a redesign with existing context.

**You:**

> y

---

## Turn 3 — `discovery-researcher` Mode B runs

The agent reads your Notion PRD (it found it via the `Notion workspace` field you filled into `SHARED_CONTEXT.md`). It produces an Executive Summary:

```
| Agent          | discovery-researcher  |
| Mode           | B (audit existing)    |
| Phase          | discovery             |
| Confidence     | medium                |
| Inputs         | 1 Notion page (PRD draft v2) |
| Key outputs    | 4 insights, 3 gaps, 2 open questions |
| Recommendation | proceed to Define     |

TL;DR:
- Conversion drop happens at the address-entry step (cited from
  analytics in PRD page 4); current step asks for 11 fields when
  only 5 are required at this stage
- Existing PRD names "reduce cart abandonment" as the goal but
  doesn't quantify the target — needs a success metric
- Open question: is "guest checkout" in scope? PRD is ambiguous

Next: Run `pm-metrics-architect` to confirm the success metric
before any Deliver work.

Artifact written: design-workspace/saas-ecommerce/2026-05-24_discovery-researcher_checkout-audit.md
```

You read it. The TL;DR makes sense. You type:

**You:**

> y

---

## Turn 4 — Hit the Success-Metrics Gate

The Research-First Gate is now clear (you have a Define-phase artifact). But the orchestrator immediately surfaces the next gate:

**Orchestrator:**

> Define-phase artifacts exist now. Before we can route to Deliver (lo-fi-designer, figma-designer, design-engineer), the Success-Metrics Gate fires.
>
> Smallest next move: **`pm-metrics-architect`** to lock in the success metric. The Discovery audit flagged that "reduce cart abandonment" is unquantified — we need a target and an input metric tree before designing.
>
> Type `y` to run, `revise — skip metrics, I have them outside Agent Harry` to opt out, or `cancel`.

**You:**

> y

---

## Turn 5 — `pm-metrics-architect` runs

The agent asks you a few questions about your North Star, then proposes:

```
North Star Metric: weekly purchase rate per active cart user
Input metrics:
  1. checkout-start rate (cart → checkout)
  2. address-step completion rate
  3. payment-step completion rate
  4. confirmation-page view rate

Health metrics:
  - checkout error rate (network + validation)
  - p95 time-to-completion

Target: address-step completion rate from current 64% → 80%
        within 8 weeks of ship.

Artifact written: design-workspace/saas-ecommerce/2026-05-24_pm-metrics-architect_checkout-metrics.md
```

The Stop Gate text changes here. Instead of the usual "proceed?" framing, it asks for **confirmation** of the success metrics — that's the signal the Success-Metrics Gate uses to know you've actually agreed.

**You:**

> y, confirm metrics

The Success-Metrics Gate is now clear. The orchestrator proposes the next step:

**Orchestrator:**

> Metrics confirmed. Next move: **`lo-fi-designer`** for the checkout flow. Before it runs, it'll do its own pre-intake check for the product fingerprint at `<project>/product-fingerprint.md`. You don't have one yet, so expect a refusal — that's fine, the agent will offer you a path forward.

---

## Turn 6 — Hit the Product Fingerprint pre-intake check

You invoke `lo-fi-designer`. Before any of its normal intake questions, it does the [Product Fingerprint](../concepts/product-fingerprint.html) check. The file doesn't exist, so it refuses:

```
Product fingerprint missing — this is a critical input.

<project-root>/product-fingerprint.md doesn't exist. Without it,
I'm designing in a vacuum — new layouts will be DS-correct but
may not match the product's visual language or composition
vocabulary.

Options:
- Run `product-fingerprint-curator` now (recommended) — takes
  ~5 min, asks for 3–7 exciting Figma frames. Reusable for all
  future features.
- Type `skip fingerprint` if you accept the visual-drift risk.
- Type `cancel` to halt.
```

You decide to run the curator. The fingerprint is reusable — once set up, every future feature uses it.

**You:**

> Run product-fingerprint-curator now

---

## Turn 7 — `product-fingerprint-curator` runs

The agent asks you for 3–7 Figma frames that represent your product at its best.

**Curator:**

> Paste 3–7 Figma node URLs. For each, give me a role (hero / workhorse / empty-state / form / settings / delight) and a one-line "why exciting."

**You:**

```
1. Marketing Hero — hero — https://figma.com/file/.../node?id=12 — "brand voice peak"
2. Dashboard — workhorse — https://figma.com/file/.../node?id=43 — "info density at its best, 4 zones never feel cluttered"
3. Empty Library — empty-state — https://figma.com/file/.../node?id=67 — "warm illustration without being cute"
4. Onboarding Step 2 — form — https://figma.com/file/.../node?id=89 — "inline help feels conversational not chatty"
5. Settings Account — settings — https://figma.com/file/.../node?id=101 — "deep info hierarchy stays scannable"
```

**Curator:** *(pulls each frame via Figma MCP, extracts visual signals, derives anti-patterns from the set, writes the fingerprint file, presents the synthesis)*

```
| Agent       | product-fingerprint-curator |
| Phase       | cross-cutting               |
| Inputs      | 5 Figma frames              |
| Coverage    | hero, workhorse, empty-state, form, settings; gap: delight |
| Anti-patterns | 4 derived                 |
| Confidence  | high                        |

TL;DR:
- Visual language: tight density (8px rhythm), weight-driven type
  hierarchy, terse + clinical copy tone, near-monochrome with one
  warm accent for primary CTAs, soft 8px corners throughout
- Composition: workhorse uses sidebar+main, settings uses two-pane,
  primary CTA top-right, empty states pair small illustration with
  single CTA
- Anti-patterns: no full-bleed outside marketing, no playful
  illustrations in product UI, no skeleton loaders (use spinners),
  no dark mode default

Artifact written: <project-root>/product-fingerprint.md
```

You scan it. The "terse + clinical copy tone" tracks. The "primary CTA top-right" matches what your workhorse screens do. The anti-pattern "no skeleton loaders" surprises you because you'd been considering them — worth a separate conversation, but for now you accept the fingerprint as written.

**You:**

> y

---

## Turn 8 — `lo-fi-designer` (now unblocked)

The fingerprint is in. You re-invoke lo-fi-designer. Pre-intake check passes (file exists, all 5 references are fresh per Figma's `lastModified`). The agent moves to its normal intake questions.

**Lo-Fi Designer:**

> Four quick questions. Detected stack: Next.js + Tailwind + shadcn/ui. Confirm?
>
> 1. Userflow Figjam — do you have one? (Or should I generate one?)
> 2. Design system — confirmed from SHARED_CONTEXT (your shadcn library URL)
> 3. Stack — confirmed
> 4. **Entry point for this flow?** Auto-discovered candidates from your PRD scope:
>    - `app/cart/page.tsx` — matched on "cart"
>    - `app/products/[id]/page.tsx` — matched on "product"
>
>    Pick one, paste a Figma URL of the entry screen, or say "new top-level entry."

**You:**

> Generate the userflow. Entry point is app/cart/page.tsx — the Checkout button in the cart footer launches this flow.

**Lo-Fi Designer:** *(generates a Figjam userflow via Figma MCP, then sketches 3 ASCII layouts)*

```
Primary — sidebar+main (inherits Cart page scaffolding)
  Cart pages uses sidebar+main; checkout continues the pattern.
  Anchors on fingerprint's dominant workhorse composition.

Alternative — two-pane summary+form
  Order summary on the left, form on the right. Breaks Cart's
  scaffolding but matches the fingerprint's settings-screen pattern.

Risky — full-takeover modal sequence
  Each step is a full-screen modal. Breaks both entry-point
  continuity AND the fingerprint's anti-pattern of "no full-bleed
  outside marketing."
  breaks_antipattern: "no full-bleed outside marketing"
  rationale: "modal flow is contained, not full-bleed in the
  marketing sense — worth considering if conversion data shows
  step-by-step works better."

Artifact written: design-workspace/saas-ecommerce/lo-fi-checkout.md
```

---

## Turn 9 — The "didn't go as planned" moment

You read the three layouts. Primary looks right. Alternative is interesting but you don't think you need the comparison. Risky annotates an anti-pattern violation honestly, which you appreciate — but you're not convinced the full-takeover modal is worth exploring for this feature.

You decide: drop Risky, keep just Primary and Alternative.

**You:**

> revise — drop the Risky variant. Just Primary and Alternative for now.

**Lo-Fi Designer:** *(re-invokes with the delta; produces an updated handoff with only 2 layouts)*

This is the [Stop Gate](../concepts/stop-gate.html) doing its job. You caught a layout choice you didn't want before it propagated into figma-designer and design-engineer.

After review, you pick Primary.

**You:**

> y, go with Primary

---

## Turn 10 — `figma-designer` (the Figma path)

You decide you want hi-fi Figma frames before code. You'd loop back for the prototype later.

**Orchestrator:**

> Routing to `figma-designer`. It'll do its own fingerprint pre-intake check (fresh, will pass) and then ask intake questions about state coverage and Figma destination.

**Figma Designer:** *(after intake — you pick "default + empty + error" states, new file in your Drafts)*

```
| Agent       | figma-designer              |
| Mode        | A                           |
| Phase       | deliver                     |
| Confidence  | high                        |
| Screens     | 4 (cart-entry, address, payment, confirmation) |
| States      | 12 (4 screens × 3 states each) |
| DS components used | Button, Input, FormField, Card, ProgressIndicator |
| Anti-patterns | all respected               |

TL;DR:
- 4-screen flow, 12 frames, all DS-instanced
- Density matches fingerprint (tight, 8px); copy tone matches
  (terse + clinical)
- First screen visually continues from Cart entry — same sidebar,
  same nav placement, same density

Figma file: https://figma.com/file/.../checkout-redesign-v1
Artifact written: design-workspace/saas-ecommerce/figma-hifi-checkout.md
```

**You:** *(opens the Figma file, scrolls through; the frames look like your product)*

> y

---

## Turn 11 — `design-engineer` (parallel code path)

You decide to also build a runnable prototype, since engineering will want to play with it.

The design-engineer pre-intake check passes (fingerprint fresh). It then auto-discovers code paths from the PRD scope:

**Design Engineer:**

> Existing code I'll study for composition patterns:
>
> Feature-area matches:
> - `app/cart/page.tsx` — matched on "cart"
> - `app/products/[id]/page.tsx` — matched on "product"
>
> Universal primitives:
> - `components/ui/Button.tsx`
> - `components/ui/Card.tsx`
> - `app/layout.tsx` (root template)
>
> Override: type `revise — study X instead of Y` or `revise — drop auto-discovery`.

You're fine with the discovery.

**You:**

> y

**Design Engineer:** *(builds the prototype in `prototypes/checkout/`, all 5 states, mock API at 800ms delays)*

```
| Files written | 7 (page.tsx, mockApi.ts, 4 state components, README) |
| Polish bar    | D2 (production-visual) |
| Routes        | /prototypes/checkout?state=empty / loading / populated / error / edge |
| DS components | 8 (all existing — none new) |

To run:
  cd <project> && npm run dev
  open http://localhost:3000/prototypes/checkout

Artifact written: design-workspace/saas-ecommerce/prototype-checkout.md
```

You run it locally. The empty state matches the fingerprint's "small illustration + single CTA" pattern. The loading state uses spinners (not skeletons — the fingerprint's anti-pattern was respected). The error toast tone is terse + clinical, matching your product.

**You:**

> y

---

## Turn 12 — `prd-author` updates the PRD

The orchestrator suggests one more move: have prd-author add a "What this looks like" section to the original Notion PRD, linking to the Figma file and the prototype URL.

**You:**

> y

The PRD now has visual + code references your team can review.

---

## What you have at the end

| Artifact | Where |
|---|---|
| Discovery audit | `design-workspace/saas-ecommerce/2026-05-24_discovery-researcher_checkout-audit.md` |
| Success metrics | `design-workspace/saas-ecommerce/2026-05-24_pm-metrics-architect_checkout-metrics.md` |
| Product fingerprint | `<project>/product-fingerprint.md` — reusable for every future feature |
| Lo-fi handoff | `design-workspace/saas-ecommerce/lo-fi-checkout.md` |
| Hi-fi Figma | `design-workspace/saas-ecommerce/figma-hifi-checkout.md` + Figma file URL |
| Code prototype | `design-workspace/saas-ecommerce/prototype-checkout.md` + `prototypes/checkout/` directory |
| Updated PRD | Notion (with Figma + prototype links) |
| Audit ledger | `<project>/.harry-audit.jsonl` — every decision logged |

---

## Cost breakdown

| Step | Cost |
|---|---|
| Orchestrator routing (12 turns) | ~$0.20 |
| `discovery-researcher` Mode B | ~$0.30 |
| `pm-metrics-architect` Mode A | ~$0.40 |
| `product-fingerprint-curator` Mode A | ~$0.50 |
| `lo-fi-designer` (1 revise round) | ~$0.40 |
| `figma-designer` Mode A | ~$0.40 |
| `design-engineer` Mode A | ~$0.30 |
| `prd-author` update | ~$0.10 |
| **Total** | **~$2.60** |

Wall-clock time: about 90 minutes (most of it spent reviewing the outputs at each Stop Gate, not waiting on the agents).

---

## What this walkthrough didn't show

A few agents you didn't invoke in this session:

- [`competitive-analyst`](../agents/competitive-analyst.html) — skipped because this was an internal redesign with clear requirements
- [`usability-tester`](../agents/usability-tester.html) — deferred until after first user feedback
- [`handoff-engineer`](../agents/handoff-engineer.html) — your engineering team prefers their own spec format
- [`pm-launch-architect`](../agents/pm-launch-architect.html) — not relevant for an internal feature redesign
- [`critique-partner`](../agents/critique-partner.html) — only fires when you type `grill me` at a Stop Gate, which you didn't need this round

Each of these has its own page under [Agents](../index.html#all-agents) for when you do need them.

---

## Things that surprised you (the takeaways)

- **You hit two gates and one pre-intake check before any design work.** Each one took 5–10 minutes to clear. They felt like friction at the time but each one prevented a downstream redo. The Research-First Gate caught the unquantified goal; the Success-Metrics Gate locked in the target; the fingerprint check caught the missing visual vocabulary.
- **The `revise` at Turn 9 saved a downstream re-run.** Without the Stop Gate, the Risky variant would have propagated into figma-designer's hi-fi work.
- **The fingerprint is reusable.** Next feature you design in this project won't need to re-curate. The $0.50 you paid here is amortized.
- **Cost transparency matters.** You knew before each step what it would cost (~$0.30–0.50). No surprise bills.

---

## What to read next

- [Stop Gate](../concepts/stop-gate.html) — the mechanic that fired after every agent
- [Product Fingerprint](../concepts/product-fingerprint.html) — the v4.0 concept this walkthrough leans on heavily
- [Agents](../index.html#all-agents) — full pages for each agent invoked above
- [Troubleshooting](troubleshooting.html) — when something goes wrong mid-session

---

_Current as of v4.0._
