// Full-page screenshots of an LP at phone (390x844, DPR 2) and desktop (1280) widths.
// usage: node shot.mjs path/to/index.html     -> <dir>/shots/sp.png, sp_01.png.., pc.png
// First run installs playwright-core here (uses the installed Google Chrome, no browser download).
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
if (!fs.existsSync(path.join(HERE, 'node_modules/playwright-core'))) {
  execSync('npm i --no-save --silent playwright-core@1', { cwd: HERE, stdio: 'inherit' });
}
const { chromium } = await import(pathToFileURL(path.join(HERE, 'node_modules/playwright-core/index.mjs')).href);
const html = path.resolve(process.argv[2]);
const out = path.join(path.dirname(html), 'shots');
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
async function shoot(name, opts) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(html).href, { waitUntil: 'networkidle' });
  // trigger IntersectionObserver-driven effects, then return to top
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } scrollTo(0, 0); });
  await page.waitForTimeout(1200);
  if (name === 'sp') await page.screenshot({ path: path.join(out, 'sp_fv.png') }); // first screen as the user sees it
  // fixed elements (sticky CTA) would be painted mid-page in a full-page capture
  await page.addStyleTag({ content: '*{transition:none!important}' });
  await page.evaluate(() => document.querySelectorAll('*').forEach(el => { if (getComputedStyle(el).position === 'fixed') el.style.display = 'none'; }));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  if (overflow > 0) console.log(`WARN ${name}: horizontal overflow ${overflow}px`);
  if (name === 'sp') {
    // Tall pages exceed Chrome's ~16k px capture limit at DPR 2, so shoot screen by screen.
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    let i = 0;
    for (let y = 0; y < h; y += 844, i++) {
      await page.evaluate((y) => scrollTo(0, y), y);
      await page.waitForTimeout(150);
      await page.screenshot({ path: path.join(out, `sp_${String(i + 1).padStart(2, '0')}.png`) });
    }
    console.log(`sp: ${h}px, ${i} screens`);
  } else {
    await page.screenshot({ path: path.join(out, `${name}.png`), fullPage: true });
  }
  await ctx.close();
}
await shoot('sp', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await shoot('pc', { viewport: { width: 1280, height: 900 } });
await browser.close();
console.log(out);
