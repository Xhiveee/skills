---
name: design-forge
description: >-
  Mandatory first step before writing ANY frontend markup or styles — web pages,
  landings, app UI, components, dashboards, restyling, or any task whose output is
  visible UI (including vague asks like "make it beautiful"). Reasons like a
  senior design engineer: reads the product's domain, audience and mood, then
  DERIVES a bespoke visual direction (palette, typography, shape, motion,
  signature details) from principles — never from templates, presets, archetypes
  or a fixed style library — and builds it to invariant construction rules
  (anti-slop directives, semantic tokens, type/density scales, interaction
  states, UX copy).
---

# Design Forge — reason first, then build

This skill is **passive and required**: do not wait for the user to name it. Any task producing visible UI goes through this reasoning BEFORE markup. It pairs with (and does not replace) the `design-system` skill, which reasons about brief/meaning — Design Forge turns that direction into concrete, bespoke visual decisions.

## Why

An LLM asked for "beautiful UI" reaches for its default taste — and handing it a ready-made contract only swaps one default for another. Presets, archetypes and galleries all converge: whoever generated the artifact, the output reads the same. This skill instead walks you through the reasoning a senior design engineer performs, so the direction is **invented for this product**, not selected from a shelf.

**There are no templates in this skill. Nothing below tells you which style to use — only how to decide.**

---

# Step 0 — Write the product brief (before any markup)

In your plan/reply, write one short paragraph:

- **What** the product does, **who** uses it, **in what context** (quick ops tool vs showcase vs data console vs long-form reading).
- **3–5 mood words justified by the domain** — not generic "modern, clean". A lab dashboard is "clinical, precise, calm"; a streetwear drop page is "loud, mischievous, tactile"; a legal archive is "quiet, weighty, ordered".
- **One sentence** on what the UI should feel like to *use*: "a sharp instrument", "a warm workshop", "a quiet archive", "a crowded trading floor".

If you cannot write this brief, ask the user — never design blind. Every later choice must trace back to this paragraph; if a choice can't be justified by it, the choice is taste, not design.

---

# Step 1 — Derive the direction

For each layer below, **state the reason in one line before choosing**: "because the product is X, the palette needs Y". No reason, no choice.

## Palette — build it, don't pick it

- **Dominant hue** comes from the mood: warm vs cool, natural vs synthetic, loud vs hushed. **Saturation** follows energy level. **Light vs dark base** follows context (dark = cinematic, focused, dev/instrument tools; light = docs, commerce, long-form) — not fashion.
- Compose a **semantic token layer**, never raw hex sprinkled through components:

```css
:root {
  /* surfaces — the stacking order of the page */
  --bg-base:     /* page background            */
  --bg-subtle:   /* recessed areas, wells      */
  --bg-elevated: /* cards, popovers, modals    */
  /* content */
  --text-primary:   /* headings, key data      */
  --text-secondary: /* body text              */
  --text-muted:     /* captions, hints        */
  /* strokes */
  --border-dim:    /* hairline separators      */
  --border-subtle: /* card/input outlines      */
  --border-focus:  /* focus ring (= accent)    */
  /* identity */
  --accent:        /* ONE expressive accent    */
  --accent-fg:     /* text on accent (contrast-checked) */
}
```

- **One accent.** It is the product's voice: an alarm does not whisper, a ledger does not shout neon. Status semantics (success/warn/error) get muted, desaturated tones distinct from the accent — never a second "accent".
- **State the palette's logic in one line** ("cold slate + surgical cyan — reads as instrumentation"). If you can't, the palette is decoration.
- **Contrast** ≥4.5:1 body text, ≥3:1 large text/icons/focus ring. **Dark + light** behind the same custom properties (`[data-theme="dark"]` or `prefers-color-scheme`) when the product's context calls for both — a CRT-style instrument or a print piece may legitimately live in one mode; decide, don't default.

## Typography — personality in display, service in body

- **Display face carries the character the brief named**: a serif with intent, a grotesque with attitude, a mono for instruments. **Body face optimizes reading.** A technical mono accent (JetBrains Mono / IBM Plex Mono class) earns its place where data lives.
- **Inter (or Roboto) "because safe" is forbidden.** If the brief genuinely calls for neutral Swiss clarity, choose a real grotesque *deliberately* (Plus Jakarta Sans, Geist, Satoshi class) — and write the reason. Any font is legal once; boring-by-default never is.
- **Modular scale**: pick one ratio that fits the temperament (1.125–1.2 quiet/utilitarian, 1.25–1.333 balanced, 1.414+ dramatic) and derive all sizes from it on a 16px base. Never invent pixel values outside the scale.
- **Line-height is part of the size**: display 1.05–1.15 with deliberate tracking, h3/card titles 1.2–1.3, body 1.5–1.6, labels/captions/mono 1.3–1.4 (uppercase tracking is a style decision — make it).

## Shape & depth — the physics of the product

- **Radius is a philosophy**: machined 0–2px, friendly 8–12px, organic asymmetric — whichever the brief demands, then ONE scale (card = R, control = R×0.6, chip = 0 or full). No `rounded-2xl`-on-everything reflex.
- **Borders are a decision**: hairline vs hard 2px+, subtle vs stated — from the mood, not habit.
- **Depth language is chosen**: flat, diffuse, hard offset, glow — matching mood. Texture (grain, noise, scanline, none) earns its place or is removed.
- **No card-in-card.** If content needs grouping inside a surface: spacing, hairline dividers, or a `bg-subtle` tint — never a second card.

## Motion — how the product should move

