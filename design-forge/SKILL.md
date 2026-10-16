---
name: design-forge
description: >-
  Mandatory first step before writing ANY frontend markup or styles — web pages,
  landings, app UI, components, dashboards, restyling, or any task whose output is
  visible UI (including vague asks like "make it beautiful"). Generates a seeded,
  opinionated design genome (archetype, palette, typography, radius, borders,
  shadows, textures, motion, signature details, hard prohibitions) plus invariant
  engineering rules (anti-slop directives, type/density scales, semantic tokens,
  interaction states, UX copy) that the implementation must obey, so the result is
  unique instead of generic "AI slop" (Inter + blue primary + purple gradient +
  12px-radius cards).
---

# Design Forge — mandatory design contract

This skill is **passive and required**: do not wait for the user to name it. Any task producing visible UI goes through the design contract BEFORE markup. It pairs with (and does not replace) the `design-system` skill, which reasons about brief/meaning — Design Forge turns that direction into a concrete, reproducible contract.

## Why

Without constraints an LLM emits the default-template look. Design Forge does two things: (a) deterministically generates a **genome** — one opinionated direction per seed — and (b) applies **invariant engineering rules** that hold for every genome. The genome decides *how it looks*; the invariants decide *whether it's well-built*. Code is written to both.

## Procedure (run BEFORE any markup)

1. **Pick a seed.** Default: the project/repo slug or task slug (e.g. `acme-shop`, `billing-dashboard`). Same seed = same genome, so the design is reproducible across sessions and PRs. Do not ask the user for a seed unless they offered one.
2. **Generate the contract.** `design-forge.mjs` and `engine.js` sit in the same folder as this SKILL.md — resolve that folder's absolute path yourself (e.g. the skill install dir), then run:

   ```bash
   node <skill-dir>/design-forge.mjs --seed <seed> --format prompt
   ```

   Node ≥16, zero dependencies. If `design-forge.mjs` is missing next to SKILL.md, the skill was installed incompletely — fetch all files of the `design-forge/` folder (see INSTALL.md, "multi-file skills").
3. **Restate the contract** in one paragraph in your plan/reply — this locks the decision in.
4. **Export tokens** into the project:

   ```bash
   node <skill-dir>/design-forge.mjs --seed <seed> --format css      --out design-tokens.css
   node <skill-dir>/design-forge.mjs --seed <seed> --format tailwind --out design-tailwind.js   # Tailwind projects
   ```

5. **Build UI to the contract.** Implement ALL signature details, honor every item in "Hard prohibitions". If a request or existing code conflicts with the contract, the contract wins — surface the conflict to the user.
6. If visual direction is already fixed (brand book, exact colors/fonts): force the closest archetype with `--archetype <key>` (see `node design-forge.mjs --list`), or flag the mismatch honestly and ask.

## Archetypes

Editorial Grid · International/Swiss · Neo-Brutalist · Soft Product · Terminal/CRT · Organic/Craft · Luxury/Atelier · Technical Blueprint · Vapor/Dream · Risograph/Print. Each is a generator within the style's own bounds — palette, type pairing and details are seeded-random, never a fixed preset.

## The genome is the art director — you are the implementer

Your own taste is overridden for this task. Two consequences:

- **"Well-crafted" is not a style.** The default craft aesthetic — oversized editorial serif, magazine whitespace, cream/ink minimal palette, soft "premium" mood — is *also a template*. It is forbidden unless the generated archetype actually calls for it (Editorial Grid, Luxury). A Terminal, Brutalist or Blueprint build that reads as a design-blog landing has failed the contract.
- **The build must be recognizable as its archetype.** If a reviewer couldn't tell which archetype generated it from a screenshot alone, the genome wasn't applied — regardless of how polished the result is. Signature details are the identity: at least 3 must be visibly present in the delivered UI.

The invariants below are construction rules. They add **zero visual style** — they decide whether the build is sound, never what it looks like.

---

# Invariant rules (apply to EVERY genome)

The genome randomizes direction; these rules never change. They govern *construction quality* only — tokens, states, scales, copy — and add no visual style of their own (no extra serif, no extra whitespace, no "premium" mood). A genome may *tighten* them (its "Hard prohibitions" win), never loosen them.

## 1. Anti-slop directives

**Forbidden clichés:**

- Generic purple-to-blue / neon gradients as "decoration". A gradient exists only if the genome calls for one (e.g. Vapor, Aurora) — and then it is *the* identity, not garnish.
- `rounded-2xl`-style uniform rounding applied to everything without a radius philosophy. Radius comes from the genome's scale (card = R, control = R×0.6, chip = full or 0) — nothing else.
- Card-in-card hell: a bordered/surface panel nested inside another surface panel. If content needs grouping, use spacing, hairline dividers, or a `bg-subtle` tint — never a second card.
- `backdrop-blur` color blobs over a dark background with no functional role (navigation, layering). Glass is only allowed when the genome says so and when it separates layers that actually overlap.
- The "default well-crafted" look: giant editorial serif + huge whitespace + cream/beige palette + luxe minimalism applied to every archetype. Quality is mandatory, this *look* is not — style comes only from the genome.

**Forbidden defaults:**

- **Inter (or Roboto) by default.** The typeface pair must be a deliberate choice justified by the task: characterful grotesques (Plus Jakarta Sans, Geist, Satoshi-class), a serif with intent, or a technical mono accent for data (JetBrains Mono, IBM Plex Mono-class). The genome supplies the pairing; honoring it is mandatory.
- **Empty decoration.** Every visual element must carry semantic or navigational load. If you cannot state in one sentence what a glow/divider/badge does for the user, delete it.

