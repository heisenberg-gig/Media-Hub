// Copia appinfo + ícones para dist/ e gera o .ipk com ares-package
import { cpSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

mkdirSync('release', { recursive: true });
for (const f of ['appinfo.json', 'icon.png', 'largeIcon.png', 'splash.png']) cpSync(`webos/${f}`, `dist/${f}`);
execFileSync('npx', ['ares-package', 'dist', '-o', 'release', '--no-minify'], { stdio: 'inherit' });
