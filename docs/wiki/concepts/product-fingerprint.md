---
title: Product Fingerprint
parent: Concepts
nav_order: 6
description: "Project-level visual + composition vocabulary — 3-7 of your best Figma frames become a shared reference every future feature inherits."
---

# Product Fingerprint

> A small file at your project root (`product-fingerprint.md`) that captures your product's visual language and composition vocabulary from 3-7 of your best existing Figma frames. Every future feature reads it and inherits the density, copy tone, and anti-patterns of your existing work.

## What problem it solves

Design system tokens describe vocabulary but not *how it's composed*. Two products with the same DS can feel completely different — one dense and clinical, the other airy and playful. Without a project-level reference for composition idioms, copy tone, and anti-patterns, new feature work comes out DS-correct but product-foreign. New screens look technically right and visibly bolted on.

The fingerprint closes that gap with a small, curated, reusable artifact. You set it up once. Every future feature inherits it.

## How it works

You curate 3-7 Figma frames that represent your product at its best. The [`product-fingerprint-curator`](../agents/product-fingerprint-curator.html) agent:

1. Pulls each frame via the Figma MCP
2. Extracts visual signals (density, color stance, typography stance, copy tone, motion stance, imagery, corner radius, shadow, spacing rhythm)
3. Identifies composition patterns (page scaffolding per role, empty-state pattern, form pattern, data display, CTA placement, confirmation pattern)
4. Derives 3-5 anti-patterns ("this product doesn't do X")
5. Writes the synthesis to `<project-root>/product-fingerprint.md`

The file is ~200 lines max. Every Deliver-phase agent (`lo-fi-designer`, `figma-designer`, `design-engineer`) loads it in full at intake.

## What you'll see

When the file is set up and working, every Deliver-agent intake includes a fingerprint freshness check:

```
| Fingerprint freshness | ✓ fresh, all 5 references unchanged   |
```

When the file is missing OR a reference frame has been edited in Figma since curation, you see a refusal:

```
Product fingerprint missing — this is a critical input.

<project-root>/product-fingerprint.md doesn't exist. Without it,
I'm designing in a vacuum — new layouts will be DS-correct but
may not match the product's visual language.

Options:
- Run `product-fingerprint-curator` now (recommended) — ~5 min,
  asks for 3-7 exciting Figma frames. Reusable forever.
- Type `skip fingerprint` if you accept the visual-drift risk.
- Type `cancel` to halt.
```

## How to interact

Two flows:

### Setting up the fingerprint (one time per project)

Run [`/agent-harry-fingerprint`](../commands/agent-harry-fingerprint.html). The curator asks for 3-7 Figma frames. Per frame, you give:

- **Figma node URL** (required)
- **Role** — one of: hero / workhorse / empty-state / form / settings / delight
- **Why exciting** — one line on what this screen does well

The curator pulls each frame, synthesizes, and writes the file. You confirm with `y` at the Stop Gate. Done. Every future feature inherits.

### Refreshing the fingerprint (when your product evolves)

After a rebrand, redesign, or DS major version bump:

```
/agent-harry-fingerprint --refresh
```

The curator reads your existing fingerprint, lets you keep/swap/remove entries, and re-extracts based on the updated set.

### Opting out

If you're greenfield and have no Figma references to curate:

- Type `skip fingerprint` at any Deliver agent's pre-intake check
- The agent runs without the fingerprint and flags `visual_drift_risk: true` in its Executive Summary
- Logged in the audit ledger as `fingerprint_skipped` so the team knows visual-drift risk was accepted knowingly

## When it fires

The fingerprint pre-intake check fires at the start of every invocation of:

- [`lo-fi-designer`](../agents/lo-fi-designer.html)
- [`figma-designer`](../agents/figma-designer.html)
- [`design-engineer`](../agents/design-engineer.html)

Each agent checks: does the file exist? Are all references still fresh in Figma (lastModified vs the curation timestamp)? If both pass, the agent loads the fingerprint and proceeds. If either fails, the agent refuses with the opt-out options above.

## What's in the file

The structure (full schema is at `<project-root>/product-fingerprint.md` after the curator runs):

