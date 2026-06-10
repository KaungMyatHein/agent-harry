#!/usr/bin/env python3
"""Generate a side-by-side workflow comparison: Vibe Design vs Agentic Design (Agent Harry)."""
from PIL import Image, ImageDraw, ImageFont

FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONTB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

def f(size, bold=False):
    return ImageFont.truetype(FONTB if bold else FONT, size)

# ---- palette
BG      = (247, 248, 250)
INK     = (28, 32, 38)
MUTE    = (110, 118, 128)
DIVIDER = (210, 214, 220)
# vibe (left) — warm/amber, "loose"
V_HEAD  = (180, 83, 9)
V_BOX   = (255, 247, 237)
V_EDGE  = (234, 142, 52)
V_ARROW = (210, 120, 40)
# harry (right) — indigo, "structured"
H_HEAD  = (67, 56, 202)
H_BOX   = (238, 242, 255)
H_EDGE  = (120, 110, 230)
H_ARROW = (79, 70, 200)
GATE    = (16, 122, 92)
GOLD    = (190, 140, 20)

W, H = 1720, 1360
img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

def center(draw, cx, y, text, font, fill):
    w = draw.textlength(text, font=font)
    draw.text((cx - w / 2, y), text, font=font, fill=fill)

def box(cx, y, w, h, label, sub, boxc, edge, headc, r=16):
    x0, y0, x1, y1 = cx - w/2, y, cx + w/2, y + h
    d.rounded_rectangle([x0, y0, x1, y1], radius=r, fill=boxc, outline=edge, width=3)
    if sub:
        center(d, cx, y + h/2 - 22, label, f(23, True), headc)
        center(d, cx, y + h/2 + 6, sub, f(16), MUTE)
    else:
        center(d, cx, y + h/2 - 13, label, f(23, True), headc)
    return y1

def varrow(cx, y0, y1, color, label=None, gate=False):
    d.line([(cx, y0), (cx, y1 - 12)], fill=color, width=4)
    d.polygon([(cx-9, y1-13), (cx+9, y1-13), (cx, y1)], fill=color)
    if gate:
        my = (y0 + y1) / 2
        s = 11
        d.polygon([(cx, my-s), (cx+s, my), (cx, my+s), (cx-s, my)], fill=GATE, outline=(255,255,255))
        d.text((cx + s + 8, my - 11), "Stop Gate", font=f(15, True), fill=GATE)
    if label:
        d.text((cx + 16, (y0+y1)/2 - 10), label, font=f(15), fill=MUTE)

# ---- title
center(d, W/2, 30, "Vibe Design  vs  Agentic Design", f(40, True), INK)
center(d, W/2, 82, "two ways to produce a design — the difference is the workflow, not the output", f(19), MUTE)
d.line([(W/2, 140), (W/2, H-70)], fill=DIVIDER, width=2)

LX, RX = 430, 1270
top = 168

# ================= LEFT : VIBE DESIGN =================
d.rounded_rectangle([LX-330, top, LX+330, top+78], radius=14, fill=V_HEAD)
center(d, LX, top+12, "VIBE  DESIGN", f(28, True), (255,255,255))
center(d, LX, top+48, "Stitch · Figma Make · Figma Agent · one-shot Claude", f(15), (255, 235, 215))

y = top + 120
bw, bh = 360, 78
y = box(LX, y, bw, bh, "User", "holds all context in their head", V_BOX, V_EDGE, V_HEAD)
varrow(LX, y, y+78, V_ARROW, "context as INPUT — re-typed every prompt")
y += 78
py = y                                   # remember Prompt box top for loop-back
y = box(LX, y, bw, bh, "Prompt", "the only place context lives", V_BOX, V_EDGE, V_HEAD)
varrow(LX, y, y+62, V_ARROW)
y += 62
y = box(LX, y, bw, bh-12, "Generate", "", V_BOX, V_EDGE, V_HEAD)
varrow(LX, y, y+62, V_ARROW)
y += 62
y = box(LX, y, bw, bh, "Screen", "output — in their sandbox", V_BOX, V_EDGE, V_HEAD)

