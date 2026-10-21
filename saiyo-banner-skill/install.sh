#!/bin/bash
# 採用バナー作成スキルを ~/.claude/skills/saiyo-banner/ に入れる
set -e
D="$HOME/.claude/skills/saiyo-banner"; mkdir -p "$D"
curl -fsSL https://raw.githubusercontent.com/taiga-hado/hado-skills/main/saiyo-banner-skill/SKILL.md -o "$D/SKILL.md"
echo "入れました: $D（Claude Codeで「採用バナー作って」で使えます）"
