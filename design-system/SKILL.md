---
name: design-system
description: >-
  Use for any design task (website, app, UI, presentation, poster, social
  media, brand, document, email, icons, infographics): work out the visual
  direction, styles and details without generic "AI slop", and capture the
  decisions in DESIGN.md.
---
# Design without AI slop

Goal: a design where every decision is justified by the task, the audience and the brand, not by "this is what AI models usually do". Deliverables: a considered direction, finished artifacts, and a `DESIGN.md` from which another person or agent can reproduce the style without guessing.

Principle: meaning first, form second. Don't start with colors and fonts until it's clear who this is for, why, and how it should feel.

## 1. Brief (find out or infer from context)
Ask the user only about what you can't figure out from the materials; assume the rest and record it explicitly as an assumption.
- What we're making and for which medium: web, mobile app, desktop, presentation, print, social media, video, packaging, document, email, icons, logo.
- Who it's for: the audience and their context (on the go on a phone, at the office on a big monitor, on a projector, in a shop window), expertise level, language and culture.
- Why: the one main action or idea the person should take away. If there are several goals, rank them.
- Personality: 3–5 adjectives the brand is and 2–3 it definitely is NOT (e.g. "calm, precise, warm", but not "playful, corporate").
- Constraints: existing brand book, logo, colors, fonts and their licenses, technology, deadlines, accessibility requirements, output formats and sizes.
- Competitors and shelf neighbors: what they look like and how we need to stand apart.
If an existing `DESIGN.md` or brand book exists, it takes precedence over this skill: work within it, and propose fixes for gaps rather than silently inventing.

## 2. Research and references
- Gather 5–10 real-world references, not just from "pretty" galleries: adjacent industries, print, architecture, signage, packaging, old magazines, the interfaces of tools the audience actually uses.
- For each reference, write down WHAT exactly we're taking (grid rhythm, type contrast, photo treatment, tone of copy), not "inspired by".
- Note the category's conventions and decide deliberately: follow them (where they help the user) or break them (where you need to be recognizable).

## 3. Direction (concept)
- State the idea in one sentence: a metaphor or principle that decisions flow from. Example: "the interface as a lab notebook: monospaced labels, a strict grid, one signal color".
- Develop 2–3 clearly distinct directions, describe each briefly (idea, fonts, palette, imagery, pros and risks), and pick one with a rationale, or let the user choose if it matters.
- From then on, test every decision with: "does this follow from the idea, or am I doing it out of habit?"

## 4. Anti-slop: what not to do by default
These aren't permanent bans; they're things that need an explicit reason. If an item from this list is used, `DESIGN.md` must say why.
- Purple-blue and pink-orange gradients, gradient text, neon glow on dark backgrounds.
- Glassmorphism, blurry colored "blobs" in the background, abstract 3D shapes and spheres as decoration.
- Inter / Roboto / the system font everywhere for everything just because it's safe; a single font in a single weight with no hierarchy.
- The "centered hero + three icon cards + testimonials + CTA" layout; every section on the same rhythm.
- Cards with 16–24px radius and a soft shadow on everything; everything boxed.
- Emoji and sparkle icons ✨ instead of considered iconography; mismatched icon sets.
- Smiling stock people, generated images with artifacts (extra fingers, mushy text, "plastic" skin), identical isometric illustrations.
- Empty phrases: "Unlock your potential", "Next level", "Revolutionary solution", "Seamless", "Elevate", "In today's world…". Headlines that fit any product.
- Made-up numbers, client logos, testimonials and awards; lorem ipsum in the final version.
- Copy and elements that just fill space; decoration that carries no meaning.
- A dark theme just because it "looks techy".
- The slop test: cover the logo and the name. If the work could belong to any other company in the category, it isn't finished.

