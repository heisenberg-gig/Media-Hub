import { createRequire } from 'node:module';
const require = createRequire(process.env.PW_ROOT + '/');
const { chromium } = require('playwright');
import fs from 'node:fs';
const svg = fs.readFileSync('public/logo-mark.svg', 'utf8');
const b = await chromium.launch();
const p = await b.newPage();
async function shot(w, h, html, out) {
  await p.setViewportSize({ width: w, height: h });
  await p.setContent(`<body style="margin:0;background:transparent">${html}</body>`);
  await p.screenshot({ path: out, omitBackground: true });
}
await shot(80, 80, `<div style="width:80px;height:80px">${svg}</div>`, 'webos/icon.png');
await shot(130, 130, `<div style="width:130px;height:130px">${svg}</div>`, 'webos/largeIcon.png');
await shot(1920, 1080,
  `<div style="width:1920px;height:1080px;background:#0d0b1f;display:flex;align-items:center;justify-content:center"><div style="width:180px">${svg}</div></div>`,
  'webos/splash.png');
await b.close();
