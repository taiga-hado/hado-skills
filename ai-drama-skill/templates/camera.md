# カメラの文法 — 「ドラマらしさ」はここで決まる（2026-10-06）

参考広告（お口の香水01/05・寿司06）のコマ分解と、縦型ショートドラマの撮影セオリー
（[パンダ監督](https://note.com/producer_kujo/n/n6e1726b48734)、[TikTok公式](https://note.com/tiktok/n/n704c808ecbb7)、[Seedance 2.5カメラ言語](https://learn.rundiffusion.com/seedance-2-5-prompt-guide/)）から抽出。

## 自作v4と優れたドラマCRの差分（6つ）

| 項目 | v4までの自作 | 優れたドラマCR |
|---|---|---|
| 奥行き | 「medium two-shot」「close-up」とサイズしか書かない。人物が横並び | **Z軸**。寄りは必ず**肩越し**（聞き手の肩・髪が手前にボケて入る）。ツーショットも手前と奥に人物を置く |
| 力関係 | カメラの高さ無指定（全部アイレベル） | 強い側は**ローアングル**で見上げ、弱い側は**やや上から**見下ろす。マウント返しで**高さを入れ替える** |
| リアクション | 話者の寄りだけを順番に映す | 相手が話している**最中に聞き手の顔に切る**（刺さった瞬間の顔）。ドラマは聞き手の顔で起きる |
| 寄りの深さ | 「close-up」止まり | 顔が画面の高さの5〜6割。クライマックスは**頭が見切れる超アップ** |
| 動きの動機 | 「handheld」「slow push-in」を漠然と | 寄りは**決め台詞の頭で始まり最後の語で止まる**。事件の瞬間は**カメラが揺れる**。それ以外は手持ちの微揺れだけ |
| インサート | なし | 1シーンに1つ、0.5〜1秒の**手元・小道具の超アップ**（バッグの錠前、グラスを握る指、滑るスマホ）。音と一緒に |

加えて **視線の軸（180度ルール）**：カメラはテーブルの片側に留まる。Aは常に画面左で右を見る、Bは画面右で左を見る。これが崩れると会話に見えない。

## 1ショットは必ず6項目で書く

```
Shot <n> (<秒>): <SIZE> | <ANGLE/HEIGHT> | <OTS 手前に誰の何> | <MOVE 動機つき> | <EYELINE> | <FOCUS>
```
| 項目 | 語彙 |
|---|---|
| SIZE | wide two-shot / medium two-shot (depth: X nearer) / medium close-up / close-up (face fills 50-60% of frame height) / extreme close-up (eyes and mouth, top of head cropped) / insert |
| ANGLE/HEIGHT | eye level / low angle looking up at X / slightly high angle looking down at Y / 45-degree three-quarter |
| OTS | over Y's blurred shoulder and hair on the left edge / Y's teacup soft in the foreground / none |
| MOVE | handheld hold with micro-shake / slow push-in that starts on "{最初の語}" and stops on the last word / camera shudders on the thud / quick reframe toward X / rack focus from the phone to X's face |
| EYELINE | X looks screen-right at Y (never at the lens) / eyes down on the phone / glances up to check Y |
| FOCUS | shallow depth of field, background soft / deep enough to read the table |

## 7ビートとカメラの対応（既定値。迷ったらこれ）

| ビート | ショット |
|---|---|
| 1 事件 | medium two-shot with depth → 事件の瞬間に **camera shudders**、直後に被害側の close-up（やや上から） |
| 2 指摘 | 強い側 OTS close-up（ローアングル）→ 弱い側 OTS close-up（やや上から）→ **指摘の最中に聞き手へ切る** |
| 3 商品提示 | insert（スマホを滑らせる／画面）→ 説明役 medium close-up、push-in は商品名の頭で開始 |
| 4 疑い→権威 | 疑う側 close-up 腕組み → 答える側 OTS close-up、答えの最後の語で push-in 停止 |
| 5 無料!? | **extreme close-up**、頭見切れ、quick reframe |
| 6 希少性 | 説明役が身を乗り出す close-up、小声、カメラはほぼ静止 |
| 7 無言の行動 | insert（テーブル下の手元・スマホ）で切る |

## 禁止
- 横並びのツーショット（奥行きなし）／全員アイレベル／寄りに手前の肩が無い
- 同じサイズを2回続ける／3ショット全部が同じ高さ
- orbit・crane・drone など「ドラマで使わない動き」／ズームレンズ的なズーム
- 「Static camera」（止まって見える）。手持ちの微揺れは常に入れる
- カメラ目線
