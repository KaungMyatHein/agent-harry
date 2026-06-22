Your "design-to-code" tool guessed a component you don't have — and now the diff is a lie you unpick by hand. 🪞

✦ What it is
design-sync mirrors an existing Figma file into code with 1:1 fidelity and zero hallucination, looking every node up in a component bridge and emitting only what's mapped.

✦ When to use it
You want to mirror a Figma file into code exactly, not generate a new design. Or you need a divergence report showing where Figma and code have drifted apart.

✦ Why use it
Without it, a generator papers over gaps with plausible components you don't actually have. design-sync invents nothing: mapped nodes become real components, unmapped ones become explicit GAP markers you decide on.

✦ How to use it
Just tell Agent Harry:
"Use the design-sync agent to mirror this Figma frame into code 1:1 and flag anything unmapped as a GAP."

✦ Benefits
- 1:1 mirror with zero hallucination — it copies, it never guesses
- Honest GAP markers for everything unmapped
- A divergence report (--mode diff) between Figma and the code that should match it

👉 That's the design-sync agent in Agent Harry. Install it and run it.

#AgentHarry #ClaudeCode #ProductDesign #UX #Figma #DesignToCode #Playwright