```markdown
## Curated References
- name: Dashboard
  role: workhorse
  figma_node: https://figma.com/file/.../node?id=43
  figma_node_last_modified_at_curation: 2026-05-15T10:32:00Z
  why_exciting: "info density at its best — 4 zones never feel cluttered"
(repeat for 3-7 entries)

## Visual Language Synthesis
### Headline
Tight density (8px rhythm), weight-driven typographic hierarchy, terse
clinical copy tone, near-monochrome palette with one warm accent...

### Structured signal
density: tight                    # ev: Dashboard 8px gaps between cards
color_stance: monochrome          # ev: 95% greys, 5% accent
typography_stance: weight-driven  # ev: 3 weights, 2 sizes total
copy_tone: clinical               # ev: "Sign in" not "Welcome back!"
(...)

## Composition Patterns
| Pattern | Observed value | Evidence |
| Page scaffolding (workhorse) | sidebar+main | Dashboard, Settings, Reports |
| Empty-state | illustration + single CTA | Empty Library |
(...)

## Anti-patterns (mandatory, 3-5)
- No playful illustrations in product UI (marketing only)
- No full-bleed images outside marketing
- No skeleton loaders — use spinners
- No dark mode default
```

## How agents use it

Each Deliver-agent applies different parts:

| Agent | Uses from fingerprint |
|---|---|
| `lo-fi-designer` | Composition patterns to anchor layout variants; anti-patterns enforced on Primary + Alternative |
| `figma-designer` | Visual language signals to pick DS component variants (density, corner_radius, copy_tone); anti-patterns as forbidden moves |
| `design-engineer` | Visual signals applied to code (token picks, spacing); composition patterns inform layout primitive choices; auto-discovers existing code paths in the same feature area for additional reference |

## Example

You're starting work on a new project. First feature: settings redesign. You haven't set up a fingerprint yet.

**You:**

> Run lo-fi-designer for the settings redesign.

**Lo-Fi Designer (pre-intake check):**

```
Product fingerprint missing — this is a critical input.
Options: (a) run curator now (b) skip fingerprint (c) cancel.
```

**You:**

> Run the curator now.

The curator asks for 3-7 frames. You paste your dashboard, your marketing hero, your account settings, an empty state, and an onboarding form. Each gets a one-line "why exciting."

The curator pulls them, extracts patterns, writes `<project>/product-fingerprint.md`. Stop Gate. You confirm.

You re-invoke `lo-fi-designer`. Pre-intake check passes (file exists, all 5 frames fresh). The agent runs normally — but now its Primary layout anchors on the workhorse composition observed in your dashboard, its placeholder copy matches your clinical tone, and its DS component picks respect your tight density signal.

Next month, you start a notifications feature. `lo-fi-designer` reads the same fingerprint — no re-curation needed. The new feature matches the rest of the product automatically.

## Common questions

**How long does curation take?**
About 5 minutes. The cost is ~$0.50.

**Can I curate without Figma MCP?**
No. The curator needs to pull frame metadata + structure from Figma. Without the MCP, you can only opt out (`skip fingerprint`).

**What if my product evolves between features?**
Run `/agent-harry-fingerprint --refresh`. The curator preserves entries you keep and re-extracts changed ones. Cheaper than first curation (~$0.20 typical).

**What counts as "exciting"?**
Frames you'd put in a portfolio. The screens that define what your product is *at its best*. Not "all your screens" — just the representative ones. If you have 30 screens, pick 3-7.

**Is the fingerprint per-feature or project-wide?**
Project-wide. One file per project. Every feature reads the same one.

**What if I disagree with an extracted pattern?**
At the Stop Gate, type `revise — drop the "clinical tone" extraction, our tone is professional and warm`. The curator updates that specific field.

**Why mandatory anti-patterns?**
Negative signal is half the value. "We don't use playful illustrations" prevents downstream agents from injecting them from generic best-practice patterns. Without explicit anti-patterns, agents will sometimes pattern-match wrong references.

**Does the fingerprint replace the design system?**
No. The DS provides components and tokens (vocabulary). The fingerprint describes how to compose them and what tone they carry (grammar). Both are needed.

## Related

- [`product-fingerprint-curator`](../agents/product-fingerprint-curator.html) — the agent that writes the file
- [`/agent-harry-fingerprint`](../commands/agent-harry-fingerprint.html) — the slash command (`--refresh` flag)
- [`lo-fi-designer`](../agents/lo-fi-designer.html), [`figma-designer`](../agents/figma-designer.html), [`design-engineer`](../agents/design-engineer.html) — agents that consume the fingerprint
- [Mode A vs Mode B](mode-a-vs-mode-b.html) — Mode B Figma audits check fingerprint divergence
- [Stop Gate](stop-gate.html) — the opt-out happens here

---

_Current as of v4.0._
