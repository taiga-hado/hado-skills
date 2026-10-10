# ai-drama — AIドラマ風広告の素材をClaude Codeで作るスキル

HADOの商材向けに、縦型「AIドラマ風広告」（お口の香水／カリカリスリム系）の動画素材を**同一品質**で作るためのClaude Codeスキル。

## 入れ方（1行）
```bash
curl -fsSL https://raw.githubusercontent.com/taiga-hado/hado-skills/main/ai-drama-skill/install.sh | bash
```
Claude Codeを開き直して「/ai-drama ハックツ就職の彼氏マウント型で1本」のように頼む。

## ドライブから入れる場合（zip配布）
1. `ai-drama-skill.zip` をダウンロードして解凍
2. ターミナルで:
```bash
mkdir -p ~/.claude/skills && rm -rf ~/.claude/skills/ai-drama && mv ~/Downloads/ai-drama-skill ~/.claude/skills/ai-drama
```
3. Claude Code を開き直す（起動中なら一度終了）→「/ai-drama ハックツ就職の◯◯型で1本」

## 必要なもの
- Claude Code ＋ **Higgsfield MCP**（Seedance 2.5が使えるプラン。1本≒340クレジット≒1,700円）
- `~/.zshrc` に `OPENAI_API_KEY`（参照画像の生成とWhisperでの検品）
- ffmpeg、python3（Pillow）

## 何が固定されていて、何を決めるのか
固定：台本の7ビート、テンポ（13字以内・3シーン48秒）、プロンプト構造、参照画像の作法、検品手順、納品形式（テキストなし）。
決める：商材／訴求仮説A・B／シナリオ型／登場人物／舞台 の5つと、セリフの言い回し。

## 中身
`SKILL.md`（手順）／`products/`（商材YAML）／`templates/`（台本の型・プロンプト雛形）／`refs/`（共有の人物・場所画像）／`scripts/`（参照画像生成・検品・連結）／`examples/`（通った台本とプロンプト全文、調査メモ）

ルールを変えるときは `SKILL.md` と `templates/` を直してpushする。開発の経緯と失敗の記録は `ai-drama-ad/docs/`。
