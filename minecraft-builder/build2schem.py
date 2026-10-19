#!/usr/bin/env python3
"""Write Minecraft structures as Sponge Schematic v2 (.schem) from Python.

Usage:
    from build2schem import write_schem
    blocks = [(dx, dy, dz, "minecraft:stone"), ...]  # coords relative to origin
    write_schem(blocks, "house.schem", origin=(0, 0, 0))

Output is gzip NBT loadable by WorldEdit (//schem load) and Litematica.
"""
import gzip
import os
import struct


# --- minimal NBT writer (big-endian, Java edition) ---
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
    # items: list of compound payloads (each already ending without the extra 0)
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


def build_schem(blocks, meta_name, origin=(0, 0, 0)):
    if not blocks:
        raise SystemExit("no blocks given")
    xs = [b[0] for b in blocks]
    ys = [b[1] for b in blocks]
    zs = [b[2] for b in blocks]
    minx, miny, minz = min(xs), min(ys), min(zs)
    w = max(xs) - minx + 1
    h = max(ys) - miny + 1
    l = max(zs) - minz + 1

    palette = {"minecraft:air": 0}
    data = bytearray(w * h * l)  # index 0 = air
    # varints can exceed 1 byte; collect as list of bytes per cell
    cells = [b"\x00"] * (w * h * l)
    for dx, dy, dz, name in blocks:
        if ":" not in name:
            name = "minecraft:" + name
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
        + tag_int_array("Offset", [minx + origin[0], miny + origin[1], minz + origin[2]])
        + tag_int("PaletteMax", len(palette))
        + tag_compound("Palette", pal_payload)
        + tag_byte_array("BlockData", block_data)
        + tag_list_compound("BlockEntities", [])
        + tag_list_compound("Entities", [])
    )
    return tag_compound("Schematic", payload)


def write_schem(blocks, path, origin=(0, 0, 0), name=None):
    nbt = build_schem(blocks, name or os.path.basename(path), origin)
    with gzip.open(path, "wb") as f:
        f.write(nbt)
    print(f"wrote {path}: {len(blocks)} blocks")