## 5. Fundamentals to always think through
### Typography
- Choose fonts for the personality and the medium (legibility on screen/in print/on a projector, support for Cyrillic and other required scripts, licensing). Usually 1–2 families; the contrast between them must be meaningful.
- A modular size scale (e.g. 1.2–1.333), no more than 6–8 steps. Clear hierarchy: headings differ by size, weight, case or typeface, not all of them at once.
- Line length of 45–75 characters for body text, line height 1.4–1.6 for body and 1.0–1.2 for large headings, tracking for all caps and small text.
- Typographic details: use the correct quotation marks, dashes and non-breaking spaces for the content language (e.g. «» for Russian, “” for English), non-breaking spaces between numbers and units, tabular figures in tables, widows and orphans.
### Color
- Build the palette from roles, not taste: background, surface, primary/secondary text, accent, states (success, warning, error, info), borders.
- One main accent is usually stronger than five. Neutrals have a hue too (warm or cool gray) and must work with the accent.
- WCAG contrast: at least 4.5:1 for normal text, 3:1 for large text and meaningful graphical elements. Check the numbers, don't eyeball it.
- Don't convey meaning by color alone (color blindness): reinforce it with shape, an icon or a label.
- A dark theme, if needed, is not an inversion but a separately designed palette (no pure black background or pure white text, muted saturated colors).
- Account for the medium: RGB/P3 for screens, CMYK and Pantone for print; check on cheap screens and projectors.
### Composition, grid and space
- A grid suited to the medium (columns, module, margins), a base spacing unit (e.g. 4 or 8) and a spacing scale.
- Hierarchy through size, contrast, position and white space. Every screen/slide/page has one primary element that is seen first.
- Proximity groups related things, distance separates unrelated ones. Align to shared axes; break the grid only on purpose.
- Rhythm: alternate dense and airy areas; don't make every block the same.
### Images and graphics
- A consistent photo or illustration style: lighting, angle, processing, color grading, cropping. Real photos of the product and people beat stock.
- Icons from one set or one system: same grid, stroke weight, corner radius, fill or outline.
- Charts and infographics: honest data, labeled axes, minimal decoration, color emphasis on what matters.
- Check generated images for artifacts; never pass them off as real photos of people, products or places.
### Copy as part of the design
- Tone of voice from the brief; specifics instead of generalities (numbers, facts, examples from the real product).
- A headline says what the person gets; a button names the action ("Download report", not "Submit").
- Cut: every word has to earn its place.
### Form, detail and materiality
- One system for corner radii, stroke weights, shadows/depth. Shadows and depth either exist as a system of levels or not at all.
- Small details create character: dividers, list markers, numbering, captions, microtypography.
### Motion (for digital media)
- Animation explains: where something came from, where it went, what changed. 150–300 ms for UI, consistent easing curves.
- Respect `prefers-reduced-motion`; no animation for its own sake.
### Accessibility and inclusivity
- Contrast, text size, touch targets of at least 44×44 px, visible focus, reading order, alt text, captions for video.
- Test at real sizes: a phone in hand, a projector in a bright room, a print from an office printer.

## 6. Medium-specific notes
- **Web and apps:** every component state (default, hover, focus, active, disabled, loading, empty, error, success), responsive from 320px, long and short copy, localization, dark theme if needed, design tokens.
- **Presentations:** one idea per slide, takeaway headlines instead of topic headlines, readable from the back row (no text smaller than 24pt), a consistent slide grid, charts simplified to the essentials.
- **Print:** margins and bleed, 300 dpi, CMYK, check fonts and black, do a test print.
- **Social media and ads:** platform formats, UI safe zones, legibility in previews, understandable in 1–2 seconds, a series should look cohesive.
- **Logo and brand:** works in one color and at small sizes (16px), on light and dark, clear space, misuse examples.
- **Email:** tables and inline styles, email clients' dark mode, works with images off.
- **Documents and reports:** navigation, heading hierarchy, scannable tables, page numbers.

## 7. Process
1. Brief and assumptions (section 1).
2. References and analysis (section 2).
3. 2–3 directions, pick one (section 3).
4. Core system: typography, color, grid, spacing, form, icons, imagery (section 5).
5. A key screen/slide/layout at full fidelity with real content, then the rest from the system.
6. Self-review (section 9) and revisions. If you can take a screenshot or render the result, look at it, not just at the code.
7. Write `DESIGN.md` (section 8).

## 8. `DESIGN.md` format
The file describes the system so another agent can reproduce it. Sections:
1. **Essence:** product, audience, goal, the direction's idea in one sentence, personality (is / is not).
2. **Principles:** 3–5 rules for making new decisions.
3. **Typography:** typefaces with sources and licenses, the scale (size, line height, weight, tracking for each level), rules.
4. **Color:** tokens with roles and values (HEX, plus OKLCH/CMYK if needed), pairs with verified contrast, dark theme.
5. **Grid and spacing:** columns, margins, breakpoints/formats, spacing scale.
6. **Form and depth:** radii, strokes, shadows/levels.
7. **Images, illustrations, icons:** style, sources, processing rules, what's forbidden.
8. **Motion:** durations, easing curves, patterns (if applicable).
9. **Components or templates:** for each: purpose, variants, states, usage rules.
10. **Voice and copy:** tone, examples of good and bad wording.
11. **Accessibility:** requirements and how to check them.
12. **Do's and don'ts:** concrete examples, including deliberate exceptions to the anti-slop list with reasons.
13. **Tokens:** a machine-readable block (CSS variables, JSON or Tailwind config) with the same values.
14. **Assumptions and open questions.**

## 9. Self-review before handoff
- [ ] Every notable decision can be explained by the brief or the direction's idea.
- [ ] The slop test passes: without the logo it's clear whose work this is, or at least that it isn't generic.
- [ ] Any anti-slop items used are justified in `DESIGN.md`.
- [ ] The hierarchy reads within 3 seconds when squinting (or on a scaled-down copy).
- [ ] Contrast checked numerically; text sizes and touch targets suit the medium.
- [ ] Spacing and sizes come from the scale, no random values; alignments line up.
- [ ] Real content; no lorem ipsum, made-up numbers or testimonials.
- [ ] Edge cases checked: long copy, empty states, errors, small and large screens/formats.
- [ ] Typography: quotation marks, dashes, non-breaking spaces, widows and orphans.
- [ ] `DESIGN.md` is complete and its values match what was built.

## 10. Report to the user
Briefly: the direction's idea in one sentence, key decisions (fonts, palette, grid), assumptions made, a link to `DESIGN.md` and the artifacts, open questions. Show the result as an image if possible.
