# Documents (.docx, .pdf)

Two delivery paths; pick from the brief:

- **Editable Word file** → python-docx, custom named styles (never the built-in Heading 1–3 look).
- **PDF as the product** → author HTML + print CSS, render to PDF. Best when typography matters, because you control exact layout.

## Shared document rules

- **Page setup is design**: A4 by default (Letter only if the audience is US), margins 20–25mm — generous white space reads as care.
- **Type scale**: body 10.5–11pt, line height 1.35–1.5, headings ≥1.5× body with real space before/after. Max ~75 chars per line.
- **Structure**: cover or header block (title, subtitle, date/author line), numbered sections, a footer with page numbers. TOC only for >10 pages.
- **Tables in documents**: thin or invisible borders, generous cell padding, bold header row, right-align numbers. Never default grid-all-borders.
- **Callouts**: one semantic style (colored left border + tinted background), used sparingly for warnings/key points — not rainbow boxes.
- **Anti-slop**: no decorative borders, watermarks, clip art, blue underlined fake links, centered body paragraphs, or emoji. Language-correct quotes/dashes and non-breaking spaces between numbers and units.

## python-docx recipe

```python
from docx import Document
from docx.shared import Pt, Mm, RGBColor
doc = Document()
s = doc.sections[0]
s.page_width, s.page_height = Mm(210), Mm(297)     # A4
s.left_margin = s.right_margin = Mm(22)
s.top_margin, s.bottom_margin = Mm(24), Mm(20)
```

- Define your own styles on `doc.styles` (name, font, size, bold, color, `paragraph_format.space_before/after`, `line_spacing`) — then every heading/body uses them. Keep the style list short: Title, H1, H2, Body, Caption, Callout.
- Default 'Normal' still leaks through — set it explicitly (font, size, color, spacing).
- Page numbers need a field in the footer (XML `PAGE` field) — look it up once, reuse.
- `keep_with_next = True` on headings so a heading never lands alone at a page bottom.

## HTML → PDF recipe

Author one self-contained HTML file; render:

- **WeasyPrint** (`pip install weasyprint`): needs GTK/pango system libs — fine on Linux/macOS (`brew install pango`), often missing on Windows. Try it first; fall back if the import fails.
- **Fallback**: `python -m playwright install chromium` then `page.pdf()` — heavier but reliable anywhere.

Print CSS essentials:

```css
@page { size: A4; margin: 24mm 22mm 20mm;
        @bottom-right { content: counter(page) " / " counter(pages); } }
body { font: 11pt/1.45 <Family>; color: <ink>; }
h1 { break-after: avoid; }   /* same for h2, table headers, callouts */
table { break-inside: avoid; }
```

Style it as a designed page, not a printed website: accent used in headings/rules, hairline separators, restrained tint blocks. A serif body + sans headings (or reverse) often reads more "document" than one family everywhere.

## Verify

`render_check.py` handles .docx (via soffice) and .pdf (direct). Check: heading orphaned at page bottom, table split awkwardly, footer collisions, over/underfull pages, hyphenation artifacts.
