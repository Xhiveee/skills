---
name: design-forge
description: >-
  Mandatory first step before writing ANY frontend markup or styles — web pages,
  landings, app UI, components, dashboards, restyling, or any task whose output is
  visible UI (including vague asks like "make it beautiful"). Generates a seeded,
  opinionated design genome (archetype, palette, typography, radius, borders,
  shadows, textures, motion, signature details, hard prohibitions) that the
  implementation must obey, so the result is unique instead of generic
  "AI slop" (Inter + blue primary + purple gradient + 12px-radius cards).
---

# Design Forge — mandatory design contract

This skill is **passive and required**: do not wait for the user to name it. Any task producing visible UI goes through the design contract BEFORE markup. It pairs with (and does not replace) the `design-system` skill, which reasons about brief/meaning — Design Forge turns that direction into a concrete, reproducible contract.

## Why

Without constraints an LLM emits the default-template look. Design Forge deterministically generates a complete design genome and a written contract; code is then written *to the contract*.

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

## Before handing off, verify

- Palette, fonts, radius, shadows come from the genome — not improvised.
- Every signature detail is implemented.
- No prohibition is violated.
- The seed is recorded in code/PR (`/* design-forge seed: <seed> */`) so the design can be regenerated.

## Anti-patterns (forbidden)

- Designing "as usual" and retrofitting the contract afterwards.
- Taking only part of the genome ("just the palette") — the contract is a whole.
- Rerolling seeds for a "prettier" outcome without reason; if the user wants options, generate a couple of seeds and let them choose.
