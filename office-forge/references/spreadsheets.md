# Spreadsheets (.xlsx) — openpyxl

A spreadsheet's design is data hygiene + restrained formatting. Nobody should open the file and see an unstyled dump.

## Data hygiene (more important than looks)

- **One table per sheet.** Title cells, notes, and a second table on the same grid break filters, sorts and pivots. Give each a sheet or a clearly separated block.
- **Atomic cells**: one value per cell, no "15 шт." — number in the cell, unit in the column header (`Цена, ₽` / `Weight, kg`).
- **One type per column.** Dates as real dates with `number_format` (e.g. `DD.MM.YYYY`), numbers as numbers, never text.
- **No merged cells inside data**, no empty rows/cols inside the range (they break range detection), no totals inside the data rows — totals go in a labeled row below or a separate summary sheet.
- **Headers**: single row, short names, unique.
- Raw data and computed/summary views on separate sheets: `Data` + `Summary` (formulas/pivot-like aggregates referencing raw).

## Readable-table styling

- Header row: solid dark fill, white bold text, thin accent bottom border; freeze top row (`freeze_panes="A2"`), enable `auto_filter`.
- Column widths: compute max cell length per column + padding (≈ `max_len * 1.1` chars, capped ~50). Auto-fit is the difference between readable and cramped.
- Body rows: subtle zebra fill (one tint from the palette) OR bottom hairlines — not both; horizontal alignment: numbers right, text left.
- Number formats everywhere: `#,##0` thousands, `0.0%` percents, currency symbols in format not in text.
- Row height default is fine; set explicit heights only for wrapped text blocks.
- Charts: `openpyxl.chart` restyled — series in accent, muted gridlines, named axes, no 3D, no default blue.

## Print/export setup (so verification and PDFs look right)

```python
ws.sheet_view.showGridLines = False        # our borders are the grid
ws.page_setup.orientation = "landscape"
ws.page_setup.fitToWidth = 1; ws.page_setup.fitToHeight = 0
ws.sheet_properties.pageSetUpPr.fitToPage = True
ws.print_title_rows = "1:1"                # header repeats on every printed page
ws.print_area = "A1:H120"                  # explicit — LibreOffice PDF export otherwise may clip
```

## Verify

`render_check.py` converts each sheet to PDF via LibreOffice → PNGs. The #1 defect: **clipped columns** — fix widths/print area, re-render. Also check: dates showing as `####` (column too narrow), formats lost on computed cells, header row not repeated.

.csv deliverables: skip styling obviously, but the hygiene rules still apply — atomic cells, no header junk lines, UTF-8 with BOM only if the consumer is Excel (Excel mangles Cyrillic without BOM).
