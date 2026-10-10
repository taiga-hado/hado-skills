# Seedance 2.5 シーンプロンプト雛形（英語で書く。セリフだけ日本語）

```
[Generation goal]
Vertical 9:16 Japanese TV-drama scene, <N> seconds, handheld iPhone look, natural real-time performance.
<一文で状況>. Central event: <このシーンの出来事1つ>. No on-screen text, no subtitles, no captions.

[References]
@Image 1 defines <主人公>'s face, <髪>, <服> only. Do not use its background, framing or expression.
@Image 2 defines <説明役>'s face, <髪>, <服>, and <小道具> only. Do not use its background, framing or expression.
@Image 3 defines the location: <場所の要素>. Do not add people from it.
(@Image 4 defines ONLY the content displayed on <人物>'s smartphone screen. It never appears outside the phone screen.)

[Stage 1 | 0-<a>s]
Shot 1: <SIZE> | <ANGLE/HEIGHT> | <OTS> | <MOVE> | <EYELINE> | <FOCUS>   ← templates/camera.md の6項目
Initial state: <誰がどこで何を持っているか>.
Primary event: <出来事1つ。因果の順：接触→動き→知覚>.
End state: <観察できる終了状態>.

[Stage 2 | <a>-<b>s]
Shot 2: <6項目>. Continue from previous: <動作＋表情>.
Shot 3 (reaction, cut while Shot 2's line is still playing): <6項目>. <聞き手の顔に何が起きるか>.
Shot 4: <6項目>. <動作>.
End state: <…>.

[Stage 3 | <b>-<N>s]
Shot 5: extreme close-up … <6項目>. <クライマックス>.
Insert (0.5-1s): <手元・小道具の超アップ、動機となる音>.
End state: <…>.

[Dialogue]
Dialogue language: natural casual Tokyo Japanese, <声の属性：two women's voices in their twenties; A's voice higher and quick, B's lower and calm>, real conversational speed.
Only the speaker's mouth moves; the listener's mouth stays closed.
0-2s <話者>, <感情・動作>: {<セリフ>}
2-4s <話者>, <感情・動作>: {<セリフ>}
…

[Audio]
<環境音> <効果音（事件の音）> No music.

[Camera]
Handheld throughout with subtle micro-shake; the camera stays on one side of the table (180-degree line): <A> is always screen-left looking screen-right at <B>, <B> screen-right looking left. Singles are over-the-shoulder with the listener's shoulder or hair soft in the foreground edge. <強い側> is framed from a low angle, <弱い側> from a slightly high angle; swap when the power flips. Push-ins start on the first word of a key line and stop on its last word. No orbit, no crane, no zoom. Faces fill 50-60% of the frame height in close-ups.

[Performance]
Realistic lip articulation, no exaggerated mouth opening, no head turns while speaking. Never look at the camera; they speak to each other.
Pair each line with one small physical action (<動作を列挙>).

[Maintain consistency]
Exactly <人数> people throughout. Do not swap <A> and <B>. <A> keeps <服・髪>; <B> keeps <服・髪・小道具>.
Same <場所の固定要素> in every shot. Never repeat the same framing twice in a row. No text anywhere in the frame.
```

## 書き方のコツ
- セリフは `{ }`。ブランド名はかな、数字は漢数字（{手取り六百万}）
- 感情は副詞1語＋身体動作1つ（"flat, placing the bag on the table"）
- 秒ブロックは重ねない。1秒に複数の出来事を詰めない
- 最後の行が落ちやすいので、Stage 3 の終わり2秒はセリフなしの余白にする
- 「IN THE DARK」プリセット推薦が返ったら `declined_preset_id: 24bae836-2c4a-48e0-89b6-49fcc0b21612` を付けて再送
