# Slides (.pptx) — python-pptx

A slide is one thought + one structure. Never "title + 7 bullets".

## Setup

16:9, blank layout only:

```python
prs = Presentation(); prs.slide_width = Inches(13.333); prs.slide_height = Inches(7.5)
BLANK = prs.slide_layouts[6]   # every slide starts empty — theme is your design system
```

## Layout grammar

Margins ~0.8" (44pt), spacing unit 0.2–0.25". Every content slide shares the same skeleton — build a `slide(kicker, title)` helper so it's identical everywhere:

- **kicker**: ALL-CAPS eyebrow, 11–12pt, letter-spaced (`spc` attr, ~200–300), accent color, optional 0.1" accent square before it.
- **title**: 34–44pt semibold, one line.
- **footer**: hairline rule + deck name + `NN / total` page numbers, 10–11pt muted.
- **body zone** ~2.2–6.7": exactly one of the structures below.

## Slide taxonomy (pick one per slide)

- **Cover** — huge title (60–80pt), kicker, one supporting line, one signature graphic device drawn with shapes (e.g. overlapping circles for "infinity"). No images.
- **Comparison** — two columns "before → after" as matched card rows with an arrow between.
- **Framework / pillars** — N equal cards or columns, one letter/label each (e.g. CALMS). Equal heights.
- **Process / pipeline** — boxes + arrows in one row, loop line back underneath for cyclical processes.
- **Timeline / roadmap** — numbered nodes on a baseline + small detail cards.
- **Data** — 3–4 metric cards (big number + label + one line) or a real chart restyled to the palette.
- **Diagram** — shapes only: layered stack, flowchart, small git graph (circles + connectors).
- **Code** — a "window" card (3 traffic-light dots, filename, hairline) + monospace code with 2–3 syntax colors.
- **List/summary** — numbered rows `01 02 03`, not bullets.
- **Closing** — recap (numbered) + thanks block.

## python-pptx gotchas (learned the hard way)

- `shadow.inherit = False` on every shape or you get default shadows.
- Rounded rect radius: `sh.adjustments[0] = 0.08` (0.5 = pill).
- Textframes: zero out all four margins, set `word_wrap`, set `vertical_anchor` — or text sits oddly.
- Arrowheads and dashes need raw XML on the connector's `a:ln`: add `<a:tailEnd type="triangle" w="med" len="med"/>` / `<a:prstDash val="dash"/>`.
- Letter-spacing: `run._r.get_or_add_rPr().set("spc", "300")`.
- Set `font.name` on every run — theme fonts are unreliable.
- Plan two wrappers: `rect(x,y,w,h,fill,line,shape)` and `text(x,y,w,h,paras,size,align,anchor)` where paras accept runs `(text, color, font)` for mixed styling (e.g. **bold** + regular in one line).
- Estimating fit: ~0.09–0.11" per character at 12–14pt. When unsure, render.

## Anti-slop for slides

- One accent color per slide; the accent marks structure (kickers, numbers, key state), not decoration.
- Never center long body text; never stretch cards to fill the height.
- Keep ≥1 slide margin of empty space at the bottom of the body zone.
- Charts: restyle everything (fonts, muted gridlines, accent series color, data labels) or draw the metric cards instead.
- No transitions/animations, no sounds, no clip-art people.

## Verify

`render_check.py` → contact sheet → fix overflow first (it is the #1 defect), then alignment and rhythm, re-render, repeat until clean.
