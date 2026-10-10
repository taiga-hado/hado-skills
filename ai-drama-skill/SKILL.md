---
name: ai-drama
description: |
  HADOの商材（ハックツ就職・ハックツ新卒など）向けに、縦型「AIドラマ風広告」の動画素材を同一品質で作るスキル。
  「AIドラマ広告」「ドラマ風の広告素材」「ショートドラマのCR」「会話劇の広告」「/ai-drama」と言われたら必ずこのスキルを使う。
  Seedance 2.5（Higgsfield MCP）にセリフを渡してネイティブ日本語音声・口の動き・カット割りを同時生成し、
  1生成=1シーン3ショット（10〜20秒）×3本を連結する。TTSの別撮り・1セリフ1ショットの細切れ・テキスト焼き込みはしない。
---

# AIドラマ風広告（ai-drama）

参考＝「お口の香水」「カリカリスリム」系の縦型ドラマ広告。**台本を7ビートの型で書き、Seedance 2.5にセリフごと渡して3生成で作る。**
人が決めるのは5つの入力とセリフの言い回しだけ。それ以外はこのスキルの型に従う。

## 0. 環境確認（最初に必ず）

このスキルのフォルダ（`SKILL.md` のある場所。以下 `$SKILL`）の中身：

| ファイル | 用途 |
|---|---|
| `products/*.yaml` | 商材定義（痛み・訴求仮説A/B・実績数字・NGワード）。商材を増やすときはここに1枚足す |
| `templates/beats.md` | 台本の型（7ビート・フック・結末・テンポの数値基準） |
| `templates/prompt_scene.md` | Seedance 2.5 のシーンプロンプト雛形 |
| `templates/camera.md` | **カメラの文法**（Z軸・肩越し・力関係の高さ・リアクション・超アップ・インサート・180度）。ドラマらしさはここで決まる |
| `templates/reference_prompts.md` | 参照画像（人物・場所）を gpt-image-2 で作る雛形 |
| `refs/*.jpg` | 共有の参照画像ライブラリ（レナ・アヤカ・ユイ・ミカ・男／ラウンジ・居酒屋室内・居酒屋外／LPスクショ）。**同じ人物を使い回す** |
| `scripts/make_refs.py` | 新しい人物・場所の参照画像を作る |
| `scripts/check_clip.py` | 生成クリップの検品（コマ分解＋Whisperで全行発話チェック） |
| `scripts/assemble.py` | 3シーンを連結してmp4に（テキストなし・音量正規化） |
| `examples/` | 通った台本とプロンプトの全文（彼氏マウント／合コンの修羅場）と調査メモ |

必要なもの。無ければ入れる／無い場合はユーザーに伝える：
```bash
# Higgsfield MCP（Seedance 2.5）が使えるか → ツール一覧に generate_video / media_upload があるか確認
grep -c OPENAI_API_KEY ~/.zshrc        # gpt-image-2（参照画像）と Whisper（検品）に使う
which ffmpeg || brew install ffmpeg
python3 -c "import PIL" || pip3 install --user pillow
```
Higgsfieldのクレジットは各自のアカウントで消費される。**1本（3生成）で約340クレジット＝約1,700円。** 開始前に `balance` で残高を見る。

## 1. 入力は5つだけ（1回で聞く）

1. **商材**：`products/` から選ぶ（例：hackz-shushoku）
2. **訴求仮説**：A=求人サイト否定／B=担当者ガチャ否定。**1本に1つ。混ぜない**
3. **シナリオ型**：修羅場（マウント）／家族／覗き見／年上年下
4. **登場人物**：主人公（悩み側）と説明役（成功側）の属性。refs/ の既存人物を使えるならそれを使う
5. **舞台**：ラウンジ／居酒屋／カフェ など。refs/ に無人画像があればそれ

ユーザーが「すぐ作って」と言ったら、台本提示と制作を同時に進めてよい。

## 2. 台本を書く（`templates/beats.md` に従う）

守ること（破ると参考広告との差が一気に開く）：
- **冒頭3秒は事件**（グラスの水をかける／バッグをドンと置く／全員が振り向く）。説明や日常会話で始めない
- **1セリフ13字以内**、全体19〜22セリフ、約48秒。参考の実測＝1本1.4〜2秒・10〜13字
- 商品を説明するのは**必ず説明役**。主人公が自分で宣伝しない。説明も**相手に向かって**話す（カメラ目線なし）
- 「1,000人から1人」「事前に希望を聞く」「変更できる」「企業が払う」など**仕組みの説明は入れない**
- 権威は説明役の実体験1行（「紹介された会社が今の会社」）。数字は商材YAMLの範囲内
- **結末は「無料!?」→希少性の一言→無言の行動**で切る。後日談・余韻セリフ・エンドカードなし
- ブランド名は**かな**で書く（{ハックツしゅうしょく}）。数字は漢数字（六百万・五十社）
- 3シーンに割る：Scene1 フック10秒／Scene2 対峙18秒／Scene3 提示〜締め20秒

台本は `examples/05_彼氏マウント_台本.md` の表形式（#／絵／話者／セリフ）で出し、ユーザーのOKをもらう。

