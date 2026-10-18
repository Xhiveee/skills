#!/usr/bin/env python
"""Render office files to PNGs for visual verification.

Usage:  python render_check.py file.pptx|docx|xlsx|pdf  [--dpi 90] [--out renders]

Converts non-PDF input via LibreOffice (soffice), rasterizes pages with
PyMuPDF, writes page_NN.png and contact sheets (~6 pages each) next to the
input so the agent can LOOK at every page before shipping.

Requires: pip install pymupdf pillow ; LibreOffice for office formats.
"""
import os, shutil, subprocess, sys, glob

def find_soffice():
    exe = "soffice.exe" if os.name == "nt" else "soffice"
    p = shutil.which(exe) or shutil.which("soffice")
    if p: return p
    for c in [r"C:\Program Files\LibreOffice\program\soffice.exe",
              "/usr/bin/soffice", "/usr/local/bin/soffice",
              "/Applications/LibreOffice.app/Contents/MacOS/soffice"]:
        if os.path.exists(c): return c
    # Install:  Windows `choco install libreoffice-fresh -y`
    #           Debian/Ubuntu `apt-get install -y libreoffice`
    #           macOS `brew install --cask libreoffice`
    raise SystemExit("LibreOffice (soffice) not found — install it (see header comments)")

def to_pdf(path, outdir):
    pdf = os.path.splitext(path)[0] + ".pdf"
    if path.lower().endswith(".pdf"):
        return path
    subprocess.run([find_soffice(), "--headless", "--convert-to", "pdf",
                    "--outdir", outdir, path], check=True,
                   capture_output=True, timeout=300)
    return pdf if os.path.exists(pdf) else os.path.join(outdir, os.path.basename(pdf))

def main():
    path = os.path.abspath(sys.argv[1])
    dpi = 90; out = "renders"
    for i, a in enumerate(sys.argv[2:]):
        if a == "--dpi": dpi = int(sys.argv[i + 3])
        elif a == "--out": out = sys.argv[i + 3]
    out = os.path.join(os.path.dirname(path), out); os.makedirs(out, exist_ok=True)

    import pymupdf
    from PIL import Image

    pdf = to_pdf(path, out)
    doc = pymupdf.open(pdf)
    imgs = []
    for i, page in enumerate(doc):
        pm = page.get_pixmap(dpi=dpi)
        fp = os.path.join(out, f"page_{i+1:02d}.png"); pm.save(fp)
        imgs.append(fp)
    # contact sheets, 2 cols x 3 rows
    ims = [Image.open(f) for f in imgs]
    w, h = ims[0].size
    for g in range(0, len(ims), 6):
        sheet = Image.new("RGB", (w * 2 + 10, (h + 10) * 3), "white")
        for k, im in enumerate(ims[g:g + 6]):
            sheet.paste(im, ((k % 2) * (w + 10), (k // 2) * (h + 10)))
        sheet.save(os.path.join(out, f"sheet_{g//6:02d}.png"))
    # NOTE: pdf path may be Cyrillic/other unicode — don't print it on
    # Windows consoles (charmap codec blows up); out dir is safe enough.
    print(f"{len(ims)} page(s) -> {out}")

if __name__ == "__main__":
    main()
