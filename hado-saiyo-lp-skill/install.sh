#!/bin/bash
# HADO自社の採用LPスキル（hado-saiyo-lp）を ~/.claude/skills/hado-saiyo-lp/ に入れる。
#   curl -fsSL https://raw.githubusercontent.com/taiga-hado/hado-skills/main/hado-saiyo-lp-skill/install.sh | bash
set -e
RAW="https://raw.githubusercontent.com/taiga-hado/hado-skills/main/hado-saiyo-lp-skill"
D="$HOME/.claude/skills/hado-saiyo-lp"
mkdir -p "$D/references" "$D/scripts"
for f in SKILL.md rules.md references/facts.md references/rubric.md references/banned.md scripts/check.mjs scripts/shot.mjs scripts/gen_image.py; do
  curl -fsSL "$RAW/$f" -o "$D/$f"
done
chmod +x "$D/scripts/gen_image.py"
command -v node >/dev/null && echo "✔ Node.js あり" || echo "✖ Node.js を入れてください（brew install node）"
[ -x "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ] && echo "✔ Google Chrome あり" || echo "✖ Google Chrome を入れてください（スクショに使います）"
echo "入れました: $D（Claude Codeで「HADOの採用LPを作って」「/hado-saiyo-lp」で使えます）"
