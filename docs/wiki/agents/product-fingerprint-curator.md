---
title: Product Fingerprint Curator
parent: Agents
nav_order: 3
description: "Curates 3-7 of your best Figma frames into a project-level visual + composition vocabulary (v4.0)."
---

# Product Fingerprint Curator

> The agent that sets up your project's product fingerprint — once per project. It asks you for 3-7 Figma frames that represent your product at its best, then extracts the visual language and composition vocabulary every future feature will inherit.

## What it does

You give it 3-7 Figma node URLs with a role (`hero`, `workhorse`, `empty-state`, `form`, `settings`, `delight`) and a one-line "why exciting" for each. The curator pulls each frame via Figma MCP, extracts visual signals (density, color stance, typography, copy tone, motion stance, imagery, corner radius, shadow, spacing rhythm), identifies composition patterns, derives 3-5 anti-patterns, and writes `<project-root>/product-fingerprint.md`. Every future feature inherits this.

See the [Product Fingerprint concept page](../concepts/product-fingerprint.html) for the why.

## When to use it

- **First feature being designed in a new project** — set this up first, you'll save time on every future feature.
- **After a rebrand or redesign** — run with `--refresh` flag.
- **A Deliver agent halts with "fingerprint missing" or "fingerprint stale"** — you need to run the curator before the agent can proceed.

## When NOT to use it

- You're truly greenfield with no existing product yet — opt out with `skip fingerprint` at the next Deliver agent's pre-intake check.
- You don't have Figma MCP connected — the curator can't run without it.

## What it asks you at intake (Mode A — first curation)

1. Are you in Mode A (first curation) or Mode B (refresh)?
2. Paste 3-7 Figma node URLs with role + one-line "why exciting" per entry.
3. Should anti-patterns be derived from the curated set, asked from you explicitly, or both?

## What you get back

A file at `<project-root>/product-fingerprint.md` containing:

- Curated references (3-7 entries)
- Visual language synthesis (prose headline + structured YAML signal)
- Composition patterns (prose headline + table by role)
- 3-5 anti-patterns ("this product doesn't do X")
- Open / unknown section (gaps the curator couldn't extract)

~200 lines max. Read in full by every future Deliver-phase agent.

## Best practices

- **Pick frames that represent your product at its best.** Not all your screens — just the showcase ones.
- **Aim for 5-6 entries.** Less than 3 is refused; more than 7 dilutes signal.
- **Include role variety.** A balanced set (hero + workhorse + form + empty-state) extracts richer patterns than 5 workhorse screens.
- **Write meaningful "why exciting" lines.** They guide the extraction.

## Common mistakes

- **Curating once and forgetting.** When your product evolves, run `--refresh`.
- **Skipping anti-patterns.** Mandatory — negative signal is half the value.
- **Treating it as a brand book.** It's observational, not legislative.

## Costs and time

- First curation: ~$0.50, ~5 minutes
- Refresh with mostly-unchanged refs: ~$0.20
- Per-field revision tweak: ~$0.05

## What runs before / after

```
[Deliver agent's pre-intake check refuses]
  → /agent-harry-fingerprint
    → product-fingerprint-curator (Mode A)
      → product-fingerprint.md written
        → Stop Gate
          → re-invoke the original Deliver agent
```

## Related

- [Product Fingerprint concept](../concepts/product-fingerprint.html)
- [`/agent-harry-fingerprint`](../commands/agent-harry-fingerprint.html)
- [`lo-fi-designer`](lo-fi-designer.html), [`figma-designer`](figma-designer.html), [`design-engineer`](design-engineer.html)

---

_Current as of v4.0._
