---
title: Competitive Analyst
parent: Agents
nav_order: 5
description: "Competitor teardowns and pattern audits using Mobbin + web."
---

# Competitive Analyst

> The agent that studies how competitors solve similar problems. Mode A teardowns specific competitors; Mode B audits patterns across a category.

## What it does

Pulls competitor screenshots and flows (via Mobbin MCP if connected, plus web search), structures their approach, and surfaces patterns worth borrowing or anti-patterns worth avoiding. Output is a teardown report with evidence pointers.

## When to use it

- You're entering a competitive category and don't know the landscape well.
- You want to know "how do others handle X?" — empty states, onboarding, paywalls, etc.
- Before product positioning — competitive context shapes differentiation.

## When NOT to use it

- Your problem is internal-only (admin tools, dev tools without public competitors).
- You already have a competitive analysis from elsewhere → run Mode B audit on it instead.

## What it asks you at intake

- Mode A or Mode B?
- Mode A: name 2-5 competitors + the specific area (e.g., "checkout flow").
- Mode B: paste your existing competitive doc.

## What you get back

A handoff at `./design-workspace/<project>/YYYY-MM-DD_competitive-analyst_<area>.md`:

- 2-5 competitor teardowns with screenshots + flow descriptions
- Patterns observed across the set
- Differentiation opportunities
- Anti-patterns to avoid

## Best practices

- **Name specific competitors, not categories.** "Stripe checkout" is better than "payment processors."
- **Scope tight.** One area per invocation. Don't ask for "everything Stripe does."
- **Use it before positioning, not after.** The output informs positioning.

## Common mistakes

- Asking for too many competitors at once (5 is the practical cap).
- Treating patterns as best practices — they're patterns. Some are anti-patterns.

## Costs and time

~$0.40-0.80, ~10-15 min

## What runs before / after

```
discovery-researcher → competitive-analyst → product-positioner
                                          OR feature-prioritizer
```

Or invoked independently when you need landscape context.

## Related

- [`discovery-researcher`](discovery-researcher.html) — sibling Discovery agent
- [`product-positioner`](product-positioner.html) — typical next move

---

_Current as of v4.0._
