# Установка

Каждый скилл — папка с файлом `SKILL.md`. Положите нужные папки в каталог скиллов вашего агента.

| Агент | В проект | Для всех проектов |
|---|---|---|
| Cursor | `.cursor/skills/` | `~/.cursor/skills/` |
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| Codex CLI | — | `~/.codex/skills/` |

## Один скилл через curl

```bash
BASE=~/.claude/skills   # подставьте нужный путь из таблицы
S=design-system         # имя скилла из README
mkdir -p "$BASE/$S" && curl -fsSL "https://raw.githubusercontent.com/Xhiveee/skills/main/$S/SKILL.md" -o "$BASE/$S/SKILL.md"
```

### Multi-file skills

Некоторые скиллы содержат не только `SKILL.md` — скачайте папку целиком, иначе часть функциональности не установится. Удобнее всего через tarball репозитория (работает без API и токена):

```bash
BASE=~/.claude/skills   # подставьте нужный путь из таблицы
S=design-forge          # имя скилла из README
mkdir -p "$BASE"
curl -fsSL "https://github.com/Xhiveee/skills/archive/refs/heads/main.tar.gz" \
  | tar -xz -C "$BASE" --strip-components=1 "skills-main/$S"
```

## Все скиллы через git

```bash
git clone https://github.com/Xhiveee/skills.git /tmp/skills
for d in /tmp/skills/*/; do [ -f "$d/SKILL.md" ] && cp -r "$d" ~/.cursor/skills/; done   # или другой путь из таблицы
```

## Другие агенты

Если агент не поддерживает скиллы, добавьте содержимое `SKILL.md` в `AGENTS.md` проекта или в системный промпт.

После установки перезапустите агента.
