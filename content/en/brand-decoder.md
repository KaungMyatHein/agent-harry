# Brand Decoder

`brand-decoder` · **Phase:** cross-cutting · **Model:** sonnet · **Decision authority:** propose

### Hooks
- **Hook A —** Most "off-brand" work isn't ugly — it just misread how the brand thinks about itself. By then it's already in review.
- **Hook B —** Decode an existing brand's worldview, vocabulary, and on/off-brand tells *before* you draw a single screen — so your work lands native from the first pass.
- **Hook C —** Every established brand has a mental model it never wrote down. What happens when you read it back to them in their own words?

## TL;DR
The brand-decoder reads how a company *already* thinks about itself instead of stamping a generic framework on top. When you're designing inside an existing brand — client work, a design test, an established product — it decodes the brand's concept, worldview, mental model, vocabulary, and tells, and writes it all into `brand-concept.md` before any positioning, ideation, IA, or visual work begins.

## What it does
The brand-decoder is a brand *interpreter*, not a brand *imposer*. It studies the brand's existing language and behavior and surfaces the model the brand is already running — even the parts the team never made explicit.

It produces `brand-concept.md`, a project-level artifact that captures:
- **Concept and worldview** — what the brand believes it is and how it sees its space.
- **Mental model** — how the brand frames its product and its users.
- **Vocabulary** — the words the brand uses (and the ones it avoids).
- **On/off-brand tells** — the specific signals that read as "us" versus "not us".

It exists to fill a real gap in the roster. `product-fingerprint-curator` captures how the product *looks*. `product-positioner` *creates* outward positioning. Neither one decodes what an existing brand already *means*. The brand-decoder does exactly that, so downstream work builds on the brand's real self-concept instead of a guess.

## When to reach for it
- You're doing client work or a design test inside a brand you don't own.
- The product is established and you must design within its existing identity.
- You're about to start positioning, ideation, IA, or visual work and want to ground it in how the brand actually thinks.

## Inputs → Outputs
| It needs | It produces |
|---|---|
| An existing brand to design within — its product, language, and existing materials | `brand-concept.md` — the brand's concept, worldview, mental model, vocabulary, and on/off-brand tells |

## Where it sits in the pipeline
The brand-decoder runs early and cross-cutting, before positioning, ideation, information architecture, and visual work. Its `brand-concept.md` becomes a reference the later phases read so their output stays native to the brand rather than fighting it.

## Try it
```
"Use the brand-decoder agent to decode this product's brand into a brand-concept.md before we start positioning."
```
