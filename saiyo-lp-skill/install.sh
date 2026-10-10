#!/bin/bash
# 採用LPスキル（saiyo-lp）を自分のMacのClaude Codeに入れる。
#   curl -fsSL https://raw.githubusercontent.com/taiga-hado/hado-skills/main/saiyo-lp-skill/install.sh | bash
set -e
RAW="https://raw.githubusercontent.com/taiga-hado/hado-skills/main/saiyo-lp-skill"
DEST="$HOME/.claude/skills/saiyo-lp"
echo "▶ saiyo-lp スキルを $DEST に入れます"
mkdir -p "$DEST/references" "$DEST/scripts" "$DEST/examples/hado-kensetsu/images" "$DEST/examples/hado-kensetsu/mocks"
for f in SKILL.md rules.md README.md references/hearing.md references/structure.md references/design-rules.md references/banned.md references/rubric.md scripts/gen_image.py scripts/shot.mjs \
  examples/hado-kensetsu/OFFER.md examples/hado-kensetsu/DESIGN.md examples/hado-kensetsu/index.html examples/hado-kensetsu/review.md \
  examples/hado-kensetsu/images/hero.jpg examples/hado-kensetsu/images/drawing.jpg examples/hado-kensetsu/images/morning.jpg examples/hado-kensetsu/images/office.jpg; do
  curl -fsSL "$RAW/$f" -o "$DEST/$f"
done
chmod +x "$DEST/scripts/gen_image.py"
[ -x "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ] && echo "✔ Google Chrome あり" || echo "✖ Google Chrome を入れてください（スクショに使います）"
command -v node >/dev/null && echo "✔ Node.js あり" || echo "✖ Node.js を入れてください（brew install node）"
grep -q OPENAI_API_KEY ~/.zshrc 2>/dev/null && echo "✔ OPENAI_API_KEY あり" || echo "✖ ~/.zshrc に export OPENAI_API_KEY=... を足してください（gpt-image-2 に使います）"
echo ""
echo "完了。Claude Code で「〇〇社の採用LPを作って」「/saiyo-lp」と頼めば使えます。"
