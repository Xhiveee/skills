"""Semantic color tokens for office-forge documents.

Copy this file into the working dir, then DERIVE the values from the brief —
the literals below are placeholders for structure, not a theme to reuse.

Roles (name them in your generator, reuse everywhere):
  BG      page/slide background
  SURF    card / panel fill
  SURF2   alternate fill (secondary cards, zebra rows)
  LINE    hairlines, borders
  TXT     primary text
  MUT     secondary text, captions
  ACC     the one accent: kickers, numbers, key state
  ACC_DIM muted accent: secondary highlights, accent-tinted surfaces
  STR     (optional) string/code highlight inside code blocks

Decide per brief: dark base (screens, cinematic decks) vs light base
(print, long-form reading). One accent unless the brief argues otherwise.
"""

BG, SURF, SURF2 = "0A0A0A", "141414", "1C1C1C"
LINE = "2A2A2A"
TXT, MUT = "F2F2F2", "8C8C8C"
ACC, ACC_DIM = "C8FF3D", "3A4A12"
STR = "E6DB74"
