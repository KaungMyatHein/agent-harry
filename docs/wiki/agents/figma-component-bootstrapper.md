---
title: Figma Component Bootstrapper
parent: Agents
nav_order: 4
description: "Creates a Figma component library when you don't have one — once per project (v4.2)."
---

# Figma Component Bootstrapper

> The agent that fixes the "I see frames and groups, not components" problem in hi-fi Figma output. Runs once per project (or in extend mode when a feature needs new components). Reads the product fingerprint, optionally enriches with code tokens, and writes a real Figma file full of variant-aware components that `figma-designer` instances from on every future feature.

## What it does

You give it permission to create a Figma file (new file or existing-file new page). It reads your `product-fingerprint.md` for visual signals (density, corner_radius, copy_tone, etc.), optionally reads token files from your repo (Tailwind config, CSS variables, JSON), and creates a baseline ~25-component library — Button, Text Input, Select, Card, Modal, Tabs, etc. — with proper Variant properties, auto-layout, and slots. Plus any feature-specific components named in your most recent `lo-fi-*.md` handoff. Writes a manifest at `<project-root>/project-component-library.md` and adds two rows to `SHARED_CONTEXT.md` so `figma-designer` can find it automatically.

## When to use it

- **First time you run figma-designer in a project and don't have a published Figma library** — figma-designer will refuse with options; running the bootstrapper is the recommended one.
- **A new feature needs a component that doesn't exist in your library** — re-invoke the agent; it auto-detects Extend Mode and adds only what's missing.
- **You've redesigned your fingerprint and want fresh components** — invoke with the exact typed phrase `recreate from scratch`. Warning: this breaks node-ID references in any existing hi-fi files.

## When NOT to use it

- You already have a published Figma team library — point `figma-designer` at it directly (`library: <url>`).
- Figma MCP isn't connected — can't run.
- Your project has no fingerprint and you don't want to curate one — opt out via `bootstrap with generic Material defaults` (strongly discouraged outside greenfield demos).

## What it asks you at intake

**Mode A — Create (first run)** asks 4 questions in one block:
1. Figma MCP availability (hard refusal if missing).
2. Where the components file lands (new file in a team or Drafts, or existing file with a new page).
3. Which lo-fi handoff(s) to scan for feature-specific components (latest / all / none / specific file).
4. Token source auto-detection — confirms detected `tailwind.config.{ts,js}` / `tokens.json` / CSS `:root` blocks, or `none` if none found.

**Mode B — Extend** (auto-detected when the manifest exists) asks 2 questions:
1. Which lo-fi handoff(s) to scan for missing components.
2. Confirm the diff (what's missing vs. already present).

**Mode C — Recreate** (only when the user typed `recreate from scratch`) shows a mandatory warning about node-ID breakage and asks one final `y` confirmation.

## What you get back

A Figma file (new or modified) containing the ~25 baseline components plus feature-specific additions, each with:
- Native Figma Variant properties (e.g., Button has `Variant: primary/secondary/ghost/destructive` × `State: default/hover/disabled/loading`)
- Auto-layout enabled with fingerprint-derived padding/gaps
- Slot structures with `Hug Content` resizing for variable content
- Token-applied fills/strokes/corner-radius/shadow (when token source detected) or fingerprint-derived values

Plus `<project-root>/project-component-library.md` — a manifest listing every component with its Figma node ID, variants, states, and slots. `figma-designer` reads this on every future invocation to know what to instance.

## Best practices

- **Run it after `product-fingerprint-curator` but before your first `figma-designer` invocation.** Cold-start order is: fingerprint → bootstrapper → figma-designer.
- **Let auto-detection handle token sources.** If your codebase has `tailwind.config.ts`, the bootstrapper finds it and applies real color/spacing values. You don't need to specify.
- **Use Extend Mode liberally.** Feature #5 needs a DatePicker that doesn't exist? Re-invoke the bootstrapper — it'll add just that one component, not rebuild the whole library.
- **Avoid Recreate Mode.** It breaks references in any existing hi-fi files. Use it only when you genuinely want to start over (major rebrand).

## Common mistakes

- **Skipping the fingerprint.** Bootstrapping with Material defaults produces generic components that don't match your product. Curate first.
- **Asking for code-library translation.** Reading shadcn/ui's React source and rendering Figma equivalents is out of v1 scope. Use the baseline + name specific components you need.
- **Hand-editing `components[].node_id` in the manifest.** Those are owned by the agent. Hand-edit `notes` per component, never the IDs.

## Costs and time

- First create (baseline + ~5 feature-specific): ~$2.00–4.00, ~15 minutes (many `use_figma` calls)
- Extend mode (add 1–3 components): ~$0.30–0.80, ~2 minutes
- Recreate from scratch: ~$2.00–4.00, ~15 minutes
- Single-component revise (e.g., change Button radius): ~$0.10

## What runs before / after

```
[figma-designer's Pre-Intake Check #2 refuses with options]
  → figma-component-bootstrapper (Mode A — Create)
    → project-component-library.md + Figma file written
      → SHARED_CONTEXT.md updated with DS Figma file URL
        → Stop Gate
          → re-invoke figma-designer
            → figma-designer now instances real components from the library
```

For Extend Mode, the flow is shorter — invoke directly when figma-designer flags a component gap.

## Related

- [Figma Designer](figma-designer.html) — the consumer that refuses without a library
- [Product Fingerprint Curator](product-fingerprint-curator.html) — the upstream visual-signal source
- [Lo-Fi Designer](lo-fi-designer.html) — provides the feature-specific component list scanned during Create Mode
- [Audit Ledger Events](../reference/audit-ledger-events.html) — `bootstrap_*` event family

---

_Current as of v4.2._
