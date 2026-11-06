// Gera a pasta ota/ (manifest + código) a partir do dist/ já compilado.
// Uso: node scripts/make-ota.mjs [distDir] [otaDir]
import { createHash } from 'node:crypto';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = process.argv[2] || 'dist';
const out = process.argv[3] || 'ota';
const html = readFileSync(join(dist, 'index.html'), 'utf8');
const m = /var PKG=\{js:"([^"]+)",css:"([^"]+)",build:(\d+),native:(\d+)\}/.exec(html);
if (!m) throw new Error('make-ota: bloco PKG não encontrado no index.html');
const pkg = { js: m[1], css: m[2], build: Number(m[3]), native: Number(m[4]) };

let js = readFileSync(join(dist, pkg.js), 'utf8');
let css = readFileSync(join(dist, pkg.css), 'utf8');
// o CSS passa a ser injetado no documento (index.html): urls relativos têm de apontar para assets/
css = css.replace(/url\((['"]?)\.\/(?!assets\/)([^)'"]+)\1\)/g, 'url($1./assets/$2$1)');

const sha = (s) => createHash('sha256').update(Buffer.from(s, 'utf8')).digest('hex');
const info = (s) => ({ sha256: sha(s), size: Buffer.byteLength(s, 'utf8') });

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'app.js'), js);
writeFileSync(join(out, 'app.css'), css);
const appVersion = JSON.parse(readFileSync('package.json', 'utf8')).version;
writeFileSync(
  join(out, 'manifest.json'),
  JSON.stringify({
    version: process.env.APP_VERSION || appVersion,
    build: pkg.build,
    native: pkg.native,
    js: { file: 'app.js', ...info(js) },
    css: { file: 'app.css', ...info(css) },
    builtAt: new Date().toISOString(),
  }, null, 2),
);
console.log(`OTA pronto em ${out}/ (build ${pkg.build}, native ${pkg.native})`);
