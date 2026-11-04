// LPの「横はみ出し」検査。公開前に必ず通す（exit 1 で失敗）。
// usage: node check.mjs <index.html | https://URL> [more...]   環境変数 WIDTHS=320,360,375,390,414,430
// 2026-10-23: NSC様の採用LPが390pxでFVの見出しが切れたまま配信されていた事故の再発防止。
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
if (!fs.existsSync(path.join(HERE, 'node_modules/playwright-core'))) {
  execSync('npm i --no-save --silent playwright-core@1', { cwd: HERE, stdio: 'inherit' });
}
const { chromium } = await import(pathToFileURL(path.join(HERE, 'node_modules/playwright-core/index.mjs')).href);
const WIDTHS = (process.env.WIDTHS || '320,360,375,390,414,430').split(',').map(Number);
const targets = process.argv.slice(2);
if (!targets.length) { console.error('usage: node check.mjs <index.html|URL> ...'); process.exit(2); }
const browser = await chromium.launch({ channel: 'chrome' });
let failed = 0;
for (const t of targets) {
  const url = /^https?:/.test(t) ? t : pathToFileURL(path.resolve(t)).href;
  const rows = [];
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: Math.round(w * 2.16) }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    try { await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }); } catch { await page.goto(url, { waitUntil: 'load', timeout: 45000 }).catch(() => {}); }
    await page.waitForTimeout(600);
    const r = await page.evaluate(() => {
      const vw = innerWidth;
      const scroll = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - vw; // 本当に横スクロールが出る量
      const animated = (el) => { for (let a = el; a && a !== document.body; a = a.parentElement) { const cs = getComputedStyle(a); if (cs.animationName !== 'none' || (cs.transform !== 'none' && /matrix/.test(cs.transform) && !/^matrix\(1, 0, 0, 1, 0, 0\)$/.test(cs.transform))) return true; } return false; };
      const inScroller = (el) => { for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) { const o = getComputedStyle(a).overflowX; if (o === 'auto' || o === 'scroll') return true; } return false; };
      const label = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
      const fail = [], warn = [];
      for (const el of document.querySelectorAll('body *')) {
        const cs = getComputedStyle(el);
        if (cs.position === 'fixed' || cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') continue;
        const b = el.getBoundingClientRect();
        if (b.width === 0 || b.height === 0) continue;
        if (b.right <= -9000 || b.left <= -9000) continue;           // 視覚的に隠した要素（honeypot・skip link）
        if (inScroller(el)) continue;                                   // 横スクロールのカルーセル
        const text = (el.textContent || '').trim().replace(/\s+/g, ' ');
        const hasText = text.length > 0 && !/^(img|svg|video|picture|canvas)$/.test(el.tagName.toLowerCase());
        // 1) 文字が切れている：overflow hidden の箱から「文字を持つ子」が右にはみ出す
        if ((cs.overflowX === 'hidden' || cs.overflowX === 'clip') && !animated(el)) {
          for (const ch of el.children) {
            const cb = ch.getBoundingClientRect(); const ct = (ch.textContent || '').trim();
            if (cb.width && ct && cb.right > b.right + 2 && !animated(ch)) { fail.push({ kind: '文字切れ', tag: label(el), left: Math.round(cb.left), right: Math.round(cb.right), text: ct.replace(/\s+/g, ' ').slice(0, 40) }); break; }
          }
        }
        // 2) 文字を持つ要素が画面の右外に出ている（アニメーション中のものは除く）
        if (hasText && b.right > vw + 2 && b.left < vw && !animated(el)) {
          (b.left >= vw - 2 ? warn : fail).push({ kind: '画面外', tag: label(el), left: Math.round(b.left), right: Math.round(b.right), text: text.slice(0, 40) });
        } else if (b.right > vw + 2 || b.left < -2) {
          if (warn.length < 6) warn.push({ kind: '要確認', tag: label(el), left: Math.round(b.left), right: Math.round(b.right), text: text.slice(0, 40) });
        }
        if (fail.length >= 8) break;
      }
      return { scroll, fail, warn };
    });
    if (process.env.SHOTS) { fs.mkdirSync(process.env.SHOTS, { recursive: true }); await page.screenshot({ path: path.join(process.env.SHOTS, `${(t.replace(/[^a-z0-9]+/gi,'_').slice(-40))}_${w}.png`) }); }
    rows.push({ w, ...r });
    await ctx.close();
  }
  const ng = rows.filter(r => r.scroll > 0 || r.fail.length);
  console.log(`${ng.length ? 'NG' : 'OK'}  ${t}`);
  for (const r of rows) {
    if (r.scroll > 0 || r.fail.length) {
      console.log(`   ${r.w}px: 横スクロール ${Math.max(0, r.scroll)}px ／ 文字切れ・画面外の文字 ${r.fail.length}`);
      for (const b of r.fail.slice(0, 6)) console.log(`      - [${b.kind}] <${b.tag}> left=${b.left} right=${b.right} 「${b.text}」`);
    }
    if (r.warn.length && process.env.VERBOSE) { console.log(`   ${r.w}px: 要確認（アニメーション・装飾など） ${r.warn.length}`); for (const b of r.warn.slice(0, 4)) console.log(`      ~ <${b.tag}> left=${b.left} right=${b.right} 「${b.text}」`); }
  }
  if (ng.length) failed++;
}
await browser.close();
if (failed) { console.log(`\n${failed} 件で横スクロール／文字切れ。320〜430px の全幅で解消するまで公開しない。`); process.exit(1); }
console.log('\n全幅OK（横スクロール・文字切れなし）');
