---
name: hado-saiyo-lp
description: |
  株式会社HADO「自社」の採用LP（hado-recruit.vercel.app/lp/<slug>）を新しく作るスキル。
  「HADOの採用LP」「自社採用のLP」「hado-recruitに新しいLP」「〇〇職のHADO採用LP」「/lp/〇〇を作って」「/hado-saiyo-lp」と言われたら必ずこのスキルを使う。
  手本は /lp/video-creator-tiktok（HADOコーポレートサイトのトーン・LP内応募フォーム→その場で面談予約）。
  LP内応募フォーム（/apply.js）・lps.js 登録・管理画面の流入URL/面談担当/フォーム設定まで含めて公開する。
  ※ 他社（チョクサイ等の直採クライアント）の採用LPは saiyo-lp スキルを使う。こちらは使わない。
---

# HADO自社採用LPスキル（hado-saiyo-lp）

HADO自社の採用LPだけを作る。**他社の採用LPは `saiyo-lp`**（会社ごとにデザインをゼロから決める）。
こちらはデザインと仕組みが決まっていて、**職種・ターゲット・訴求を差し替えるだけ**にする。

## 置き場所
- リポジトリ：**https://github.com/taiga-hado/hado-recruit**（Private）。手元に無ければ `git clone https://github.com/taiga-hado/hado-recruit.git`
- LP本体：`lp/<slug>/index.html`（1ファイル・CSS内包）＋ `lp/<slug>/images/`（以下のパスはすべてこのリポジトリのルートから）
- 手本：`lp/video-creator-tiktok/index.html`（**作業前に `git switch main && git pull` して最新を読む**）
- 公開URL：`https://hado-recruit.vercel.app/lp/<slug>`（`api/lp.js` が `lps.js` に載っているLPのファイルを返す）
- slug は英小文字・数字・ハイフンだけ

## 手順

### 0. 先に読む
- このフォルダの `rules.md`（HADO自社LPのダメ出し台帳）
- `references/facts.md`（HADOについて書いてよい事実・数字。**ここに無い数字は書かない**）

### 1. ヒアリング（1回に3問まで）
- 職種名（広告と同じ呼び名）／雇用形態／給与（未経験・経験者）
- ターゲット（年齢・性別・今の仕事・一番の悩み）と流入元（Meta/TikTok広告ならそのCRのフック）
- 応募形式（tracks）：`chuto`（社会人・既卒）／`shinsotsu`（新卒）／`intern`（インターン）のどれを出すか
- 訴求（コンセプト1行・FVの見出し案）・使える写真（実在メンバー・オフィス）
facts.md にない事実は「【要確認】」にしてユーザーに聞く。架空の社員の声・顔写真を実在の人として出さない。

### 2. 手本をコピーして差し替える
`lp/video-creator-tiktok/` を `lp/<slug>/` にコピーし、中身を書き換える。**デザイン（色・書体・カード・ボタン・余白）は変えない**。
- トーン：明るいグレー#F1F3F6＋白・文字#191919・青#1E60E0・大きな英字見出し（Archivo）＋小さな日本語見出し（Noto Sans JP）
- 構成（手本の順）：FV（職種名・見出し・数字3つ・CTA）→ CAREER CHANGE（前職→今）→ CHECK（あてはまるタップ）→ REASONS 4つ → DATA → VOICES（横スワイプ）→ ONE DAY → MOMENTS（横スワイプ）→ BENEFITS（面談3つのメリット）→ POSITION（募集要項の表）→ HOW TO JOIN（3ステップ）→ JOIN US（クロージング）＋追従CTA
- `<head>`：title「〇〇募集｜株式会社HADO」・description・og:title・og:image（`/lp/<slug>/images/...`）
- 画像パスはすべて `/lp/<slug>/images/...`（相対パスにしない。/lp/<slug> はファイルの場所と違うURLで返る）
- 手本の写真を流用するときは `lp/<slug>/images/` にコピーする（他LPのフォルダを参照しない）

### 3. 応募フォームの配線（ここを外すと応募が取れない）
- `<head>` に次の2行（data-lp は slug と同じ・data-tracks は手順1の応募形式）
  ```html
  <link rel="stylesheet" href="/apply.css">
  <script src="/apply.js" data-lp="<slug>" data-tracks="chuto,shinsotsu,intern" defer></script>
  ```
- CTAはすべて `<a class="btn" href="#apply" data-apply>`。data-apply を付けた要素を押すとLP内でフォーム→面談予約が開く
- 外部のLINE URLやフォームURLに飛ばさない（計測・面談予約・LINE連携は apply.js が全部やる）
- `lps.js` の LPS に1行足す：`{ slug, title, target, tracks, image }`（管理画面の「LP・流入URL」に出る）

### 4. 検査とスクショ
- `node ~/.claude/skills/hado-saiyo-lp/scripts/check.mjs lp/<slug>/index.html` で320〜430pxの「全幅OK」が出るまで直す
- `node ~/.claude/skills/hado-saiyo-lp/scripts/shot.mjs lp/<slug>/index.html` でスマホ・PCを撮って Read で見る。FVの1画面にCTAと下の1行が入っているか
- ローカルの file:// では apply.js が動かないので、フォームの確認は公開後に行う

### 5. 別エージェントで採点
新しいサブエージェントに経緯は渡さず、`references/facts.md`・スクショ・index.html・`references/rubric.md` だけ渡して採点させる。「作り直す」と「このまま公開すると一番損をする箇所」だけ直す。

### 6. 公開（必ずPR・mainにマージ＝自動で本番）
```bash
git switch main && git pull
git switch -c lp/<slug>
# LPフォルダと lps.js を足して
git add lp/<slug> lps.js && git commit -m "<職種>のLP（/lp/<slug>）" && git push -u origin lp/<slug>
gh pr create --fill
```
- push するとプレビューURLが出る（`gh pr checks` か PRのVercelコメント）。プレビューの `/lp/<slug>` で見た目を確認（**プレビューはDBにつながらないので応募フォームの送信・予約は動かない**）
- 田中のOKをもらってから `gh pr merge --squash` → 1〜2分で本番に出る。手元から `vercel --prod` はしない
公開後に確認：
- `https://hado-recruit.vercel.app/lp/<slug>` が200で開く
- CTAでフォームが開く（**テスト送信はしない**。するなら管理画面を開いたブラウザ＝社内扱いで行い、終わったら管理画面で社内テストにする）

### 7. 管理画面の設定（https://hado-recruit.vercel.app/admin）
- 流入URL：「LP・流入URL」で広告ごとの `/r/<code>` を発行して広告に入れる（どの広告から来たか分かる）
- 面談担当：設定 →「メンバーと面談担当」でLP・流入URLごとの担当を選ぶ（未設定なら標準の担当）
- 応募フォーム：設定 →「応募フォーム」でLPごとに項目のオン/オフ・必須・独自質問を変えられる
- ユーザーに伝えるのは「URL・流入URL・担当・フォームの状態」だけ

### 8. ダメ出しを台帳に
HADO自社LPへのダメ出しはこのフォルダの `rules.md` に1行追記：`- [日付] 何をしない／何をする（理由）`。
正本は my-workspace（田中）の `hado-saiyo-lp-skill/`。直したらコミット→ `./publish-skills.sh` でメンバーに配布（入れ方：`curl -fsSL https://raw.githubusercontent.com/taiga-hado/hado-skills/main/hado-saiyo-lp-skill/install.sh | bash`）。
メンバーの手元で受けたダメ出しは、田中に伝えて正本の rules.md に足してもらう。
