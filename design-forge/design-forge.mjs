#!/usr/bin/env node
/* design-forge — seeded generator of opinionated frontend design systems.
   Usage:
     node design-forge.mjs                     # random genome → prompt
     node design-forge.mjs --seed 42           # reproducible
     node design-forge.mjs --seed x --format css|tailwind|json|prompt
     node design-forge.mjs --archetype lux     # force a family
     node design-forge.mjs --list              # archetypes
*/
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const DF = require("./engine.js");

const args = process.argv.slice(2);
const opt = {};
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--list") opt.list = true;
  else if (a.startsWith("--")) opt[a.slice(2)] = args[i + 1] && !args[i + 1].startsWith("--") ? args[++i] : true;
}

if (opt.list) {
  for (const a of DF.listArchetypes()) console.log(`  ${a.key.padEnd(10)} ${a.label}`);
  process.exit(0);
}

const g = DF.generate(opt.seed, { archetype: opt.archetype });
const fmt = opt.format || "prompt";
if (opt.out) {
  const { writeFileSync } = await import("fs");
  writeFileSync(opt.out, emit(fmt, g));
  console.log(`written: ${opt.out} (${g.name} — ${g.label}, seed ${g.seed})`);
} else {
  console.log(emit(fmt, g));
}

function emit(fmt, g) {
  switch (fmt) {
    case "css": return DF.toCss(g);
    case "tailwind": return DF.toTailwind(g);
    case "json": return JSON.stringify(g, null, 2);
    case "prompt": default: return DF.toPrompt(g);
  }
}
