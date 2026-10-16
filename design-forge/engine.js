/* design-forge engine — seeded generator of opinionated frontend design systems.
   Works in Node (module.exports) and in the browser (window.DesignForge). */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.DesignForge = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* ---------- seeded RNG ---------- */
  function hashSeed(str) {
    let h = 2166136261;
    for (let i = 0; i < String(str).length; i++) {
      h ^= String(str).charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------- color ---------- */
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  function hsl(h, s, l) {
    h = ((h % 360) + 360) % 360; s = clamp(s, 0, 1); l = clamp(l, 0, 1);
    const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
    let r, g, b;
    if (h < 60) [r, g, b] = [c, x, 0]; else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x]; else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c]; else [r, g, b] = [c, 0, x];
    const f = v => Math.round((v + m) * 255).toString(16).padStart(2, "0");
    return ("#" + f(r) + f(g) + f(b));
  }
  function hexRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  function rgba(hex, a) { const { r, g, b } = hexRgb(hex); return `rgba(${r},${g},${b},${+a.toFixed(3)})`; }
  function hexHsl(hex) {
    const { r, g, b } = hexRgb(hex); const R = r / 255, G = g / 255, B = b / 255;
    const mx = Math.max(R, G, B), mn = Math.min(R, G, B); let h = 0, s = 0, l = (mx + mn) / 2;
    if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      if (mx === R) h = (G - B) / d + (G < B ? 6 : 0); else if (mx === G) h = (B - R) / d + 2; else h = (R - G) / d + 4; h *= 60; }
    return { h, s, l };
  }
  const shiftL = (hex, d) => { const { h, s, l } = hexHsl(hex); return hsl(h, s, l + d); };
  const shiftS = (hex, d) => { const { h, s, l } = hexHsl(hex); return hsl(h, clamp(s + d, 0, 1), l); };

  /* noise texture as inline svg */
  function noiseURI(op) {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='140' height='140' filter='url(#n)' opacity='${op}'/></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }

  /* ---------- font stacks (offline-safe) ---------- */
  const FONTS = {
    serifOld:   { label: "Old-style serif",      stack: `Georgia, 'Iowan Old Style', 'Times New Roman', serif` },
    serifDidone:{ label: "High-contrast didone", stack: `'Didot', 'Bodoni MT', 'Playfair Display', Georgia, serif` },
    slab:       { label: "Slab serif",           stack: `Rockwell, 'Roboto Slab', 'Courier Bold', Georgia, serif` },
    grotesque:  { label: "Neo-grotesque sans",   stack: `'Helvetica Neue', Helvetica, Arial, 'Segoe UI', sans-serif` },
    humanist:   { label: "Humanist sans",        stack: `'Trebuchet MS', 'Segoe UI', Verdana, sans-serif` },
    geometric:  { label: "Geometric sans",       stack: `'Century Gothic', Futura, 'Avenir Next', 'Trebuchet MS', sans-serif` },
    mono:       { label: "Monospace",            stack: `'Cascadia Code', Consolas, 'SF Mono', 'Courier New', monospace` },
    heavy:      { label: "Heavy display",        stack: `Impact, 'Arial Black', 'Segoe UI Black', sans-serif` },
  };

  const NAME_A = ["Quiet", "Static", "Feral", "Amber", "Ledger", "North", "Iron", "Pale", "Vivid", "Slow", "Hard", "Soft", "Analog", "Modular", "Cobalt", "Paper"];
  const NAME_B = ["Ledger", "Signal", "Press", "Garden", "Circuit", "Atlas", "Frame", "Tide", "Mono", "Quarry", "Vector", "Archive", "Studio", "Field", "Almanac", "Crate"];

  const TYPE_RATIOS = [1.2, 1.25, 1.333, 1.414, 1.5, 1.618];
  const RATIO_NAMES = { "1.2": "minor third", "1.25": "major third", "1.333": "perfect fourth", "1.414": "augmented fourth", "1.5": "perfect fifth", "1.618": "golden ratio" };

  /* ---------- archetypes ----------
     Each returns a partial genome; shared assembler fills the rest. */
  const ARCHETYPES = {

    editorial(r) {
      const accent = pick(r, [hsl(rnd(r, 0, 14), 0.85, 0.48), hsl(rnd(r, 215, 235), 0.8, 0.45), hsl(rnd(r, 140, 160), 0.6, 0.32)]);
      return {
        key: "editorial", label: "Editorial Grid",
        mood: ["print-minded", "serious", "content-first"],
        palette: { bg: pick(r, ["#faf8f3", "#f6f4ee", "#fdfcf8"]), surface: "#ffffff", ink: "#141412", muted: "#6f6c64", accent, accent2: shiftL(accent, -0.18), line: "#1a1a18", scheme: "paper + one accent" },
        type: { display: FONTS.serifDidone, body: FONTS.grotesque, mono: FONTS.mono, ratio: pick(r, [1.333, 1.414]), trackingD: "-0.02em", trackingL: "0.14em", weightD: 500 },
        space: { base: pick(r, [4, 8]), density: pick(r, ["airy", "normal"]) },
        radius: { value: pick(r, [0, 2, 3]), note: "squares or near-squares; paper has no rounded corners" },
        border: { style: "solid", width: 1, hairline: true },
        shadow: { name: "none", css: "none" },
        texture: { name: pick(r, ["none", "grain"]), cssFn: p => p.texture.name === "grain" ? `background-image:${noiseURI(0.05)}` : "" },
        motion: { dur: "140ms", ease: "ease-out", hover: "color swap only — never lift or scale" },
        signature: [
          "thick top rule (3–4px solid ink) above the page header",
          "sections numbered like a journal: 01, 02, 03 in mono",
          "small caps / letterspaced labels instead of colored badges",
          pick(r, ["drop cap on lead paragraph", "foot-style sidenotes in the margin", "horizontal hairlines separating every section"]),
        ],
        donts: ["no drop shadows", "no gradients", "no rounded cards", "no center-aligned body text", "no icons inside headings"],
      };
    },

    swiss(r) {
      const accent = pick(r, ["#e30613", "#0055a5", "#f5a300", "#111111"]);
      return {
        key: "swiss", label: "International / Swiss",
        mood: ["rational", "gridded", "objective"],
        palette: { bg: "#f4f4f0", surface: "#ffffff", ink: "#111111", muted: "#575757", accent, accent2: "#111111", line: "#111111", scheme: "achromatic + single functional accent" },
        type: { display: FONTS.grotesque, body: FONTS.grotesque, mono: FONTS.mono, ratio: pick(r, [1.333, 1.5]), trackingD: "-0.03em", trackingL: "0.1em", weightD: 700 },
        space: { base: 8, density: "airy" },
        radius: { value: 0, note: "zero radius, always" },
        border: { style: "solid", width: pick(r, [1, 2]), hairline: false },
        shadow: { name: "none", css: "none" },
        texture: { name: "none", cssFn: () => "" },
        motion: { dur: "120ms", ease: "cubic-bezier(.2,0,0,1)", hover: "invert to accent, no transform" },
        signature: [
          "elements align to a visible 12-column grid; nothing floats free",
          "accent color carries meaning only: links, active states, one key figure",
          "huge display type (h1 ≈ 6–9em of base) with tight tracking",
          "whitespace is the separator — not borders or cards",
        ],
        donts: ["no shadows", "no gradients", "no decorative icons", "no more than 2 typefaces", "never center body copy"],
      };
    },

    brutalist(r) {
      const bg = pick(r, ["#f2f0e9", "#ffe900", "#ff6c37", "#eaeaea"]);
      const ink = "#111111";
      return {
        key: "brutalist", label: "Neo-Brutalist",
        mood: ["loud", "confrontational", "honest"],
        palette: { bg, surface: "#ffffff", ink, muted: "#3c3c3c", accent: pick(r, ["#0040ff", "#ff3ea5", "#00c853", "#111111"]), accent2: pick(r, ["#ffe900", "#ff6c37", "#9dff00"]), line: ink, scheme: "flat spot colors, max 3" },
        type: { display: pick(r, [FONTS.heavy, FONTS.mono]), body: pick(r, [FONTS.mono, FONTS.grotesque]), mono: FONTS.mono, ratio: pick(r, [1.414, 1.5]), trackingD: "0", trackingL: "0.08em", weightD: 800 },
        space: { base: 8, density: "compact" },
        radius: { value: 0, note: "square corners; roundness is banned" },
        border: { style: "solid", width: pick(r, [2, 3]), hairline: false },
        shadow: { name: "hard offset", cssFn: p => `${p.brutalOff}px ${p.brutalOff}px 0 ${p.palette.line}` },
        brutalOff: r() < 0.5 ? 6 : 8,
        texture: { name: pick(r, ["none", "dots"]), cssFn: p => p.texture.name === "dots" ? `background-image:radial-gradient(${rgba(p.palette.ink, 0.14)} 1px, transparent 1px);background-size:14px 14px` : "" },
        motion: { dur: "100ms", ease: "steps(2,end)", hover: "shadow collapses to 0 and element translates by the offset — like pressing a physical button" },
        signature: [
          "everything gets the hard offset shadow, including buttons and inputs",
          "headings may be rotated −1 to −3 degrees",
          "uppercase labels with [bracketed] or _underscore_ decoration",
          "marquee or ticker strip as a recurring motif",
        ],
        donts: ["no blur, no glass", "no soft shadows", "no gradients", "no subtlety: border is 2px minimum", "no centered long text"],
      };
    },

    soft(r) {
      const h = rnd(r, 0, 360);
      const bg = hsl(h, r() < 0.5 ? 0.5 : 0.35, 0.94);
      const accent = hsl(h, 0.65, 0.55);
      return {
        key: "soft", label: "Soft Product",
        mood: ["friendly", "calm", "approachable"],
        palette: { bg, surface: "#ffffff", ink: hsl(h, 0.3, 0.18), muted: hsl(h, 0.15, 0.45), accent, accent2: hsl(h + 40, 0.6, 0.6), line: hsl(h, 0.25, 0.85), scheme: `monochrome pastel around hue ${Math.round(h)}` },
        type: { display: FONTS.geometric, body: FONTS.humanist, mono: FONTS.mono, ratio: 1.25, trackingD: "-0.01em", trackingL: "0.06em", weightD: 700 },
        space: { base: 8, density: "airy" },
        radius: { value: pick(r, [14, 18, 22]), note: "large, single radius scale: card = R, control = R×0.6, chip = full" },
        border: { style: "none", width: 0, hairline: false },
        shadow: { name: "layered soft, tinted", cssFn: p => `0 1px 2px ${rgba(p.palette.accent, .08)}, 0 4px 12px ${rgba(p.palette.accent, .10)}, 0 16px 40px ${rgba(p.palette.accent, .12)}` },
        texture: { name: "none", cssFn: () => "" },
        motion: { dur: "220ms", ease: "cubic-bezier(.3,1.2,.4,1)", hover: "lift 2px + deepen shadow" },
        signature: [
          "shadows are tinted with the accent hue, never black",
          "radius follows a strict scale — no arbitrary values",
          "primary button is the only fully-saturated element on screen",
          "empty states get a friendly one-line explanation, never blank space",
        ],
        donts: ["no hard borders on cards", "no black text — use ink from the palette", "no sharp corners", "no more than one accent per view"],
      };
    },

    terminal(r) {
      const accent = pick(r, ["#33ff66", "#ffb000", "#33e0ff", "#ff7a33"]);
      const bg = pick(r, ["#0a0f0a", "#0b0e12", "#120e08", "#0a0a0a"]);
      return {
        key: "terminal", label: "Terminal / CRT",
        mood: ["technical", "nocturnal", "precise"],
        palette: { bg, surface: shiftL(bg, 0.04), ink: shiftL(accent, 0.25), muted: hsl(hexHsl(accent).h, 0.4, 0.4), accent, accent2: shiftL(accent, -0.15), line: rgba(accent, 0.35), scheme: "single phosphor hue on near-black" },
        type: { display: FONTS.mono, body: FONTS.mono, mono: FONTS.mono, ratio: 1.333, trackingD: "0", trackingL: "0.12em", weightD: 700 },
        space: { base: 4, density: "compact" },
        radius: { value: pick(r, [0, 2]), note: "square-ish; max 2px" },
        border: { style: pick(r, ["solid", "dashed"]), width: 1, hairline: true },
        shadow: { name: "glow", cssFn: p => `0 0 12px ${rgba(p.palette.accent, .25)}, 0 0 40px ${rgba(p.palette.accent, .10)}` },
        texture: { name: pick(r, ["scanlines", "dots", "none"]), cssFn: p => p.texture.name === "scanlines" ? `background-image:repeating-linear-gradient(0deg, ${rgba(p.palette.accent, .05)} 0 1px, transparent 1px 3px)` : p.texture.name === "dots" ? `background-image:radial-gradient(${rgba(p.palette.accent, .18)} 1px, transparent 1px);background-size:20px 20px` : "" },
        motion: { dur: "80ms", ease: "linear", hover: "background flash — element inverts to accent bg with dark text" },
        signature: [
          "prompt-style prefixes on headings: `> `, `$ `, or `//`",
          "blinking block cursor (CSS steps animation) after key labels",
          "status readouts styled as key:value pairs in muted mono",
          "borders read as ASCII frames: single hairline, maybe double on focus",
        ],
        donts: ["no serif fonts", "no pastel colors", "no rounded pill buttons", "no emojis — use ASCII glyphs", "no light mode"],
      };
    },

    organic(r) {
      const h = rnd(r, 20, 90); // warm earth band
      const bg = hsl(h, 0.3, 0.9);
      const accent = hsl(h + rnd(r, 60, 120), 0.4, 0.35);
      return {
        key: "organic", label: "Organic / Craft",
        mood: ["warm", "tactile", "unhurried"],
        palette: { bg, surface: hsl(h, 0.35, 0.96), ink: hsl(h, 0.35, 0.2), muted: hsl(h, 0.18, 0.45), accent, accent2: hsl(h - 20, 0.5, 0.5), line: hsl(h, 0.25, 0.75), scheme: "earthy analogous: clay, moss, sand" },
        type: { display: FONTS.serifOld, body: FONTS.humanist, mono: FONTS.mono, ratio: pick(r, [1.25, 1.333]), trackingD: "0", trackingL: "0.05em", weightD: 500 },
        space: { base: 8, density: "airy" },
        radius: { value: pick(r, [10, 14, 20]), note: "organic irregularity allowed: asymmetric radius like 20px 24px 18px 22px on hero elements" },
        border: { style: "solid", width: 1, hairline: true },
        shadow: { name: "diffuse warm", cssFn: p => `0 8px 24px ${rgba(p.palette.ink, .12)}, 0 2px 6px ${rgba(p.palette.ink, .08)}` },
        texture: { name: "grain", cssFn: p => `background-image:${noiseURI(0.08)}` },
        motion: { dur: "300ms", ease: "cubic-bezier(.25,.8,.25,1)", hover: "gentle darken + slight scale 1.01" },
        signature: [
          "grain texture over the whole surface — paper, not pixels",
          "buttons in deep earth tone with 1px darker bottom edge",
          "headlines set in serif italics for emphasis words",
          "dividers are hand-drawn-feeling hairlines or dots, not full-width rules",
        ],
        donts: ["no pure black or pure white", "no neon accents", "no glass blur", "no geometric sans for display"],
      };
    },

    lux(r) {
      const dark = r() < 0.55;
      const metal = pick(r, ["#c8a24a", "#b08d57", "#9aa0a8"]);
      return {
        key: "lux", label: "Luxury / Atelier",
        mood: ["restrained", "expensive", "editorial"],
        palette: {
          bg: dark ? "#0e0d0b" : "#f7f4ee", surface: dark ? "#171511" : "#ffffff",
          ink: dark ? "#e9e2d4" : "#16130e", muted: dark ? "#8b8375" : "#7a7264",
          accent: metal, accent2: dark ? "#e9e2d4" : "#16130e", line: rgba(metal, 0.45), scheme: "near-monochrome + one metallic",
        },
        type: { display: FONTS.serifDidone, body: FONTS.grotesque, mono: FONTS.mono, ratio: pick(r, [1.5, 1.618]), trackingD: "0.01em", trackingL: "0.28em", weightD: 400 },
        space: { base: 8, density: "airy" },
        radius: { value: pick(r, [0, 2]), note: "square or barely-soft; luxury is tailored, not bubbly" },
        border: { style: "solid", width: 1, hairline: true },
        shadow: { name: "none", css: "none" },
        texture: { name: "none", cssFn: () => "" },
        motion: { dur: "400ms", ease: "cubic-bezier(.2,.7,.2,1)", hover: "hairline turns metallic + letter-spacing widens 0.02em" },
        signature: [
          "labels are uppercase with very wide tracking (0.25em+)",
          "metallic appears only on hairlines, numerals and rules — never fills",
          "extreme whitespace: sections breathe 120px+ vertical padding",
          "prices/figures in tabular lining figures, italic serif for names",
        ],
        donts: ["no rounded buttons", "no shadows", "no bright saturated colors", "no more than ~3 elements per viewport fold", "no exclamation in copy"],
      };
    },

    blueprint(r) {
      const bg = pick(r, ["#0d2137", "#101a2e", "#0c1a26"]);
      const accent = pick(r, ["#38e1ff", "#ff9142", "#ffe94a"]);
      return {
        key: "blueprint", label: "Technical Blueprint",
        mood: ["engineering", "schematic", "systemic"],
        palette: { bg, surface: shiftL(bg, 0.05), ink: "#dce8f2", muted: "#7d93a8", accent, accent2: "#dce8f2", line: rgba("#dce8f2", 0.22), scheme: "drafting-navy field, ink-on-plan annotations" },
        type: { display: FONTS.grotesque, body: FONTS.grotesque, mono: FONTS.mono, ratio: 1.333, trackingD: "-0.01em", trackingL: "0.18em", weightD: 600 },
        space: { base: 4, density: "normal" },
        radius: { value: pick(r, [0, 2, 4]), note: "instrument-like: 0–4px max" },
        border: { style: pick(r, ["solid", "dashed"]), width: 1, hairline: true },
        shadow: { name: "none", css: "none" },
        texture: { name: "grid", cssFn: p => `background-image:linear-gradient(${rgba("#dce8f2", .07)} 1px, transparent 1px),linear-gradient(90deg, ${rgba("#dce8f2", .07)} 1px, transparent 1px);background-size:28px 28px` },
        motion: { dur: "150ms", ease: "steps(4,end)", hover: "dashed border becomes solid + label inverts" },
        signature: [
          "every panel tagged with a spec label: `FIG.01`, `SEC/A`, coordinates",
          "crosshair/grid underlay on hero areas",
          "dimension-style annotations: small mono text with arrows or rules",
          "corner ticks on focused elements instead of glow",
        ],
        donts: ["no gradients on surfaces", "no pill buttons", "no warm earthy tones", "no decorative serif", "no rounded avatars — square"],
      };
    },

    vapor(r) {
      const h = rnd(r, 250, 330);
      return {
        key: "vapor", label: "Vapor / Dream",
        mood: ["hazy", "nostalgic", "synthetic"],
        palette: { bg: hsl(h, 0.5, 0.1), surface: rgba(hsl(h, 0.4, 0.6), 0.14), ink: "#f2ecff", muted: hsl(h, 0.3, 0.65), accent: hsl(h, 0.9, 0.72), accent2: hsl(h + 60, 0.85, 0.68), line: rgba("#ffffff", 0.18), scheme: `duotone gradient field around hue ${Math.round(h)}` },
        type: { display: FONTS.geometric, body: FONTS.humanist, mono: FONTS.mono, ratio: 1.414, trackingD: "0.02em", trackingL: "0.2em", weightD: 600 },
        space: { base: 8, density: "airy" },
        radius: { value: pick(r, [18, 24, 28]), note: "soft, large; chips full-round" },
        border: { style: "solid", width: 1, hairline: true },
        shadow: { name: "glow", cssFn: p => `0 8px 32px ${rgba(p.palette.accent2, .25)}` },
        texture: { name: "aurora", cssFn: p => `background:radial-gradient(at 20% 15%, ${rgba(p.palette.accent, .28)} 0, transparent 55%),radial-gradient(at 80% 70%, ${rgba(p.palette.accent2, .24)} 0, transparent 55%),${p.palette.bg}` },
        motion: { dur: "350ms", ease: "cubic-bezier(.3,1,.3,1)", hover: "blur intensifies + border brightens" },
        signature: [
          "large blurred gradient blobs behind glass surfaces",
          "backdrop-filter blur on cards, nav, modals — everywhere",
          "text occasionally in italic with wide tracking — dreamlike",
          "accent gradients on key phrases only, never whole blocks",
        ],
        donts: ["no flat solid backgrounds", "no hard black text", "no sharp corners", "no heavy borders (>1px)", "no fast/snappy motion"],
      };
    },

    riso(r) {
      const c1 = pick(r, ["#ff48b0", "#0078bf", "#00a95c", "#ff6c2f", "#765ba7"]);
      const c2 = pick(r, ["#ffe800", "#0078bf", "#ff48b0", "#00a95c"].filter(c => c !== c1));
      return {
        key: "riso", label: "Risograph / Print",
        mood: ["tactile", "zine-like", "imperfect"],
        palette: { bg: pick(r, ["#f4efe4", "#f7f2e8"]), surface: "#fffdf6", ink: "#1d1a16", muted: "#6b655c", accent: c1, accent2: c2, line: "#1d1a16", scheme: `2-color riso: ${c1} + ${c2} on paper` },
        type: { display: pick(r, [FONTS.slab, FONTS.heavy]), body: FONTS.grotesque, mono: FONTS.mono, ratio: 1.333, trackingD: "0", trackingL: "0.06em", weightD: 700 },
        space: { base: 8, density: "normal" },
        radius: { value: pick(r, [0, 4]), note: "print edges: mostly square" },
        border: { style: "solid", width: pick(r, [1, 2]), hairline: false },
        shadow: { name: "misregistration", cssFn: p => `${r() < 0.5 ? 3 : 4}px ${r() < 0.5 ? 3 : 4}px 0 ${p.palette.accent2}` },
        texture: { name: "halftone", cssFn: p => `background-image:radial-gradient(${rgba(p.palette.accent, .22)} 1.2px, transparent 1.2px);background-size:9px 9px` },
        motion: { dur: "120ms", ease: "steps(2,end)", hover: "misregistration shadow shifts direction" },
        signature: [
          "two spot colors overprint with multiply blend where they cross",
          "halftone dot fills behind hero type and inside cards",
          "misregistered shadow: offset accent2, never blurred",
          "hand-numbered elements: №01, №02 like a zine",
        ],
        donts: ["no gradients", "no blur", "no more than the 2 spot colors + ink", "no thin light fonts", "no dark mode"],
      };
    },
  };

  const ARCH_KEYS = Object.keys(ARCHETYPES);

  /* ---------- assembler ---------- */
  function generate(seedStr, opts) {
    opts = opts || {};
    const seed = seedStr == null ? Math.random().toString(36).slice(2, 8) : String(seedStr);
    const r = mulberry32(hashSeed(seed));
    const key = opts.archetype && ARCHETYPES[opts.archetype] ? opts.archetype : pick(r, ARCH_KEYS);
    const g = ARCHETYPES[key](r);
    g.seed = seed;
    if (opts.archetype && ARCHETYPES[opts.archetype]) g.forcedArchetype = key;
    g.name = pick(r, NAME_A) + " " + pick(r, NAME_B);
    g.type.ratioName = RATIO_NAMES[String(g.type.ratio)] || String(g.type.ratio);
    // resolve cssFn into css
    if (g.shadow.cssFn) g.shadow.css = g.shadow.cssFn(g);
    if (g.texture.cssFn) g.texture.css = g.texture.cssFn(g);
    delete g.shadow.cssFn; delete g.texture.cssFn;
    return g;
  }

  const pick = (r, a) => a[Math.floor(r() * a.length)];
  const rnd = (r, a, b) => a + r() * (b - a);

  /* ---------- emitters ---------- */

  function toCss(g, scope) {
    const sc = scope || "";
    const p = g.palette, t = g.type, sp = g.space;
    const rad = g.radius.value;
    const ctrlRad = Math.max(0, Math.round(rad * 0.6));
    const lines = [];
    lines.push(`/* ${g.name} — ${g.label} (seed: ${g.seed}) */`);
    const st = semanticTokens(p);
    lines.push(`${sc || ":root"} {`);
    lines.push(`  /* semantic layer */`);
    lines.push(`  --bg-base: ${st.bgBase}; --bg-subtle: ${st.bgSubtle}; --bg-elevated: ${st.bgElevated};`);
    lines.push(`  --text-primary: ${st.textPrimary}; --text-secondary: ${st.textSecondary}; --text-muted: ${st.textMuted};`);
    lines.push(`  --border-dim: ${st.borderDim}; --border-subtle: ${st.borderSubtle}; --border-focus: ${st.borderFocus};`);
    lines.push(`  --accent: ${st.accent}; --accent-fg: ${st.accentFg}; --accent-2: ${st.accent2};`);
    lines.push(`  /* legacy aliases — kept so older components keep working */`);
    lines.push(`  --bg: var(--bg-base); --surface: var(--bg-elevated); --ink: var(--text-primary);`);
    lines.push(`  --muted: var(--text-muted); --line: var(--border-subtle);`);
    lines.push(`  --font-display: ${t.display.stack};`);
    lines.push(`  --font-body: ${t.body.stack};`);
    lines.push(`  --font-mono: ${t.mono.stack};`);
    lines.push(`  --type-ratio: ${t.ratio}; /* ${t.ratioName} */`);
    lines.push(`  --space: ${sp.base}px; --radius: ${rad}px; --radius-ctrl: ${ctrlRad}px;`);
    lines.push(`  --dur: ${g.motion.dur}; --ease: ${g.motion.ease};`);
    lines.push(`  --shadow: ${g.shadow.css};`);
    lines.push(`}`);
    lines.push("");
    lines.push(`${sc} body, ${sc} .df-body {`);
    lines.push(`  background: var(--bg-base); color: var(--text-primary);`);
    lines.push(`  font-family: var(--font-body); font-size: 16px; line-height: 1.55;`);
    if (g.texture.css && !g.texture.css.startsWith("background:")) lines.push(`  ${g.texture.css};`);
    lines.push(`}`);
    if (g.texture.css && g.texture.css.startsWith("background:"))
      lines.push(`${sc} body, ${sc} .df-body { ${g.texture.css}; }`);
    lines.push("");
    lines.push(`${sc} h1, ${sc} h2, ${sc} h3 { font-family: var(--font-display); font-weight: ${t.weightD}; letter-spacing: ${t.trackingD}; line-height: 1.1; margin: 0 0 .5em; }`);
    lines.push(`${sc} h1 { font-size: calc(1rem * pow(var(--type-ratio), 5)); }`);
    lines.push(`${sc} h2 { font-size: calc(1rem * pow(var(--type-ratio), 3)); }`);
    lines.push(`${sc} h3 { font-size: calc(1rem * pow(var(--type-ratio), 2)); }`);
    lines.push(`${sc} .df-label, ${sc} small, ${sc} caption { font-family: var(--font-mono); font-size: .75rem; letter-spacing: ${t.trackingL}; text-transform: uppercase; color: var(--text-muted); }`);
    lines.push(`${sc} code, ${sc} pre { font-family: var(--font-mono); }`);
    lines.push(`${sc} a { color: var(--accent); text-decoration-thickness: 1px; text-underline-offset: 3px; }`);
    lines.push(`${sc} ::selection { background: var(--accent); color: var(--bg); }`);
    lines.push("");
    lines.push(`${sc} .df-card {`);
    lines.push(`  background: var(--bg-elevated);`);
    lines.push(`  padding: calc(var(--space) * 3);`);
    lines.push(`  border-radius: var(--radius);`);
    if (g.border.style !== "none") lines.push(`  border: ${g.border.width}px ${g.border.style} var(--border-subtle);`);
    if (g.shadow.css !== "none") lines.push(`  box-shadow: var(--shadow);`);
    lines.push(`  transition: all var(--dur) var(--ease);`);
    lines.push(`}`);
    lines.push("");
    lines.push(`${sc} .df-btn {`);
    lines.push(`  display: inline-block; padding: calc(var(--space) * 1.5) calc(var(--space) * 3);`);
    lines.push(`  font: 600 .95rem var(--font-body); letter-spacing: .02em;`);
    lines.push(`  border-radius: var(--radius-ctrl); cursor: pointer;`);
    lines.push(`  transition: all var(--dur) var(--ease);`);
    if (g.border.style !== "none") lines.push(`  border: ${g.border.width}px ${g.border.style} var(--border-subtle);`);
    else lines.push(`  border: none;`);
    lines.push(`}`);
    lines.push(`${sc} .df-btn--primary { background: var(--accent); color: var(--accent-fg); ${g.shadow.css !== "none" && g.shadow.name !== "glow" ? "box-shadow: var(--shadow);" : ""} }`);
    lines.push(`${sc} .df-btn--ghost { background: transparent; color: var(--text-primary); border-color: var(--border-subtle); }`);
    lines.push("");
    lines.push(`${sc} .df-input {`);
    lines.push(`  padding: calc(var(--space) * 1.5); width: 100%; box-sizing: border-box;`);
    lines.push(`  font: inherit; color: var(--text-primary); background: var(--bg-elevated);`);
    lines.push(`  border: ${Math.max(1, g.border.width)}px ${g.border.style === "none" ? "solid" : g.border.style} var(--border-subtle);`);
    lines.push(`  border-radius: var(--radius-ctrl);`);
    lines.push(`}`);
    lines.push(`${sc} .df-input:focus-visible, ${sc} .df-btn:focus-visible { outline: 2px solid var(--border-focus); outline-offset: 2px; }`);
    lines.push("");
    lines.push(`${sc} .df-badge {`);
    lines.push(`  font-family: var(--font-mono); font-size: .72rem; letter-spacing: ${t.trackingL}; text-transform: uppercase;`);
    lines.push(`  padding: 3px 10px; border-radius: ${g.key === "soft" || g.key === "vapor" ? "999px" : "var(--radius-ctrl)"};`);
    lines.push(`  border: 1px ${g.border.style === "none" ? "solid" : g.border.style} var(--border-subtle); color: var(--text-muted);`);
    lines.push(`}`);
    lines.push("");
    lines.push(`/* Signature details — ${g.label}: */`);
    for (const s of g.signature) lines.push(`/*  - ${s} */`);
    lines.push(`/* Motion: ${g.motion.dur} ${g.motion.ease}; hover: ${g.motion.hover} */`);
    for (const d of g.donts) lines.push(`/*  ✗ ${d} */`);
    return lines.join("\n");
  }

  function relLum(hex) {
    const { r, g, b } = hexRgb(hex);
    const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  }
  function contrastRatio(a, b) {
    const la = relLum(a), lb = relLum(b);
    const [l1, l2] = la > lb ? [la, lb] : [lb, la];
    return (l1 + 0.05) / (l2 + 0.05);
  }
  /* pick the button label color with the best WCAG contrast: palette ink vs white */
  function bestTextOn(bgHex, inkHex) {
    if (!bgHex || !bgHex.startsWith("#")) return "#ffffff";
    const ink = inkHex && inkHex.startsWith("#") ? inkHex : "#111111";
    let best = ink, bestC = 0;
    for (const c of [ink, "#ffffff", "#111111"]) {
      const cr = contrastRatio(bgHex, c);
      if (cr > bestC) { bestC = cr; best = c; }
    }
    return best;
  }
  function rgbToHex(r, g, b) {
    const f = v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0");
    return "#" + f(r) + f(g) + f(b);
  }
  function mixHex(a, b, t) {
    const A = hexRgb(a), B = hexRgb(b);
    return rgbToHex(A.r + (B.r - A.r) * t, A.g + (B.g - A.g) * t, A.b + (B.b - A.b) * t);
  }
  const hexOnly = c => typeof c === "string" && c.startsWith("#");

  /* map a genome palette onto the semantic token layer required by SKILL.md */
  function semanticTokens(p) {
    return {
      bgBase: p.bg,
      bgSubtle: hexOnly(p.bg) && hexOnly(p.surface) ? mixHex(p.bg, p.surface, 0.5)
        : hexOnly(p.bg) ? shiftL(p.bg, 0.03) : p.surface,
      bgElevated: p.surface,
      textPrimary: p.ink,
      textSecondary: hexOnly(p.ink) && hexOnly(p.muted) ? mixHex(p.ink, p.muted, 0.5) : p.muted,
      textMuted: p.muted,
      borderDim: hexOnly(p.ink) ? rgba(p.ink, 0.12) : p.line,
      borderSubtle: p.line,
      borderFocus: p.accent,
      accent: p.accent,
      accentFg: bestTextOn(p.accent, p.ink),
      accent2: p.accent2,
    };
  }

  function toPrompt(g) {
    const p = g.palette, t = g.type;
    const L = [];
    L.push(`# Design contract: «${g.name}» (${g.label})`);
    L.push(`Seed: ${g.seed}. Reproduce exactly: ` + "`node design-forge.mjs --seed " + g.seed + (g.forcedArchetype ? " --archetype " + g.forcedArchetype : "") + "`");
    L.push("");
    L.push(`You are generating the frontend for this product. Obey this contract literally;`);
    L.push(`it exists so the result does not look like a generic AI template — and so it`);
    L.push(`does not collapse into your default "well-crafted editorial/magazine" taste.`);
    L.push(`The archetype below is the art direction; your own aesthetic preferences are`);
    L.push(`irrelevant here. The result must be recognizable as THIS archetype.`);
    L.push(`Mood: ${g.mood.join(", ")}.`);
    L.push("");
    L.push(`## Palette (${p.scheme})`);
    L.push(`- bg: \`${p.bg}\` · surface: \`${p.surface}\` · ink: \`${p.ink}\` · muted: \`${p.muted}\``);
    L.push(`- accent: \`${p.accent}\` · accent-2: \`${p.accent2}\` · line/border: \`${p.line}\``);
    L.push(`- Rule: accent covers ≤8% of any viewport. Ink/bg pair must stay ≥7:1 contrast.`);
    L.push("");
    L.push(`## Typography — ratio ${t.ratio} (${t.ratioName})`);
    L.push(`- Display: ${t.display.label} — \`${t.display.stack}\`, weight ${t.weightD}, tracking ${t.trackingD}`);
    L.push(`- Body: ${t.body.label} — \`${t.body.stack}\``);
    L.push(`- Mono (labels/code/numbers): \`${t.mono.stack}\``);
    L.push(`- Labels/badges: uppercase, letter-spacing ${t.trackingL}.`);
    L.push("");
    L.push(`## Shape & depth`);
    L.push(`- Radius: ${g.radius.value}px base — ${g.radius.note}`);
    L.push(`- Borders: ${g.border.style === "none" ? "none on surfaces" : `${g.border.width}px ${g.border.style} var(--line)`}`);
    L.push(`- Shadow: ${g.shadow.name}${g.shadow.css !== "none" ? ` — \`${g.shadow.css}\`` : ""}`);
    L.push(`- Texture: ${g.texture.name}`);
    L.push(`- Spacing base: ${g.space.base}px, density ${g.space.density}. All gaps are multiples of the base.`);
    L.push("");
    L.push(`## Motion`);
    L.push(`- Durations ~${g.motion.dur}, easing ${g.motion.ease}.`);
    L.push(`- Hover: ${g.motion.hover}.`);
    L.push("");
    L.push(`## Signature details (implement ALL of them)`);
    for (const s of g.signature) L.push(`- ${s}`);
    L.push("");
    L.push(`## Hard prohibitions`);
    for (const d of g.donts) L.push(`- ${d}`);
    L.push(`- never default to Inter/Roboto + blue-primary + purple-gradient + 12px-radius cards`);
    L.push("");
    L.push(`Before writing markup, restate this contract in one paragraph. If any component`);
    L.push(`temptation conflicts with it, the contract wins.`);
    return L.join("\n");
  }

  function toTailwind(g) {
    const p = g.palette, t = g.type;
    const cfg = {
      theme: {
        extend: {
          colors: (() => {
            const st = semanticTokens(p);
            return {
              "bg-base": st.bgBase, "bg-subtle": st.bgSubtle, "bg-elevated": st.bgElevated,
              "text-primary": st.textPrimary, "text-secondary": st.textSecondary, "text-muted": st.textMuted,
              "border-dim": st.borderDim, "border-subtle": st.borderSubtle, "border-focus": st.borderFocus,
              accent: st.accent, "accent-fg": st.accentFg, "accent-2": st.accent2,
              // legacy aliases
              bg: st.bgBase, surface: st.bgElevated, ink: st.textPrimary, muted: st.textMuted, line: st.borderSubtle,
            };
          })(),
          fontFamily: {
            display: t.display.stack.split(",").map(s => s.trim().replace(/^'(.*)'$/, "$1")),
            body: t.body.stack.split(",").map(s => s.trim().replace(/^'(.*)'$/, "$1")),
            mono: t.mono.stack.split(",").map(s => s.trim().replace(/^'(.*)'$/, "$1")),
          },
          borderRadius: { DEFAULT: g.radius.value + "px", ctrl: Math.round(g.radius.value * 0.6) + "px" },
          boxShadow: { df: g.shadow.css === "none" ? "0 0 0 0 transparent" : g.shadow.css },
          transitionDuration: { df: g.motion.dur },
          transitionTimingFunction: { df: g.motion.ease },
        },
      },
    };
    return `// ${g.name} — ${g.label} (seed: ${g.seed})\n// tailwind.config.js\nmodule.exports = ${JSON.stringify(cfg, null, 2)};`;
  }

  function listArchetypes() {
    return ARCH_KEYS.map(k => ({ key: k, label: ARCHETYPES[k](mulberry32(1)).label }));
  }

  return { generate, toCss, toPrompt, toTailwind, listArchetypes, ARCH_KEYS };
});
