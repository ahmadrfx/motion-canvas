import path from 'path';
import {fileURLToPath} from 'url';
import {chromium} from 'playwright';
import {createServer} from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.');

// Key moments: bg flips, word landings, muted "plan", clears, end.
// Preview is 540x960 (0.5x of 1080x1920). Stage y -> preview y: 480 + y/2.
const MOMENTS = [
  {t: 0.2, label: 'start (blue bg)'},
  {t: 0.42, label: 'you landed'},
  {t: 0.78, label: "don't + bg flip"},
  {t: 1.42, label: 'always (big)'},
  {t: 2.12, label: 'perfect + flip'},
  {t: 2.52, label: 'plan (muted)'},
  {t: 2.65, label: 'plan settled-check'},
  {t: 3.52, label: 'something + flip'},
  {t: 4.62, label: 'own (script) + flip'},
  {t: 5.3, label: 'S1 cleared'},
  {t: 6.42, label: 'S2 mid'},
  {t: 7.42, label: 'S2 cleared'},
  {t: 8.6, label: 'S3 mid'},
  {t: 9.62, label: 'yours + flip'},
  {t: 12.4, label: 'end hold'},
];

const server = await createServer({
  root,
  configFile: path.join(root, 'vite.config.ts'),
});
await server.listen();
const browser = await chromium.launch({
  headless: true,
  executablePath:
    process.env.HOME +
    '/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',
});
const page = await browser.newPage();
page.on('console', msg => {
  if (msg.type() === 'error' || msg.type() === 'warning') {
    console.log(`[page:${msg.type()}]`, msg.text().slice(0, 200));
  }
});
page.on('pageerror', err => console.log('[pageerror]', err.message));

await page.goto(`http://localhost:${server.config.server.port}/verify.html`);
await page.waitForFunction(() => window.__ready === true, null, {
  timeout: 120000,
});

// probe rows: you(-570), always(-415), plan(-95), something(165), own(295),
// care(10), yours(120) -> preview y = 480 + stage_y/2
const ROWS = [195, 272, 432, 562, 627, 485, 540];
console.log('t      bg            rows: maxLum@x (minLum@x)');
for (const {t, label} of MOMENTS) {
  await page.evaluate(time => window.__renderFrame(time), t);
  await page.waitForTimeout(60);
  const {corner, rows} = await page.evaluate(r => window.__probe(r), ROWS);
  console.log(
    String(t).padEnd(6),
    `${corner.join(',')}`.padEnd(13),
    rows.map(r => `${r[0]}@${r[1]}(${r[2]}@${r[3]})`).join(' '),
    `  ${label}`,
  );
}

await browser.close();
await server.close();
console.log('done');