# loop-back arrow: Screen (right edge) -> right -> up -> Prompt (right edge)
lbx = LX + bw/2 + 50
d.line([(LX + bw/2, y - bh/2), (lbx, y - bh/2)], fill=V_ARROW, width=4)
d.line([(lbx, y - bh/2), (lbx, py + bh/2)], fill=V_ARROW, width=4)
d.line([(lbx, py + bh/2), (LX + bw/2 + 1, py + bh/2)], fill=V_ARROW, width=4)
d.polygon([(LX + bw/2 + 13, py + bh/2 - 9), (LX + bw/2 + 13, py + bh/2 + 9), (LX + bw/2, py + bh/2)], fill=V_ARROW)
d.text((lbx + 14, (py+y)/2 - 24), "feel: “not quite”", font=f(16, True), fill=V_ARROW)
d.text((lbx + 14, (py+y)/2 + 0), "→ re-prompt", font=f(16, True), fill=V_ARROW)

# footer tag
ty = y + 60
d.rounded_rectangle([LX-330, ty, LX+330, ty+86], radius=12, fill=(255,243,232), outline=V_EDGE, width=2)
center(d, LX, ty+12, "Context  =  STATELESS user input", f(19, True), V_HEAD)
center(d, LX, ty+44, "lives in the prompt · not persisted · no decision trail", f(15), MUTE)

# ================= RIGHT : AGENT HARRY =================
d.rounded_rectangle([RX-330, top, RX+330, top+78], radius=14, fill=H_HEAD)
center(d, RX, top+12, "AGENTIC  DESIGN  —  Agent Harry", f(24, True), (255,255,255))
center(d, RX, top+48, "discovery → define → deliver → handoff", f(15), (222, 225, 255))

stages = [
    ("User seed", "feature idea — provided once", False),
    ("Discovery research", "→ research artifact", True),
    ("PRD · persona · journey", "→ definition artifacts", True),
    ("Lo-fi — 3 layouts", "Primary / Alternative / Risky", True),
    ("Deliver", "design-engineer (in YOUR repo) · figma-designer", True),
    ("Usability test plan", "falsifiable, severity-scored", True),
    ("Handoff spec", "component contracts · a11y · edge cases", True),
]
y = top + 120
rbw, rbh = 430, 66
node_tops = []
for i, (label, sub, gated) in enumerate(stages):
    if i > 0:
        varrow(RX, y, y+52, H_ARROW, gate=gated)
        y += 52
    node_tops.append(y)
    y = box(RX, y, rbw, rbh, label, sub, H_BOX, H_EDGE, H_HEAD, r=14)

# right-side "context accumulates" rail
rail = RX + rbw/2 + 40
top_rail = node_tops[1]
bot_rail = y - rbh/2
d.line([(rail, top_rail), (rail, bot_rail-14)], fill=GOLD, width=5)
d.polygon([(rail-10, bot_rail-15), (rail+10, bot_rail-15), (rail, bot_rail)], fill=GOLD)
for yy in (top_rail+20, (top_rail+bot_rail)/2, bot_rail-60):
    d.ellipse([rail-6, yy-6, rail+6, yy+6], fill=GOLD)
# vertical rail text
rtxt = Image.new("RGBA", (640, 40), (0,0,0,0))
rd = ImageDraw.Draw(rtxt)
rd.text((0,0), "context accumulates → artifacts persist (STATEFUL)", font=f(17, True), fill=GOLD)
rtxt = rtxt.rotate(-90, expand=True)
img.paste(rtxt, (int(rail+14), int(top_rail)), rtxt)

# footer tag
ty = y + 60
d.rounded_rectangle([RX-330, ty, RX+330, ty+86], radius=12, fill=(237,240,255), outline=H_EDGE, width=2)
center(d, RX, ty+12, "Context  =  STATEFUL system state", f(19, True), H_HEAD)
center(d, RX, ty+44, "each stage's output feeds the next · human at every gate", f(15), MUTE)

# bottom strip
center(d, W/2, H-52, "Vibe tools generate a screen.  Agent Harry runs the design process — research to handoff, in your product's context.",
       f(18, True), INK)

img.save("/home/user/agent-harry/docs/workflow-vibe-vs-agentic.png")
print("saved", img.size)
