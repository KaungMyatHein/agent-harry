#!/usr/bin/env node
// Build Apple-Bento-style PNG infographics for Agent Harry — one overview + one card per agent.
// True bento grid: a mosaic of varied-size rounded tiles, each holding ONE compact unit
// (icon, phase, model, a keyword, an in/out, a pipeline, the hook). Light parchment, SF Pro.
// Renders self-contained HTML to PNG via the puppeteer-cached chrome-headless-shell (no npm install).
//
// Usage: node content/scripts/build-infographics.mjs

import { writeFile, mkdir, readdir } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { homedir, tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT = join(ROOT, "infographics");
const TMP = join(tmpdir(), "harry-infographics");

const W = 1080, H = 1350, SCALE = 2;

const PARCHMENT = "#f5f5f7";
const WHITE = "#ffffff";
const INK = "#1d1d1f";
const MUTED = "#6e6e73";
const FONT = `'SF Pro Display','SF Pro Text',system-ui,-apple-system,'Helvetica Neue',sans-serif`;

const PHASES = {
  meta:            { color: "#5e5ce6", c2: "#8b5cf6", label: "META" },
  discovery:       { color: "#0071e3", c2: "#38b6ff", label: "DISCOVERY" },
  define:          { color: "#7c3aed", c2: "#b15cff", label: "DEFINE" },
  deliver:         { color: "#0c8c7a", c2: "#1cb89a", label: "DELIVER" },
  "cross-cutting": { color: "#c1306b", c2: "#f0568c", label: "CROSS-CUTTING" },
};

const ICONS = {
  orchestrator: `<circle cx="24" cy="24" r="5"/><circle cx="9" cy="11" r="3.5"/><circle cx="39" cy="11" r="3.5"/><circle cx="24" cy="40" r="3.5"/><path d="M20.5 20.5 11.5 13.5M27.5 20.5 36.5 13.5M24 29v7.5"/>`,
  "discovery-researcher": `<circle cx="21" cy="21" r="12"/><path d="M30 30 41 41"/>`,
  "competitive-analyst": `<circle cx="24" cy="24" r="13"/><path d="M24 6v8M24 34v8M6 24h8M34 24h8"/><circle cx="24" cy="24" r="2.6"/>`,
  "pm-strategist": `<path d="M14 42V7"/><path d="M14 8h19l-5 6 5 6H14"/>`,
  "product-positioner": `<circle cx="24" cy="24" r="13"/><circle cx="24" cy="24" r="7.5"/><circle cx="24" cy="24" r="2.4"/>`,
  "feature-prioritizer": `<path d="M8 15h32M8 24h32M8 33h32"/><circle cx="18" cy="15" r="3.4"/><circle cx="31" cy="24" r="3.4"/><circle cx="14" cy="33" r="3.4"/>`,
  "ideation-facilitator": `<path d="M24 6a12 12 0 0 0-7 21.6c1.4 1.1 2 2 2 3.4h10c0-1.4.6-2.3 2-3.4A12 12 0 0 0 24 6Z"/><path d="M19 37h10M21 41h6"/>`,
  "prd-author": `<path d="M14 6h14l8 8v28H14z"/><path d="M28 6v8h8"/><path d="M19 25h14M19 31h14M19 37h9"/>`,
  "information-architect": `<rect x="19" y="6" width="10" height="8" rx="1.5"/><rect x="7" y="32" width="10" height="8" rx="1.5"/><rect x="31" y="32" width="10" height="8" rx="1.5"/><path d="M24 14v9M12 32v-9h24v9"/>`,
  "lo-fi-designer": `<rect x="7" y="9" width="34" height="30" rx="2.5"/><path d="M7 17h34"/><rect x="11" y="22" width="11" height="13" rx="1.5"/><path d="M26 23h11M26 28h11M26 33h7"/>`,
  "figma-designer": `<rect x="10" y="14" width="22" height="22" rx="3"/><path d="M16 14v-3a3 3 0 0 1 3-3h16a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3h-3"/>`,
  "design-engineer": `<path d="M17 16 8 24l9 8M31 16l9 8-9 8M27 12l-6 24"/>`,
  "design-sync": `<path d="M11 18h21l-5-5M37 30H16l5 5"/>`,
  "usability-tester": `<path d="M10 8l9 26 4-10 10-4z"/><path d="M30 34l4 4 7-8"/>`,
  "accessibility-auditor": `<circle cx="24" cy="10" r="3.5"/><path d="M11 18h26"/><path d="M24 17v12M24 29l-6 12M24 29l6 12"/>`,
  "handoff-engineer": `<rect x="7" y="14" width="20" height="20" rx="2.5"/><path d="M27 24h14m0 0-5-5m5 5-5 5"/>`,
  "pm-launch-architect": `<path d="M24 6c6 4 9 11 9 19l-4 5H19l-4-5c0-8 3-15 9-19Z"/><circle cx="24" cy="20" r="3"/><path d="M19 30l-5 6 1 1 6-3M29 30l5 6-1 1-6-3"/>`,
  "critique-partner": `<path d="M9 10h30v20H24l-9 8v-8H9z"/><path d="M24 15v7"/><circle cx="24" cy="26" r="1.1"/>`,
  "pm-metrics-architect": `<rect x="9" y="26" width="6" height="13"/><rect x="21" y="15" width="6" height="24"/><rect x="33" y="20" width="6" height="19"/><path d="M6 41h36"/>`,
  "brand-decoder": `<circle cx="16" cy="18" r="8"/><path d="M21.5 23.5 38 40M31 33l4-4M35 37l4-4"/>`,
  "product-fingerprint-curator": `<path d="M24 13a16 16 0 0 1 13 7M16 31a10 10 0 0 1 16-8M19 34a7 7 0 0 1 11-6M22 37a4 4 0 0 1 6-3"/>`,
  "figma-component-bootstrapper": `<rect x="8" y="8" width="14" height="14" rx="2.5"/><rect x="26" y="8" width="14" height="14" rx="2.5"/><rect x="8" y="26" width="14" height="14" rx="2.5"/><rect x="26" y="26" width="14" height="14" rx="3" fill="currentColor" stroke="none"/>`,
};
const DEFAULT_ICON = `<circle cx="24" cy="24" r="13"/><path d="M24 17v14M17 24h14"/>`;

function svg(a, size){
  return `<svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">${ICONS[a.f] || DEFAULT_ICON}</svg>`;
}

// 8-bit pixel-art mascots (16x16 sprites in docs/_includes/mascots/). Not every
// agent has one yet (design-sync, accessibility-auditor) — those fall back to the line glyph.
const MASCOTS = resolve(ROOT, "..", "docs", "_includes", "mascots");
const _mcache = {};
function mascot(f){
  if (!(f in _mcache)) {
    const p = join(MASCOTS, `${f}.svg`);
    _mcache[f] = existsSync(p) ? readFileSync(p, "utf8") : null;
  }
  return _mcache[f];
}

const KEYWORDS = {
  orchestrator: ["Decompose","Sequence","Enforce gates"],
  "discovery-researcher": ["Synthesize","Frame","JTBD"],
  "competitive-analyst": ["Teardowns","Pattern audit","Gap map"],
  "pm-strategist": ["Vision","Pricing","Market scan"],
  "product-positioner": ["Positioning","Value prop","Naming"],
  "feature-prioritizer": ["RICE / ICE","MVP scope","Prune"],
  "ideation-facilitator": ["Diverge","How Might We","Crazy-8s"],
  "prd-author": ["One PRD each","JTBD","Manifest"],
  "information-architect": ["Object model","Navigation","Action priority"],
  "lo-fi-designer": ["Userflows","Wireframes","DS mapping"],
  "figma-designer": ["Hi-fi frames","DS instances","Key states"],
  "design-engineer": ["Real code","5 states","Runnable"],
  "design-sync": ["Mirror 1:1","Gap marks","Diff report"],
  "usability-tester": ["Test plans","Mode C","Real metrics"],
  "accessibility-auditor": ["WCAG 2.2 AA","axe-core","Measured"],
  "handoff-engineer": ["Specs","Design tokens","Edge cases"],
  "pm-launch-architect": ["GTM","Beachhead","Growth loops"],
  "critique-partner": ["Adversarial","Quality gate","Stress-test"],
  "pm-metrics-architect": ["North-star","OKRs","Tracking plan"],
  "brand-decoder": ["Worldview","Vocabulary","On / off-brand"],
  "product-fingerprint-curator": ["Visual signals","Patterns","Anti-patterns"],
  "figma-component-bootstrapper": ["~25 components","On demand","Manifest"],
};

// small icon vocabulary for the three capability tiles (viewBox 0 0 24 24, stroke currentColor)
const CAPICONS = {
  split:  `<path d="M6 4v6m0 0a4 4 0 0 0 4 4h8m0 0-4-4m4 4-4 4"/>`,
  list:   `<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>`,
  shield: `<path d="M12 3 5 6v5c0 4 3 7 7 8 4-1 7-4 7-8V6z"/>`,
  doc:    `<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 13h5M10 17h5"/>`,
  target: `<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.4"/>`,
  user:   `<circle cx="12" cy="8" r="3.4"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/>`,
  search: `<circle cx="11" cy="11" r="6"/><path d="M15.5 15.5 21 21"/>`,
  grid:   `<rect x="4" y="4" width="7" height="7" rx="1.4"/><rect x="13" y="4" width="7" height="7" rx="1.4"/><rect x="4" y="13" width="7" height="7" rx="1.4"/><rect x="13" y="13" width="7" height="7" rx="1.4"/>`,
  map:    `<circle cx="6" cy="6" r="2.3"/><circle cx="18" cy="10" r="2.3"/><circle cx="9" cy="18" r="2.3"/><path d="M8 7l8 2M16 12l-6 5"/>`,
  flag:   `<path d="M6 21V4M6 4h11l-2.5 4L17 12H6"/>`,
  tag:    `<path d="M4 12V5h7l8 8-7 7-8-8z"/><circle cx="8.5" cy="8.5" r="1.3"/>`,
  chart:  `<path d="M4 20V4M4 20h16"/><path d="M8 16l3.5-4.5 3 3 4-6"/>`,
  bulb:   `<path d="M12 3a6 6 0 0 0-4 10.5c.8.7 1 1.2 1 2.5h6c0-1.3.2-1.8 1-2.5A6 6 0 0 0 12 3Z"/><path d="M10 20h4"/>`,
  layers: `<path d="M12 3 3 8l9 5 9-5z"/><path d="M3 13l9 5 9-5"/>`,
  code:   `<path d="M9 8l-5 4 5 4M15 8l5 4-5 4"/>`,
  mirror: `<path d="M5 9h11l-3.5-3.5M19 15H8l3.5 3.5"/>`,
  check:  `<circle cx="12" cy="12" r="8"/><path d="M8.5 12.5l2.4 2.4 4.6-5"/>`,
  rocket: `<path d="M12 3c4 2 6 6 6 11l-3 3H9l-3-3c0-5 2-9 6-11Z"/><circle cx="12" cy="10" r="1.5"/><path d="M9 17l-3 4M15 17l3 4"/>`,
};
const KW_ICONS = {
  orchestrator: ["split","list","shield"],
  "discovery-researcher": ["doc","target","user"],
  "competitive-analyst": ["search","grid","map"],
  "pm-strategist": ["flag","tag","chart"],
  "product-positioner": ["target","tag","doc"],
  "feature-prioritizer": ["chart","target","check"],
  "ideation-facilitator": ["split","bulb","grid"],
  "prd-author": ["doc","user","list"],
  "information-architect": ["grid","map","list"],
  "lo-fi-designer": ["map","layers","grid"],
  "figma-designer": ["layers","grid","check"],
  "design-engineer": ["code","layers","check"],
  "design-sync": ["mirror","search","doc"],
  "usability-tester": ["doc","check","chart"],
  "accessibility-auditor": ["shield","check","chart"],
  "handoff-engineer": ["doc","grid","shield"],
  "pm-launch-architect": ["rocket","target","chart"],
  "critique-partner": ["shield","check","search"],
  "pm-metrics-architect": ["target","flag","chart"],
  "brand-decoder": ["bulb","doc","check"],
  "product-fingerprint-curator": ["target","grid","shield"],
  "figma-component-bootstrapper": ["grid","check","list"],
};
function capSvg(key){
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${CAPICONS[key] || CAPICONS.check}</svg>`;
}

const IO = {
  orchestrator: ["A multi-phase goal","A gated, sequenced plan"],
  "discovery-researcher": ["Raw data or a fuzzy problem","Evidence-based framing"],
  "competitive-analyst": ["A competitor set","Teardown + gap analysis"],
  "pm-strategist": ["A strategic question","A named strategic bet"],
  "product-positioner": ["A product or release","Positioning + value props"],
  "feature-prioritizer": ["A list of features","A ranked, cut backlog"],
  "ideation-facilitator": ["A well-framed problem","A wide set of concepts"],
  "prd-author": ["A prioritized backlog","PRDs + a manifest"],
  "information-architect": ["PRDs for the release","Cross-feature structure"],
  "lo-fi-designer": ["A concept + DS source","Wireframes + options"],
  "figma-designer": ["Lo-fi + PRD + DS","Hi-fi Figma screens"],
  "design-engineer": ["Approved lo-fi","A runnable prototype"],
  "design-sync": ["A Figma file + bridge","1:1 mirrored code"],
  "usability-tester": ["A prototype + goal","Findings + metrics"],
  "accessibility-auditor": ["A prototype or URL","Measured a11y findings"],
  "handoff-engineer": ["Final designs","A dev handoff package"],
  "pm-launch-architect": ["A ready feature","A launch + growth plan"],
  "critique-partner": ["Any agent's output","A stress-tested version"],
  "pm-metrics-architect": ["A feature being scoped","A measurement system"],
  "brand-decoder": ["An existing brand","A decoded brand concept"],
  "product-fingerprint-curator": ["3–7 Figma frames","A visual fingerprint"],
  "figma-component-bootstrapper": ["A fingerprint","A component library"],
};

const AGENTS = [
  { f:"orchestrator", name:"orchestrator", phase:"meta", model:"opus",
    tagline:"Decomposes the goal, sequences the agents, enforces the gates.",
    hook:"One prompt in. A phased plan with the right agents — out." },
  { f:"discovery-researcher", name:"discovery-researcher", phase:"discovery", model:"sonnet",
    tagline:"Turns raw data and interviews into framed problems.",
    hook:"Stop solutioning a problem you haven't framed yet." },
  { f:"competitive-analyst", name:"competitive-analyst", phase:"discovery", model:"sonnet",
    tagline:"Teardowns, pattern audits, and feature-gap maps.",
    hook:"Know how everyone else solved it — before you reinvent it." },
  { f:"pm-strategist", name:"pm-strategist", phase:"define", model:"sonnet",
    tagline:"Vision, business model, pricing, north-star.",
    hook:"Answer 'what game are we playing?' before 'what do we build?'" },
  { f:"product-positioner", name:"product-positioner", phase:"define", model:"sonnet",
    tagline:"Sharpens what it IS and ISN'T.",
    hook:"If it's for everyone, it's positioned for no one." },
  { f:"feature-prioritizer", name:"feature-prioritizer", phase:"define", model:"sonnet",
    tagline:"What to build, in what order, and what to cut.",
    hook:"Not everything is a P0. This agent proves it." },
  { f:"ideation-facilitator", name:"ideation-facilitator", phase:"define", model:"sonnet",
    tagline:"Diverge before you converge.",
    hook:"The first idea is never the best one. Generate 20." },
  { f:"prd-author", name:"prd-author", phase:"define", model:"sonnet",
    tagline:"One PRD per shipped sub-feature.",
    hook:"Prioritized backlog in. A clean PRD for each one out." },
  { f:"information-architect", name:"information-architect", phase:"define", model:"sonnet",
    tagline:"Maps the product's bones before anyone sketches.",
    hook:"Every screen is fine, but the product feels messy. Here's why." },
  { f:"lo-fi-designer", name:"lo-fi-designer", phase:"define", model:"sonnet",
    tagline:"Three layouts before falling in love with one.",
    hook:"Sketch three layouts before you fall in love with one." },
  { f:"figma-designer", name:"figma-designer", phase:"deliver", model:"sonnet",
    tagline:"Lo-fi boxes become real Figma screens.",
    hook:"Turn grey boxes into screens the team can actually ship." },
  { f:"design-engineer", name:"design-engineer", phase:"deliver", model:"sonnet",
    tagline:"A real prototype in your real stack.",
    hook:"Not a mockup. A prototype that actually runs." },
  { f:"design-sync", name:"design-sync", phase:"deliver", model:"sonnet",
    tagline:"Mirrors Figma to code 1:1. Invents nothing.",
    hook:"Copies what's mapped. Marks what's not. Invents nothing." },
  { f:"usability-tester", name:"usability-tester", phase:"deliver", model:"sonnet",
    tagline:"Tests designed to falsify, not flatter.",
    hook:"Run a usability test where the AI is the user." },
  { f:"accessibility-auditor", name:"accessibility-auditor", phase:"deliver", model:"sonnet",
    tagline:"Measures a11y with axe-core. Never guesses.",
    hook:"An axe-core reading beats an opinion every time." },
  { f:"handoff-engineer", name:"handoff-engineer", phase:"deliver", model:"sonnet",
    tagline:"Everything dev actually needs.",
    hook:"The gap between 'looks done' and 'is buildable' — closed." },
  { f:"pm-launch-architect", name:"pm-launch-architect", phase:"deliver", model:"sonnet",
    tagline:"From 'designed' to 'in market and growing'.",
    hook:"Name the beachhead, not the dream." },
  { f:"critique-partner", name:"critique-partner", phase:"cross-cutting", model:"opus",
    tagline:"Stress-tests any agent's output.",
    hook:"When it looks too clean, this is the agent that breaks it." },
  { f:"pm-metrics-architect", name:"pm-metrics-architect", phase:"cross-cutting", model:"sonnet",
    tagline:"One number to chase, three to watch, one to fear.",
    hook:"'We don't know if this is working.' Fix that before you ship." },
  { f:"brand-decoder", name:"brand-decoder", phase:"cross-cutting", model:"sonnet",
    tagline:"Decodes how a brand actually thinks.",
    hook:"Design aligned with how they actually think about their brand." },
  { f:"product-fingerprint-curator", name:"product-fingerprint-curator", phase:"cross-cutting", model:"sonnet",
    tagline:"Captures the product's real visual language.",
    hook:"Make new work feel native — not bolted on." },
  { f:"figma-component-bootstrapper", name:"figma-component-bootstrapper", phase:"cross-cutting", model:"sonnet",
    tagline:"Gives every project a real component library.",
    hook:"No component library? Build one without hand-building one." },
];

function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}

function cardHTML(a, idx){
  const ph = PHASES[a.phase];
  const c = ph.color;
  const c2 = ph.c2;
  const grad = `linear-gradient(135deg, ${c} 0%, ${c2} 100%)`;
  const num = String(idx+1).padStart(2,"0");
  const kw = KEYWORDS[a.f] || ["","",""];
  const kic = KW_ICONS[a.f] || [];
  const [needs, makes] = IO[a.f] || ["",""];

  const chev = `<span class="fa">›</span>`;
  const lc = [["discovery","Discovery"],["define","Define"],["deliver","Deliver"]];
  let flow;
  if (a.phase === "meta") flow = lc.map(([,l])=>`<span class="fc on">${l}</span>`).join(chev);
  else if (a.phase === "cross-cutting") flow = `<span class="fc on">Runs across every phase</span>`;
  else flow = lc.map(([k,l])=>`<span class="fc ${k===a.phase?"on":"off"}">${l}</span>`).join(chev);

  const keyTile = (i) => `<div class="key k${i+1}"><span class="kic">${capSvg(kic[i])}</span><span class="kt">${esc(kw[i]||"")}</span></div>`;

  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:${FONT};-webkit-font-smoothing:antialiased;color:${INK};
    width:${W}px;height:${H}px;padding:56px;display:flex;flex-direction:column;gap:18px;
    background:
      radial-gradient(1100px 720px at 84% -10%, ${c}24, transparent 56%),
      radial-gradient(820px 620px at -12% 112%, ${c}16, transparent 52%),
      linear-gradient(168deg,#fbfbfe 0%,#eceef3 100%)}
  .head{display:flex;justify-content:space-between;align-items:center;padding:0 6px}
  .kick{font-size:21px;font-weight:600;letter-spacing:.16em;color:${MUTED}}
  .idx{font-size:21px;font-weight:600;color:${MUTED}}
  .idx b{color:${c}}
  .grid{flex:1;display:grid;grid-template-columns:repeat(6,1fr);
    grid-template-rows:repeat(2,1.08fr) .92fr .82fr .58fr .92fr;
    grid-template-areas:
      "hero hero hero hero icon icon"
      "hero hero hero hero icon icon"
      "keya keya keyb keyb keyc keyc"
      "need need need prod prod prod"
      "flow flow flow flow flow flow"
      "hook hook hook hook hook hook";
    gap:16px}
  .hero,.key,.io,.flow{box-shadow:0 14px 36px -16px rgba(26,26,42,.22),0 2px 8px -2px rgba(26,26,42,.05)}
  .hero{grid-area:hero;color:#fff;border-radius:30px;padding:38px 40px;display:flex;flex-direction:column;justify-content:space-between;
    background:radial-gradient(360px 300px at 92% 4%, ${c}5c, transparent 60%),linear-gradient(155deg,#27272c 0%,#151517 100%);
    border:1px solid #ffffff14;box-shadow:0 22px 50px -20px rgba(10,10,20,.5)}
  .hrow{display:flex;gap:10px}
  .pp{font-size:16px;font-weight:700;letter-spacing:.1em;color:#fff;background:${grad};padding:7px 15px;border-radius:999px}
  .mc{font-size:16px;font-weight:600;letter-spacing:.03em;color:#d2d2d6;background:#ffffff1c;padding:7px 15px;border-radius:999px}
  .nm{font-size:46px;font-weight:600;letter-spacing:-1.4px;line-height:1.03;word-break:break-word}
  .tg{margin-top:14px;font-size:23px;font-weight:400;color:#c7c7cb;line-height:1.3;letter-spacing:-.2px}
  .icon{grid-area:icon;border-radius:30px;display:flex;align-items:center;justify-content:center;color:${c};
    background:radial-gradient(circle at 50% 40%, #ffffff 0%, ${c}1a 84%);
    box-shadow:0 16px 40px -16px ${c}5c,inset 0 0 0 1.5px ${c}26}
  .icon svg{width:180px;height:180px;image-rendering:pixelated;filter:drop-shadow(0 9px 10px rgba(0,0,0,.22))}
  .key{border-radius:24px;padding:24px 26px;display:flex;flex-direction:column;justify-content:center;
    background:linear-gradient(180deg,#ffffff 0%,#f6f7fb 100%)}
  .k1{grid-area:keya}.k2{grid-area:keyb}.k3{grid-area:keyc}
  .kic{width:58px;height:58px;border-radius:17px;background:${grad};color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 18px -6px ${c}80}
  .kic svg{width:32px;height:32px}
  .kt{font-size:25px;font-weight:600;letter-spacing:-.4px;line-height:1.1;margin-top:16px}
  .io{border-radius:24px;padding:24px 28px;display:flex;flex-direction:column;justify-content:center}
  .need{grid-area:need;background:linear-gradient(180deg,#ffffff,#f6f7fb)}
  .prod{grid-area:prod;background:linear-gradient(150deg,${c}24,${c}0f);box-shadow:inset 0 0 0 1px ${c}26}
  .iol{font-size:15px;font-weight:700;letter-spacing:.12em;color:${MUTED}}
  .prod .iol{color:${c}}
  .iov{font-size:24px;font-weight:600;letter-spacing:-.35px;line-height:1.18;margin-top:9px;color:${INK}}
  .flow{grid-area:flow;background:linear-gradient(180deg,#ffffff,#f6f7fb);border-radius:24px;padding:0 30px;display:flex;align-items:center;gap:13px}
  .fc{font-size:21px;font-weight:600;letter-spacing:-.2px;padding:10px 20px;border-radius:999px}
  .fc.on{background:${grad};color:#fff;box-shadow:0 8px 18px -6px ${c}80}
  .fc.off{background:#ececef;color:#a0a0a6}
  .fa{color:#c4c4c9;font-weight:700;font-size:22px}
  .hook{grid-area:hook;color:#fff;border-radius:28px;padding:0 42px;display:flex;align-items:center;font-size:31px;font-weight:600;letter-spacing:-.5px;line-height:1.22;
    background:radial-gradient(520px 320px at 10% -10%, #ffffff33, transparent 56%),${grad};
    box-shadow:0 24px 52px -18px ${c}b3,inset 0 1px 0 #ffffff33}
  </style></head><body>
    <div class="head"><span class="kick">AGENT&nbsp;HARRY</span><span class="idx"><b>${num}</b> / 22</span></div>
    <div class="grid">
      <div class="hero">
        <div class="hrow"><span class="pp">${ph.label}</span><span class="mc">model · ${a.model}</span></div>
        <div><div class="nm">${esc(a.name)}</div><div class="tg">${esc(a.tagline)}</div></div>
      </div>
      <div class="icon">${mascot(a.f) || svg(a,104)}</div>
      ${keyTile(0)}${keyTile(1)}${keyTile(2)}
      <div class="io need"><span class="iol">NEEDS</span><span class="iov">${esc(needs)}</span></div>
      <div class="io prod"><span class="iol">PRODUCES</span><span class="iov">${esc(makes)}</span></div>
      <div class="flow">${flow}</div>
      <div class="hook">${esc(a.hook)}</div>
    </div>
  </body></html>`;
}

function overviewHTML(){
  const HH = 1500;
  const phaseCol = (key, title, sub) => {
    const ph = PHASES[key];
    const chips = AGENTS.filter(a=>a.phase===key).map(a=>
      `<div class="chip" style="color:${ph.color}"><span class="cdot" style="background:${ph.color}"></span>${esc(a.name)}</div>`).join("");
    return `<div class="col"><div class="ct" style="color:${ph.color}">${title}</div><div class="cs">${sub}</div>${chips}</div>`;
  };
  const cross = AGENTS.filter(a=>a.phase==="cross-cutting").map(a=>a.name).concat(["critique-partner"]);
  const cc = PHASES["cross-cutting"].color;
  const crossChips = cross.map(n=>`<div class="chip cc"><span class="cdot" style="background:${cc}"></span>${esc(n)}</div>`).join("");
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:${FONT};-webkit-font-smoothing:antialiased;color:${INK};
    width:${W}px;height:${HH}px;padding:56px;display:flex;flex-direction:column;gap:18px;
    background:
      radial-gradient(900px 600px at 88% -8%, #5e5ce61f, transparent 55%),
      radial-gradient(800px 560px at -10% 108%, #0c8c7a1a, transparent 52%),
      linear-gradient(168deg,#fbfbfe 0%,#eceef3 100%)}
  .tile{background:linear-gradient(180deg,#ffffff,#f6f7fb);border-radius:28px;box-shadow:0 14px 36px -16px rgba(26,26,42,.20),0 2px 8px -2px rgba(26,26,42,.05)}
  .head{display:flex;justify-content:space-between;align-items:center;padding:0 6px}
  .kick{font-size:21px;font-weight:600;letter-spacing:.16em;color:${MUTED}}
  .pill{font-size:19px;font-weight:600;letter-spacing:.09em;padding:9px 20px;border-radius:999px;color:${INK};background:#e6e6ea}
  .hero{color:#fff;border-radius:34px;padding:48px;
    background:radial-gradient(420px 340px at 92% 2%, #5e5ce666, transparent 60%),linear-gradient(155deg,#27272c,#151517);
    border:1px solid #ffffff14;box-shadow:0 24px 54px -22px rgba(10,10,20,.5)}
  .hero h1{font-size:60px;font-weight:600;letter-spacing:-2.2px;line-height:1.03}
  .hero p{margin-top:18px;font-size:26px;font-weight:400;color:#c7c7cb;line-height:1.34;letter-spacing:-.2px;max-width:830px}
  .meta{color:#fff;border-radius:24px;padding:26px 34px;font-size:24px;font-weight:500;letter-spacing:-.2px;line-height:1.3;
    background:radial-gradient(400px 200px at 6% -40%, #ffffff2e, transparent 55%),linear-gradient(135deg,${PHASES.meta.color},${PHASES.meta.c2});
    box-shadow:0 18px 40px -16px ${PHASES.meta.color}80}
  .meta b{font-weight:700}
  .row{display:flex;gap:16px;align-items:stretch}
  .col{flex:1;background:linear-gradient(180deg,#ffffff,#f6f7fb);border-radius:28px;padding:30px 26px;display:flex;flex-direction:column;gap:13px;
    box-shadow:0 14px 36px -16px rgba(26,26,42,.20),0 2px 8px -2px rgba(26,26,42,.05)}
  .ct{font-size:31px;font-weight:600;letter-spacing:-.5px}
  .cs{font-size:19px;color:${MUTED};margin-bottom:8px;letter-spacing:-.2px}
  .chip{display:flex;align-items:center;gap:11px;font-size:21px;font-weight:600;letter-spacing:-.3px}
  .cdot{flex:none;width:11px;height:11px;border-radius:4px}
  .gates{display:flex;gap:16px}
  .gate{flex:1;padding:26px 30px}
  .gt{font-size:15px;font-weight:600;letter-spacing:.12em;color:${cc};margin-bottom:9px}
  .gv{font-size:22px;font-weight:600;letter-spacing:-.3px;line-height:1.28;color:${INK}}
  .cross{padding:28px 32px}
  .cl{font-size:17px;font-weight:600;letter-spacing:.13em;color:${cc};margin-bottom:16px}
  .crow{display:flex;flex-wrap:wrap;gap:11px}
  .chip.cc{color:${cc}}
  .foot{display:flex;justify-content:space-between;align-items:center;padding:0 6px;font-size:19px;font-weight:500;color:${MUTED}}
  .foot b{color:${INK};font-weight:600}
  </style></head><body>
    <div class="head"><span class="kick">AGENT&nbsp;HARRY</span><span class="pill">22 AGENTS</span></div>
    <div class="hero"><h1>The 22-Agent Product Design Team</h1><p>One designer, one prompt — specialist agents running Discovery → Define → Deliver, end to end.</p></div>
    <div class="meta"><b>orchestrator</b> — decomposes the goal, sequences the agents, enforces the gates.</div>
    <div class="row">
      ${phaseCol("discovery","Discovery","Understand the problem")}
      ${phaseCol("define","Define","Decide what to build")}
      ${phaseCol("deliver","Deliver","Make it real")}
    </div>
    <div class="gates">
      <div class="tile gate"><div class="gt">RESEARCH-FIRST GATE</div><div class="gv">No Deliver work until real Discovery &amp; Define exist.</div></div>
      <div class="tile gate"><div class="gt">SUCCESS-METRICS GATE</div><div class="gv">No Deliver until success is defined and measured.</div></div>
    </div>
    <div class="tile cross"><div class="cl">CROSS-CUTTING — RUN ANY TIME</div><div class="crow">${crossChips}</div></div>
    <div class="foot"><span>Discovery · Define · Deliver · for Claude Code</span><span><b>22</b> agents</span></div>
  </body></html>`;
}

async function findChrome(){
  const base = join(homedir(), ".cache/puppeteer/chrome-headless-shell");
  if(existsSync(base)){
    for(const v of await readdir(base)){
      const p = join(base, v, "chrome-headless-shell-mac-arm64", "chrome-headless-shell");
      if(existsSync(p)) return p;
    }
  }
  const cb = join(homedir(), ".cache/puppeteer/chrome");
  if(existsSync(cb)){
    for(const v of await readdir(cb)){
      const p = join(cb, v, "chrome-mac-arm64", "Google Chrome for Testing.app", "Contents/MacOS/Google Chrome for Testing");
      if(existsSync(p)) return p;
    }
  }
  throw new Error("No chrome-headless-shell found in ~/.cache/puppeteer");
}

function render(chrome, htmlPath, pngPath, w, h){
  execFileSync(chrome, [
    "--headless","--disable-gpu","--hide-scrollbars","--no-sandbox",
    "--default-background-color=00000000",
    `--force-device-scale-factor=${SCALE}`,
    `--window-size=${w},${h}`,
    `--screenshot=${pngPath}`,
    htmlPath,
  ], { stdio:"ignore" });
}

async function main(){
  await mkdir(OUT,{recursive:true});
  await mkdir(TMP,{recursive:true});
  const chrome = await findChrome();
  console.log(`chrome: ${chrome}\n`);

  const oh = join(TMP,"00-overview.html");
  await writeFile(oh, overviewHTML(),"utf8");
  render(chrome, oh, join(OUT,"00-overview.png"), W, 1500);
  console.log("  00-overview.png ✓");

  let i=0;
  for(const a of AGENTS){
    const hp = join(TMP, `${a.f}.html`);
    await writeFile(hp, cardHTML(a,i),"utf8");
    render(chrome, hp, join(OUT, `${a.f}.png`), W, H);
    console.log(`  ${a.f}.png ✓`);
    i++;
  }
  console.log(`\nDone. ${AGENTS.length+1} infographics -> content/infographics/`);
}

main().catch(e=>{console.error(e);process.exit(1);});