- **Feel follows the brief**: snappy instrument (80–150ms), standard responsive (150–200ms, `ease-out` or `cubic-bezier(0.16, 1, 0.3, 1)`), expressive/languid (300ms+) — chosen for the product and applied consistently. Whatever the feel: no slow drifting/floating decoration, no `ease-in-out` on everything, no motion without a functional role.
- **Every interactive element ships all six states** — no "hover works, everything else is browser default":

| State | Requirement |
|---|---|
| `default` | token colors only |
| `hover` | visible, in the product's voice (color swap, lift, border — your call, one call) |
| `active` | pressed feedback (translate/darken/shadow collapse) |
| `focus-visible` | 2px `var(--border-focus)` ring + 2px offset — always, keyboard-first |
| `disabled` | reduced opacity (~0.5), `cursor: not-allowed`, no hover effect |
| `loading` | busy indicator, width held stable (no layout jump), action disabled |

## Signature details — invent them from the domain

- Produce **3+ details no other product would have**, drawn from this product's own metaphors, materials or process: a bank → ledger rules and running balances; music → staff lines and tempo ticks; maps → contour lines and grid refs; a workshop → tool marks and joinery.
- **Test each one**: if it could be pasted into any other app unchanged, it is garnish, not a signature — delete it. Every detail must do communicative work (wayfinding, hierarchy, feedback, identity).

## UX copy

- **No generic copy.** Forbidden: "Click here", "Submit", "OK", "Lorem ipsum", "Description goes here", "Card title".
- **Buttons are contextual verbs + object**: "Создать экземпляр", "Применить фильтры", "Export report" — name what happens.
- **Realistic data.** Fill previews, tables and fixtures with plausible domain data (real-looking names, dates, amounts, statuses) in the product's language — not `John Doe` × 10.
- **Empty states have a job**: one line saying *what* is empty + one action to fix it ("Пока нет отчётов — создайте первый" + primary button), never blank whitespace or a bare "No data".

---

# Invariant construction rules (style-neutral)

These decide whether the build is **sound**, never what it **looks like**. They add zero visual flavor — no extra serif, no extra whitespace, no "premium" mood.

## Anti-slop — forbidden clichés

- Generic purple-to-blue / neon gradients as decoration. A gradient exists only when the direction calls for it — then it is the identity, not garnish.
- Uniform rounding applied to everything without a radius philosophy.
- Card-in-card hell (see Shape & depth).
- `backdrop-blur` color blobs over dark backgrounds with no functional role. Glass only when it separates layers that actually overlap.
- **The "default well-crafted" look**: giant editorial serif + huge whitespace + cream/beige palette + luxe minimalism applied reflexively. Quality is mandatory; *that look* is not — it is a template like any other.
- **Empty decoration.** Every visual element carries semantic or navigational load, or it is deleted.

## Grid, spacing & density

- **Spacing: multiples of 4/8 only.** Every padding, margin and gap is a multiple of the base unit. Forbidden: `p-[13px]`, `gap-5` next to `gap-6`, `mt-7`, "almost aligned" magic numbers. If a value isn't on the scale, the layout is wrong, not the scale.
- **Density per region, not per page**: `compact` for tables/dashboards/admin/data lists (row padding 8–12px, font 13–14px, tight gaps); `comfortable` for content screens, settings, forms (section gaps ≥48px, generous card padding).

## Do / Don't

| Do | Don't |
|---|---|
| `accent` reserved for links, primary action, one key figure | accent splashed across badges, icons, headings |
| one radius scale from tokens | `rounded-xl` on one card, `rounded-3xl` on another, no system |
| surface separation via spacing + hairlines | cards inside cards inside cards |
| blur only on elements that overlay busy content | purple blurred blobs as wallpaper |
| palette derived from the brief, stated in one line | palette copied from the last project that "looked nice" |

---

# Self-check before handing off

Run through this list; every item must be yes.

**Direction**
- [ ] A product brief was written (domain, users, 3–5 justified mood words, "feels like" sentence).
- [ ] Every style choice — palette, fonts, radius, shadows, motion — traces to the brief in one line each.
- [ ] ≥3 signature details invented from this product's domain; none would survive a paste into another app.
- [ ] No borrowed look: the result does not read as "that editorial thing", "that SaaS template", or any single known site's aesthetic.

**Anti-slop**
- [ ] No Inter/Roboto default, no decoration-only gradients or blurs, no card-in-card, radius follows one scale.
- [ ] Every visual element has a stated semantic/navigational role.

**System**
- [ ] Font sizes only from the chosen modular ratio; line-heights per role.
- [ ] All spacing is multiples of 4/8 — grep for `[0-9]px` outliers.
- [ ] Semantic tokens used everywhere; theme mode(s) chosen deliberately; accent is single.
- [ ] Every interactive element has all six states including `focus-visible` and `loading`.
- [ ] Motion feel matches the brief; `prefers-reduced-motion` honored.

**Copy**
- [ ] No generic strings anywhere; buttons are verb+object; empty states have a CTA; data looks real.

# Anti-patterns (forbidden)

- Reaching for a favorite or last-used style ("that editorial/brutalist/terminal thing worked before").
- Treating any preset, template, gallery style, generated contract, or previous project's direction as the answer — even as a "starting point to tweak".
- Applying the invariants as *style*: sanding every edge back into the safe, polished default.
- Copying a known site's look — inspiration is allowed, transplantation is not.
- Satisfying the letter of the rules while reintroducing slop (one accent *plus* five "status" colors that look identical; legal-duration transitions applied to everything so the UI never stops moving).
