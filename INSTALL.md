# Installation

Each skill is a folder containing a `SKILL.md` file. Copy the folders you need into your agent's skills directory.

| Agent | Per project | All projects |
|---|---|---|
| Cursor | `.cursor/skills/` | `~/.cursor/skills/` |
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| Codex CLI | — | `~/.codex/skills/` |

## One skill via curl

```bash
BASE=~/.claude/skills   # pick the path you need from the table
S=design-system         # skill name from the README
mkdir -p "$BASE/$S" && curl -fsSL "https://raw.githubusercontent.com/Xhiveee/skills/main/$S/SKILL.md" -o "$BASE/$S/SKILL.md"
```

## All skills via git

```bash
git clone https://github.com/Xhiveee/skills.git /tmp/skills
for d in /tmp/skills/*/; do [ -f "$d/SKILL.md" ] && cp -r "$d" ~/.cursor/skills/; done   # or another path from the table
```

## Other agents

If your agent doesn't support skills, paste the contents of `SKILL.md` into the project's `AGENTS.md` or into the system prompt.

Restart the agent after installing.
