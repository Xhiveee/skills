# Установка

Скилл — это папка `full-cycle-website` с файлом `SKILL.md`. Положите её в каталог скиллов вашего агента.

| Агент | В проект | Для всех проектов |
|---|---|---|
| Cursor | `.cursor/skills/` | `~/.cursor/skills/` |
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| Codex CLI | — | `~/.codex/skills/` |

## Через curl

```bash
DIR=~/.claude/skills/full-cycle-website   # подставьте нужный путь из таблицы
mkdir -p "$DIR" && curl -fsSL https://raw.githubusercontent.com/Xhiveee/web-skill/main/full-cycle-website/SKILL.md -o "$DIR/SKILL.md"
```

## Через git

```bash
git clone https://github.com/Xhiveee/web-skill.git /tmp/web-skill
cp -r /tmp/web-skill/full-cycle-website ~/.cursor/skills/   # или другой путь из таблицы
```

## Другие агенты

Если агент не поддерживает скиллы, добавьте содержимое `SKILL.md` в `AGENTS.md` проекта или в системный промпт.

После установки перезапустите агента и попросите, например: «Сделай сайт под ключ по скиллу full-cycle-website».
