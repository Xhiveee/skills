---
name: office-forge
description: >-
  Required before producing ANY office-style deliverable: presentations,
  slide decks, reports, documents, .pptx, .docx, .pdf, spreadsheets, tables,
  .xlsx/.csv — including vague asks like "сделай презентацию", "оформи отчёт",
  "сгенерируй таблицу". Reasons like a document designer: derives a design
  system from the brief (never templates or built-in styles), lays out every
  file with code, and verifies a rendered visual pass before delivery.
---

# Office Forge — craft documents, don't fill templates

A document is UI. An LLM asked for "a presentation/report/table" reaches for its default taste: LibreOffice templates, the default theme, 7 bullets per slide, emoji, stock photos, random highlight colors — the result reads "generated in 2019". This skill exists so the file looks designed: **every layout decision is derived from the brief, executed in code, and checked against a rendered image of the real file.**

There are no layout templates here. Nothing below tells you which style to use — only how to decide and how to verify.

## When this applies

Any task whose output is a file a person will open: .pptx, .pdf, .docx, .xlsx, .csv, one-pagers, invoices, reports, slide decks. If the deliverable is an interactive HTML page, use design-forge instead; office files keep their own rules below.

## Step 0 — Brief (one paragraph, before any file)

Write down, inferring from context rather than asking:

- **Who** reads this and **in what context**: projected live talk vs self-reading deck vs print document vs data analysis.
- **The one takeaway**: what the reader must remember or decide.
- **3–5 mood words justified by the domain** — not "modern, clean". A fintech report is "precise, weighty, quiet"; a bootcamp deck is "direct, energetic, generous".
- **Constraints**: language (typography must support it), page format (16:9 / A4 / US Letter), existing brand assets, length.

If you cannot write this brief, ask the user — never design blind. Every later choice traces back to this paragraph.

## Step 1 — Derive the design system

For each layer state the reason in one line before choosing ("because the audience reads on X, we need Y").

- **Palette by role, not taste.** Semantic tokens, not raw hex through the layout: `bg / surface / text / muted / accent / accent-dim / line`. Dark base only when justified (screens, cinematic decks); light for print and long-form reading — per the `design-system` skill, a dark theme is a separately designed palette, not inverted default. Usually **one accent**; more need a reason.
- **Typography.** 1–2 families that exist on the render machine (verify with a real render — see Step 3). Hierarchy through size/weight/case with ≥3pt steps, not a soup of attributes. Correct quotes/dashes for the document language («»/– for Russian, “”/— for English), tracking on ALL-CAPS labels.
- **Grid.** Fixed margins and one spacing unit (e.g. 0.25" for slides, 4mm for print, cell padding for sheets). Cards in a row are identical size; text never touches edges.
- **Copy.** Headlines say what the reader gets; body text is short; numbers are real. Cut everything that fills space.

## Step 2 — Build with code, then render

Per-format recipes and library gotchas live in the references — read the one you need:

- `references/slides.md` — .pptx with python-pptx (slide taxonomy, custom shape diagrams, pptx quirks)
- `references/documents.md` — .docx with python-docx, .pdf via HTML→PDF (styles, page setup, print CSS)
- `references/spreadsheets.md` — .xlsx with openpyxl (data hygiene, formatting, readable-table rules)

Rules that hold across all formats:

- **Never** start from a built-in template/theme/master. Start blank; the design system from Step 1 is your theme.
- **Never** use stock photos, clipart, emoji, gradients, or default chart styles. Diagrams are drawn with shapes/data, charts are styled to the palette.
- Long generator scripts are normal. On some shells a single very long command is truncated — split code into several files of a few KB each.

## Step 3 — Visual verification gate (mandatory, no exceptions)

**A document is not done until you have looked at a rendered image of it.** The generator compiles ≠ the file looks right: the most common real-world failure is text overflowing its box.

1. Convert the file to PDF/PNG with LibreOffice + pymupdf using `scripts/render_check.py` (read it — it also carries soffice lookup/install notes for Windows/macOS/Linux):
   ```
   python scripts/render_check.py output.pptx        # → renders/*.png + contact sheet
   ```
2. Look at every page/slide (contact sheet first, then any suspicious page at full size).
3. Fix what you see — overflow, cramped columns, clipped tables, orphan headings — and re-render. Repeat until clean.
4. Only then attach the file. For data files, also re-open them (python-pptx/openpyxl load) to confirm they aren't corrupt.

If LibreOffice is unavailable and cannot be installed, say so in the delivery message instead of claiming the check was done — silent skipping is worse than honest limitation.

## Deliver

Attach the editable file; add the PDF export as a second attachment when it costs nothing (it renders identically on any machine). Mention the font(s) used — machines without them will substitute and shift layout.
