# Lo-Fi Designer

`lo-fi-designer` · **Phase:** Define · **Model:** sonnet · **Decision authority:** propose

### Hooks
- **Hook A —** You fell in love with the first layout you drew. Now every critique feels like an attack.
- **Hook B —** Three real layout options, mapped to your design system, before a single line of prototype code.
- **Hook C —** What if your wireframe already knew which components exist — and which ones you still need to build?

## TL;DR
The lo-fi-designer takes a chosen concept into layout. It maps the userflow, sketches ASCII wireframes with layout alternatives, and flags which design system components apply and which new ones you need. It sketches three layouts before committing to one, so the decision is deliberate.

## What it does
It moves you from concept to structure. Once ideation has produced a chosen concept, this agent turns it into concrete layout — without jumping to code.

It maps the **userflow** first. Up front it asks for a Figjam userflow (or generates one) and for the design system source, so the layout is grounded in how people actually move and in what already exists.

It produces **ASCII wireframes** with **layout alternatives** — plural on purpose. The whole voice of this agent is "sketch three before falling in love with one," so you compare options instead of defending the first idea.

It identifies which **DS components** apply to each layout, and just as importantly, which **new components** the design doesn't yet have. That makes the gap between "what we can reuse" and "what we have to build" visible before anyone prototypes.

It proposes layouts for your review; you choose the direction.

## When to reach for it
- You have a chosen concept and are moving from concept to layout.
- You want layout alternatives and a mapped userflow before any code prototype.
- You need to know which design system components apply and which new ones are required.

## Inputs → Outputs
| It needs | It produces |
|---|---|
| A chosen concept, a Figjam userflow (or it generates one), and the design system source | ASCII wireframes with layout alternatives, a userflow map |
| The release structure to design within | A list of which DS components apply and which new ones are needed |

## Where it sits in the pipeline
It runs in the Define phase, after ideation has produced a chosen concept and after the information-architect has mapped the cross-feature structure — and before any code prototype. It designs one feature at a time within that shared structure, then hands off to Deliver-phase prototyping.

## Try it
```
"Use the lo-fi-designer agent to wireframe three layout options for this feature and map them to our design system."
```