## 3. 参照画像を揃える

- 人物：**1人1枚、無地グレー背景の半身ポートレート**（服・髪・小道具が見える）。refs/ にあれば再利用。無ければ `scripts/make_refs.py` に `templates/reference_prompts.md` の雛形で作る
- 場所：**無人**の画像1枚。「no people at all」を必ず書く
- スマホ画面に出すLP：モバイル幅のスクショ（refs/lp_hackz-shushoku.jpg）。他商材は headless Chrome で撮る：
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --window-size=520,1000 --force-device-scale-factor=2 --screenshot=lp.png URL`
- 1プロンプトに人物は**2〜3人まで**。参照は増やすほど不安定になる

## 4. Higgsfieldにアップロード

`media_upload`（filesで複数）→ 返ってきた `upload_url` に `curl -X PUT -H "Content-Type: image/jpeg" --data-binary @file` → `media_confirm`（type image）。
**medias に並べた順が @Image 1, 2, 3… になる。** プロンプト内の番号と必ず合わせる。

## 5. シーンプロンプトを書く（`templates/prompt_scene.md`）

必須ブロック：`[Generation goal]`→`[References]`（役割＋**除外**を1文で）→`[Stage n | 秒]`（初期状態／主要な出来事1つ／終了状態）→`[Dialogue]`（言語・声質・秒・話者・感情・`{セリフ}`）→`[Audio]`（`<環境音>` のあと `No music.`）→`[Performance]`→`[Maintain consistency]`。
- 「Only the speaker's mouth moves; the listener's mouth stays closed」「Never look at the camera」「No on-screen text, no subtitles, no captions」「Never repeat the same framing twice in a row」を毎回入れる
- 感情は副詞でなく**身体動作1つ**を対にする（身を乗り出す／指でなぞる／紅茶を一口）
- **全ショットを `templates/camera.md` の6項目（SIZE／ANGLE・HEIGHT／OTS／MOVE／EYELINE／FOCUS）で書く**。寄りは肩越し、強い側はローアングル、相手が話している最中に聞き手へ切る、1シーン1インサート、クライマックスは頭見切れの超アップ
- `[Camera]` ブロック（180度ルール・手持ち微揺れ・push-inの開始語と停止語）を毎回入れる

## 6. 生成（Seedance 2.5）

```
generate_video_batch または generate_video
  model: seedance_2_5 / mode: omni_reference / aspect_ratio: 9:16 / resolution: 720p
  generate_audio: true / duration: シーン秒数 / use_unlim: false
  medias: [{role:"image_references", value:<id>}, ...]   ← 順番=@Image番号
  declined_preset_id: "24bae836-2c4a-48e0-89b6-49fcc0b21612"   ← 「IN THE DARK」プリセット推薦を抑止
```
3シーン同時に投げてよい（並列8本まで）。1本5〜8分。`jobs_wait` で待つ。7クレジット/秒。

## 7. 検品（必ずやる。ここで品質が決まる）

各シーンをダウンロードして `python3 $SKILL/scripts/check_clip.py gen/sceneX.mp4`：
- コマ分解画像を **Readで開いて目視**：人物が入れ替わっていないか／小道具（バッグ・スマホ画面）が合っているか／カメラ目線になっていないか／同じ構図が続いていないか
- Whisperの書き起こしで**台本の全行が発話されているか**。最後の行が尺に入らず落ちることがある → 行を減らすか尺を伸ばして**そのシーンだけ**再生成
- ブランド名の読み違い（就職→昼食）は耳で確認を依頼
- 再生成は1シーン2回まで。3回目はユーザーに相談（プロの作例でも1本に100生成かける世界。1発で決まる前提を捨てる）

## 8. 連結して納品

`python3 $SKILL/scripts/assemble.py`（gen/sceneA.mp4, sceneB.mp4, sceneC.mp4 → final.mp4。テキストなし・loudnorm -14LUFS）。
納品物：連結mp4＋シーン別mp4（編集で差し替えられるように）。字幕・タイトル・LPのインサートは**編集側で入れる**ので焼かない。
`SendUserFile` で送り、「気になるシーンの番号を言ってもらえればそこだけ撮り直す」と添える。

## 9. やってはいけないこと（全部、実際に失敗した）

- TTSで別撮りして口を合わせる（v1/v2。不自然で却下）
- 1セリフ1ショットの細切れ（22ショットを4秒クリップで作る。紙芝居になる）
- 説明役がカメラに向かって話す
- 「Static camera」と書く（止まって見える）
- 1枚絵を10秒以上持たせる
- 仕組みの説明セリフ、後日談、文字のエンドカード
- 感情を[angry]のようなタグや副詞だけで書く
- 参照画像に背景込みの写真を使う（構図を持ち込まれる）。人物は無地背景、場所は無人で

## 10. コスト目安（Ultra年払い＝1クレジット約5円）

| 単位 | クレジット | 円 |
|---|---|---|
| Seedance 2.5 1秒 | 7 | 約35 |
| 1本（10+18+20秒） | 336 | 約1,700 |
| 1シーン撮り直し | 70〜140 | 350〜700 |
| 参照画像1枚（gpt-image-2） | — | 約30 |
