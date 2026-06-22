#!/usr/bin/env node
// Translate content/en/*.md -> content/my/*.md using the Gemini API.
//
// Usage:
//   node content/scripts/translate.mjs                   # translate every .md in en/
//   node content/scripts/translate.mjs orchestrator.md   # one file only
//
// The key is read from content/.env (GEMINI_API_KEY). .env is gitignored —
// never hard-code the key here and never commit it.

import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, ".."); // content/

// Each [source, destination] pair gets mirrored en -> my.
// Only the Facebook posts need Burmese — the explainer pages stay English-only.
const PAIRS = [
  [join(ROOT, "posts", "en"), join(ROOT, "posts", "my")], // short Facebook captions
];

const SYSTEM = `You are a professional English->Burmese (Myanmar) translator for product-design and software documentation.

Translate the prose into natural, clear Burmese. Follow these rules EXACTLY:
1. Keep the Markdown structure identical: headings (#), lists, tables, bold/italic, blockquotes, links.
2. Do NOT translate anything inside code blocks (\`\`\` ... \`\`\`) or inline code (\`...\`). Leave them byte-for-byte.
3. Do NOT translate these proper nouns / product terms — keep them in English exactly as written:
   Agent Harry, orchestrator, critique-partner, Stop Gate, Research-First Gate, Success-Metrics Gate,
   Discovery, Define, Deliver, Figma, Playwright, axe-core, WCAG, PRD, RICE, ICE, Kano, JTBD, GTM,
   north-star, MVP, OKR, ARIA, MCP, Notion, and any agent name written in lowercase-with-hyphens.
4. Keep all agent names (e.g. discovery-researcher, lo-fi-designer) in English.
5. Translate the "Hook" lines into punchy, scroll-stopping Burmese — natural marketing voice, not literal.
6. Translate the ✦ section labels into casual, friendly Burmese (NOT formal):
   "What it is" → "✦ ဒါက ဘာလဲ"
   "When to use it" → "✦ ဘယ်အချိန် သုံးရမလဲ"
   "Why use it" → "✦ ဘာလို့ သုံးသင့်တာလဲ"
   "How to use it" → "✦ ဘယ်လို သုံးရမလဲ"
   "Benefits" → "✦ ဘာတွေ ကောင်းလဲ"
   And "Just tell Agent Harry:" → "Agent Harry ကို ဒီလိုပဲ ပြောလိုက်ရုံ —"

FRIENDLY VIBE — write like you're texting/explaining this to a close friend, NOT like a manual or a machine. PUSH IT CASUAL:
7. Tone = a design-savvy buddy hyping a cool tool in a chatty Facebook caption. Relaxed, warm, fun, a little hype. Think spoken Burmese the way friends actually talk — informal is GOOD here, don't hold back into politeness.
8. Lean hard on casual particles, spoken slang and rhythm — "...လေ", "...တာပေါ့", "...တယ်နော်", "...ဆိုတော့", "...ကွာ", "အဲ့ဒါ", "ဒီလိုလေ", "တကယ်လို့", "ဟုတ်တယ်လေ", "သိလားဟ", rhetorical questions ("...ဖြစ်ဖူးတယ်မလား?"). Talk straight to "မင်း" like a real buddy.
8a. Keep sentences SHORT and snappy — like chat messages, not paragraphs. Break long ideas into a few quick punchy lines. It's totally fine to sound informal and a bit playful.
9. Translate the MEANING, not the words. Never go word-for-word. Re-say each idea the way a Burmese friend would actually say it out loud. If a literal version sounds stiff or "official", rewrite it looser.
10. Kill robotic AI tells: do NOT end sentences with "ဖြစ်ပါသည်"; go easy on "ဖြစ်ပါတယ်"; don't overuse "ထို့အပြင်/သို့သော်လည်း/ယင်း"; don't start clause after clause with the same connector. Vary sentence length — short punchy lines mixed with longer ones.
11. Localize the hooks and jokes — recreate the PUNCH and warmth in Burmese, don't translate the English image literally. It should sound like a Burmese person wrote it from scratch.
12. Read it back in your head: if a Burmese reader would feel "ဒါ AI/Google Translate ပြန်ထားတာ" or "တရားဝင်လွန်းတယ်", rewrite it warmer and more casual until it sounds like a real friend talking.
13. Output ONLY the translated Markdown. No preamble, no explanation, no fences around the whole thing.`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function translate(markdown, model, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const backoff = [3000, 8000, 20000, 45000]; // retry waits for 429 / 5xx
  let lastErr;
  for (let attempt = 0; attempt <= backoff.length; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents: [{ parts: [{ text: markdown }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
      if (!text.trim()) throw new Error("Empty translation returned");
      return text;
    }
    const body = await res.text();
    lastErr = new Error(`Gemini ${res.status}: ${body.slice(0, 200)}`);
    // retry only on rate-limit / transient server errors
    if ((res.status === 429 || res.status >= 500) && attempt < backoff.length) {
      process.stdout.write(`(429/5xx, retry in ${backoff[attempt] / 1000}s) `);
      await sleep(backoff[attempt]);
      continue;
    }
    throw lastErr;
  }
  throw lastErr;
}

async function main() {
  const envPath = join(ROOT, ".env");
  if (existsSync(envPath)) {
    const raw = await readFile(envPath, "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  if (!apiKey || apiKey === "your-key-here") {
    console.error("✗ GEMINI_API_KEY not set. Copy content/.env.example -> content/.env and paste your key.");
    process.exit(1);
  }

  const only = process.argv[2]; // optional single filename, applied to every pair
  let ok = 0, total = 0;

  for (const [enDir, myDir] of PAIRS) {
    if (!existsSync(enDir)) continue;
    await mkdir(myDir, { recursive: true });
    const files = only ? [only] : (await readdir(enDir)).filter((f) => f.endsWith(".md")).sort();
    if (!files.length) continue;
    console.log(`\n${enDir} -> ${myDir} (${model})`);
    for (const f of files) {
      const src = join(enDir, f);
      if (!existsSync(src)) continue;
      // resume: skip files already translated (set SKIP_EXISTING=1 to enable)
      if (process.env.SKIP_EXISTING && existsSync(join(myDir, f))) {
        console.log(`  ${f} ... (skip, exists)`);
        continue;
      }
      total++;
      try {
        const md = await readFile(src, "utf8");
        process.stdout.write(`  ${f} ... `);
        const out = await translate(md, model, apiKey);
        await writeFile(join(myDir, f), out, "utf8");
        console.log("✓");
        ok++;
      } catch (e) {
        console.log(`✗ ${e.message}`);
      }
      await sleep(Number(process.env.DELAY_MS) || 5000); // pacing under the free-tier RPM ceiling
    }
  }
  console.log(`\nDone. ${ok}/${total} translated.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
