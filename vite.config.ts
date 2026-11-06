import { readFileSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import preact from '@preact/preset-vite';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
const VERSION = process.env.APP_VERSION || pkg.version;
const BUILD = Number(process.env.BUILD_NUMBER || 0);
// Versão do "casco" nativo (index.html + boot loader + assets do .ipk).
// Sobe quando algo que só um novo .ipk entrega (ícones, imagens, boot loader) muda.
const NATIVE = 1;

/**
 * webOS carrega a app via file:// (módulos com crossorigin falham) e a app tem de poder
 * arrancar código descarregado (OTA). Por isso o index.html leva um boot loader inline que:
 *  - se houver uma atualização válida guardada, corre-a;
 *  - se ela der erro, marca-a como má e volta ao código empacotado no .ipk.
 */
function webosBoot(): Plugin {
  return {
    name: 'webos-boot',
    enforce: 'post',
    transformIndexHtml(html) {
      const js = /<script[^>]*src="([^"]+\.js)"[^>]*><\/script>/.exec(html)?.[1];
      const css = /<link[^>]*href="([^"]+\.css)"[^>]*>/.exec(html)?.[1];
      if (!js || !css) throw new Error('webos-boot: bundle JS/CSS não encontrado no HTML');
      const boot = `(function(){
var PKG={js:${JSON.stringify(js)},css:${JSON.stringify(css)},build:${BUILD},native:${NATIVE}};
var KEY='mh.ota',BAD='mh.ota.bad';
window.__MH={build:PKG.build,native:PKG.native,source:'pkg',version:${JSON.stringify(VERSION)}};
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){}return null}
function pkg(){var l=document.createElement('link');l.rel='stylesheet';l.href=PKG.css;document.head.appendChild(l);var s=document.createElement('script');s.src=PKG.js;document.body.appendChild(s)}
var used=false;
try{
var o=JSON.parse(ls(KEY)||'null');
if(o&&o.js&&o.css&&o.build>PKG.build&&o.native<=PKG.native&&String(o.build)!==ls(BAD)){
window.__MH={build:o.build,native:PKG.native,source:'ota',version:o.version};
var st=document.createElement('style');st.textContent=o.css;document.head.appendChild(st);
window.addEventListener('error',function onerr(){
if(window.__MH_OK)return;
ls(BAD,String(o.build));try{localStorage.removeItem(KEY)}catch(e){}
window.removeEventListener('error',onerr);location.reload();
});
var s=document.createElement('script');s.textContent=o.js;document.body.appendChild(s);
used=true;
}
}catch(e){}
if(!used)pkg();
})();`;
      return html
        .replace(/<script[^>]*src="[^"]+\.js"[^>]*><\/script>/, '')
        .replace(/<link[^>]*href="[^"]+\.css"[^>]*>/, '')
        .replace('</body>', `<script>${boot}</script>\n</body>`);
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [preact(), webosBoot()],
  define: {
    __APP_VERSION__: JSON.stringify(VERSION),
    __BUILD__: BUILD,
    __NATIVE__: NATIVE,
  },
  build: {
    target: 'chrome108',
    outDir: process.env.OUT_DIR || 'dist',
    assetsInlineLimit: 0,
    modulePreload: false,
    cssCodeSplit: false,
    rollupOptions: { output: { format: 'iife', inlineDynamicImports: true } },
  },
});
