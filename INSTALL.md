# Установка

Каждый скилл — это папка с файлом `SKILL.md` (`full-cycle-website`, `design-system`). Положите нужные папки в каталог скиллов вашего агента.

| Агент | В проект | Для всех проектов |
|---|---|---|
| Cursor | `.cursor/skills/` | `~/.cursor/skills/` |
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| Codex CLI | — | `~/.codex/skills/` |

## Через curl

```bash
BASE=~/.claude/skills   # подставьте нужный путь из таблицы
for s in full-cycle-website design-system; do
  mkdir -p "$BASE/$s" && curl -fsSL "https://raw.githubusercontent.com/Xhiveee/web-skill/main/$s/SKILL.md" -o "$BASE/$s/SKILL.md"
done
```

## Через git

```bash
git clone https://github.com/Xhiveee/web-skill.git /tmp/web-skill
cp -r /tmp/web-skill/full-cycle-website /tmp/web-skill/design-system ~/.cursor/skills/   # или другой путь из таблицы
```

## Другие агенты

Если агент не поддерживает скиллы, добавьте содержимое `SKILL.md` в `AGENTS.md` проекта или в системный промпт.

После установки перезапустите агента и попросите, например: «Сделай дизайн по скиллу design-system, потом сайт по full-cycle-website».