| Do | Don't |
|---|---|
| `accent` reserved for links, primary action, one key figure | accent splashed across badges, icons, headings |
| one radius scale from tokens | `rounded-xl` on one card, `rounded-3xl` on another, no system |
| surface separation via spacing + hairlines | cards inside cards inside cards |
| blur only on elements that overlay busy content | purple blurred blobs as wallpaper |

## 2. Typography, grid & data density

**Modular type scale.** All sizes derive from the genome's ratio (`--type-ratio`), applied to a 16px base: `12 · 14 · 16 · 19/20 · 24 · 30/32 · 38+ `. Never invent pixel values outside the scale.

**Line-height is part of the size**, not a default:

| Role | line-height |
|---|---|
| Display (h1–h2) | 1.05–1.15, tracking from genome |
| h3 / card titles | 1.2–1.3 |
| Body | 1.5–1.6 |
| Labels / captions / mono | 1.3–1.4, uppercase tracking from genome |

**Density scale** — pick per region, not per page:

- `compact`: tables, dashboards, admin panels, data lists. Row padding 8–12px, font 13–14px, tight gaps.
- `comfortable`: content screens, settings, forms. Section gaps ≥48px, generous card padding.

**Spacing: multiples of 4/8 only.** Every padding, margin and gap is a multiple of `var(--space)` (4 or 8). Forbidden: `p-[13px]`, `gap-5` next to `gap-6`, `mt-7`, "almost aligned" magic numbers. If a value isn't on the scale, the layout is wrong, not the scale.

## 3. Color & tokens

Every output uses a **semantic token layer**, never raw hex sprinkled through components. Generate (or map the genome onto):

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

- **Single accent.** One accent carries all interactive meaning. No rainbow of badge colors; status semantics (success/warn/error) get muted, desaturated tones distinct from the accent.
- **Dark + light.** Define both themes behind the same custom properties (`[data-theme="dark"]` or `prefers-color-scheme`); components reference tokens only, so theming is a token swap, not a restyle. Exception: genomes that forbid one mode (e.g. Terminal bans light, Risograph bans dark) ship their single permitted theme through the same tokens — never force a theme the genome prohibits.
- **Contrast:** text pairs ≥4.5:1 (body), ≥3:1 (large text, icons, focus ring).

## 4. Interaction states & micro-interactions

**Every interactive element ships all six states** — no "hover works, everything else is browser default":

| State | Requirement |
|---|---|
| `default` | token colors only |
| `hover` | visible, from the genome's hover behavior (color swap, lift, border — per contract) |
| `active` | pressed feedback (translate/darken/shadow collapse) |
| `focus-visible` | 2px `var(--border-focus)` ring + 2px offset — always, keyboard-first |
| `disabled` | reduced opacity (~0.5), `cursor: not-allowed`, no hover effect |
| `loading` | busy indicator, width held stable (no layout jump), action disabled |

**Motion budget:** transitions 150–200ms, `ease-out` or `cubic-bezier(0.16, 1, 0.3, 1)` — the *default* for genomes without a motion spec. A genome's own motion spec always wins in either direction (Terminal's 80ms linear, Brutalist's steps, Vapor/Luxury's slower language are valid because they are part of the contract). Forbidden regardless of genome: slow drifting/floating decoration, `ease-in-out` slapped on everything, motion without a functional role.

## 5. UX copy

- **No generic copy.** Forbidden: "Click here", "Submit", "OK", "Lorem ipsum", "Description goes here", "Card title".
- **Buttons are contextual verbs + object**: "Создать экземпляр", "Применить фильтры", "Export report" — name what happens.
- **Realistic data.** Fill previews, tables and fixtures with plausible domain data (real-looking names, dates, amounts, statuses) in the product's language — not `John Doe` × 10.
- **Empty states have a job**: one line saying *what* is empty + one action to fix it ("Пока нет отчётов — создайте первый" + primary button), never blank whitespace or a bare "No data".

---

# Self-check before handing off

Run through this list; every item must be yes.

**Contract**
- [ ] Genome was generated (seed recorded as `/* design-forge seed: <seed> */` in code/PR) and restated in the plan.
- [ ] Palette, fonts, radius, shadows come from the genome — not improvised.
- [ ] Every signature detail implemented; no genome prohibition violated.
- [ ] A screenshot alone would identify the archetype — the result could not pass for Editorial/Lux default unless the genome actually is one.

**Anti-slop**
- [ ] No Inter/Roboto default, no decoration-only gradients or blurs, no card-in-card, radius follows the token scale.
- [ ] Every visual element has a stated semantic/navigational role.

**System**
- [ ] Font sizes only from the modular scale; line-heights per role table.
- [ ] All spacing is multiples of 4/8 — grep for `[0-9]px` outliers.
- [ ] Semantic tokens used everywhere; themes defined per genome (both themes, or its single permitted theme); accent is single.
- [ ] Every interactive element has all six states including `focus-visible` and `loading`.
- [ ] Motion matches the genome's spec, or the 150–200ms default budget when the genome is silent.
- [ ] `prefers-reduced-motion` honored — non-essential motion disabled/reduced for users who request it.

**Copy**
- [ ] No generic strings anywhere; buttons are verb+object; empty states have a CTA; data looks real.

# Anti-patterns (forbidden)

- Designing "as usual" and retrofitting the contract afterwards.
- Taking only part of the genome ("just the palette") — the contract is a whole.
- Applying the invariants as a *style*: treating "well-crafted" as direction and sanding the genome's edges back into the safe editorial default.
- Rerolling seeds for a "prettier" outcome without reason; if the user wants options, generate a couple of seeds and let them choose.
- Satisfying the letter of the rules while reintroducing slop (e.g. one accent *plus* five "status" colors that look identical; 200ms transitions that are technically legal but applied to everything, so the UI never stops moving).
