---
name: minecraft-builder
description: >-
  Generate valid Sponge Schematic v2 (.schem) files programmatically for
  WorldEdit, Litematica, or any schem-compatible tool. Use whenever a task
  needs an agent to produce a Minecraft structure as a schematic file —
  buildings, pixel art, redstone-friendly shells, exported scene — without
  launching the game. Verification and pasting are done manually by the user.
---

# Minecraft schematic generator

Produces real `.schem` files (Sponge Schematic v2, gzip NBT) from code — no Minecraft instance, Forge, Java, or WorldEdit needed on the agent side. The user pastes/evaluates them manually in game with WorldEdit (`//schem load <name>` then `//paste`) or Litematica.

## Workflow

1. Author a `.build` blueprint (or generate it with a script — see below).
2. Convert: `python build2schem.py <file>.build [out.schem]`
3. Deliver the `.schem` to the user (goes into `<worldedit>/schematics/`).

## Blueprint DSL (`.build`)

One instruction per line; `#` comments and blank lines allowed.

```
origin X Y Z            # optional, recorded as the schem's Offset
@player                 # ignored on export (paste-anchored instead)
DX DY DZ [namespace:]block
```

- `DX DY DZ` are offsets from the origin (may be negative); later lines overwrite earlier ones at the same cell.
- `block` is a registry name; `stone` = `minecraft:stone`.
- Default block states only — no stair orientation, no pane connections, no block entities. Design around it (use `minecraft:glass` blocks for windows).

## Generating blueprints

Write small Python generators, don't hand-type coordinates:

```python
lines = ["# my house", "@player"]
for dx in range(-3, 4):
    for dz in range(-3, 4):
        lines.append(f"{dx} 4 {dz} minecraft:oak_planks")  # roof slab
open("house.build", "w").write("\n".join(lines) + "\n")
```

## build2schem.py

Stdlib-only, ~120 lines, writes NBT by hand. Ships next to this `SKILL.md` in the same folder — resolve the directory containing the skill file and run `python build2schem.py` from there. Full source below for reference/repair. Verify output with `nbtlib` (`pip install nbtlib`): root must be a compound named `Schematic` with `Version=2`, `Palette`, `BlockData` (varint indices, order `(y*Length + z)*Width + x`), `Width/Height/Length` shorts, `Offset` int array.

```python
#!/usr/bin/env python3
"""Convert an mcbuilder .build blueprint into a Sponge Schematic v2 (.schem).

Usage: python build2schem.py house.build [house.schem]
"""
import gzip
import re
import struct
import sys


def parse_blueprint(path):
    blocks = []
    with open(path) as f:
        for raw in f:
            line = raw.strip()
            if not line or line.startswith("#"):
                continue
            if line.lower().startswith("origin ") or line.lower() == "@player":
                continue
            parts = line.split()
            if len(parts) != 4:
                continue
            dx, dy, dz = (int(p) for p in parts[:3])
            name = parts[3] if ":" in parts[3] else "minecraft:" + parts[3]
            blocks.append((dx, dy, dz, name))
    return blocks


def tag(t, name, payload):
    return bytes([t]) + struct.pack(">H", len(name)) + name.encode() + payload


def tag_string(name, s):
    b = s.encode()
    return tag(8, name, struct.pack(">H", len(b)) + b)


def tag_int(name, v):
    return tag(3, name, struct.pack(">i", v))


def tag_short(name, v):
    return tag(2, name, struct.pack(">h", v))


def tag_int_array(name, vals):
    return tag(11, name, struct.pack(">i", len(vals)) + b"".join(struct.pack(">i", v) for v in vals))


def tag_byte_array(name, data):
    return tag(7, name, struct.pack(">i", len(data)) + data)


def tag_compound(name, payload):
    return tag(10, name, payload + b"\x00")


def tag_list_compound(name, items):
    return tag(9, name, bytes([10]) + struct.pack(">i", len(items)) + b"".join(items))


def varint(v):
    out = bytearray()
    while True:
        b = v & 0x7F
        v >>= 7
        if v:
            out.append(b | 0x80)
        else:
            out.append(b)
            return bytes(out)


def build_schem(blocks, meta_name):
    if not blocks:
        raise SystemExit("no blocks in blueprint")
    xs = [b[0] for b in blocks]
    ys = [b[1] for b in blocks]
    zs = [b[2] for b in blocks]
    minx, miny, minz = min(xs), min(ys), min(zs)
    w = max(xs) - minx + 1
    h = max(ys) - miny + 1
    l = max(zs) - minz + 1

    palette = {"minecraft:air": 0}
    cells = [b"\x00"] * (w * h * l)
    for dx, dy, dz, name in blocks:
        if name not in palette:
            palette[name] = len(palette)
        idx = (dy - miny) * l * w + (dz - minz) * w + (dx - minx)
        cells[idx] = varint(palette[name])
    block_data = b"".join(cells)

    pal_payload = b"".join(tag_int(k, v) for k, v in palette.items())
    metadata = (
        tag_string("Name", meta_name)
        + tag_string("Author", "mcbuilder")
    )

    payload = (
        tag_int("Version", 2)
        + tag_int("DataVersion", 3465)  # MC 1.20.1
        + tag_compound("Metadata", metadata)
        + tag_short("Width", w)
        + tag_short("Height", h)
        + tag_short("Length", l)
        + tag_int_array("Offset", [minx, miny, minz])
        + tag_int("PaletteMax", len(palette))
        + tag_compound("Palette", pal_payload)
        + tag_byte_array("BlockData", block_data)
        + tag_list_compound("BlockEntities", [])
        + tag_list_compound("Entities", [])
    )
    return tag_compound("Schematic", payload)


def main():
    src = sys.argv[1]
    dst = sys.argv[2] if len(sys.argv) > 2 else re.sub(r"\.build$", "", src) + ".schem"
    blocks = parse_blueprint(src)
    nbt = build_schem(blocks, re.sub(r".*[\\/]", "", dst))
    with gzip.open(dst, "wb") as f:
        f.write(nbt)
    print(f"wrote {dst}: {len(blocks)} blocks")


if __name__ == "__main__":
    main()
```

## Format notes

- Root compound is named `Schematic`; `DataVersion` 3465 matches MC 1.20.1 (adjust per target version).
- `PaletteMax` = palette size; index 0 must be `minecraft:air`.
- `BlockData` is a byte array of **varint**-encoded palette indices (a value >127 occupies 2+ bytes — length of BlockData is not necessarily W*H*L).
- Validation: `nbtlib.load()` must parse it; a 7x6x7 house test file pasted correctly in game.

## Out of scope

- Running Minecraft / pasting in world — the user verifies manually.
- The `mcbuilder` auto-build mod and any in-game automation: deliberately removed per user preference.
