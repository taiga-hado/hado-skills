#!/bin/bash
# AIドラマ風広告スキル（ai-drama）を自分のMacのClaude Codeに入れる。
#   curl -fsSL https://raw.githubusercontent.com/taiga-hado/hado-skills/main/ai-drama-skill/install.sh | bash
set -e
REPO_RAW="https://raw.githubusercontent.com/taiga-hado/hado-skills/main/ai-drama-skill"
DEST="$HOME/.claude/skills/ai-drama"
echo "▶ ai-drama スキルを $DEST に入れます"
mkdir -p "$DEST/products" "$DEST/templates" "$DEST/scripts" "$DEST/examples" "$DEST/refs"
for f in SKILL.md README.md; do curl -fsSL "$REPO_RAW/$f" -o "$DEST/$f"; done
for f in hackz-shushoku.yaml hackz-shinsotsu.yaml; do curl -fsSL "$REPO_RAW/products/$f" -o "$DEST/products/$f"; done
for f in beats.md prompt_scene.md reference_prompts.md; do curl -fsSL "$REPO_RAW/templates/$f" -o "$DEST/templates/$f"; done
for f in make_refs.py check_clip.py assemble.py subs_from_audio.py; do curl -fsSL "$REPO_RAW/scripts/$f" -o "$DEST/scripts/$f"; done
for f in 05_彼氏マウント_台本.md 05_彼氏マウント_生成メモ.md 01_合コンの修羅場_prompts.md 調査_自然に作る手法.md; do curl -fsSL "$REPO_RAW/examples/$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$f")" -o "$DEST/examples/$f"; done
for f in rena ayaka yui mika man lounge izakaya_room izakaya_street lp_hackz-shushoku; do curl -fsSL "$REPO_RAW/refs/$f.jpg" -o "$DEST/refs/$f.jpg"; done
chmod +x "$DEST/scripts/"*.py
echo "✔ スキル本体を配置しました"
which ffmpeg >/dev/null 2>&1 && echo "✔ ffmpeg あり" || echo "✖ ffmpeg がありません：brew install ffmpeg"
python3 -c "import PIL" 2>/dev/null && echo "✔ Pillow あり" || pip3 install --user pillow >/dev/null 2>&1 && echo "✔ Pillow を入れました"
grep -q OPENAI_API_KEY ~/.zshrc 2>/dev/null && echo "✔ OPENAI_API_KEY あり" || echo "✖ ~/.zshrc に OPENAI_API_KEY がありません（参照画像とWhisper検品に必要）"
echo ""
echo "Higgsfield MCP（Seedance 2.5）がClaude Codeに接続されていることを確認してください。"
echo "完了。Claude Code を開き直して「/ai-drama ハックツ就職の◯◯型で1本」と頼めば使えます。"
