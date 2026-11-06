import { defineConfig, type Plugin } from 'vite';
import preact from '@preact/preset-vite';

// webOS carrega a app via file:// — scripts type=module com crossorigin falham.
// Geramos um bundle IIFE clássico e limpamos o HTML em conformidade.
function webosHtml(): Plugin {
  return {
    name: 'webos-html',
    enforce: 'post',
    transformIndexHtml(html) {
      return html
        .replace(/<script type="module" crossorigin/g, '<script defer')
        .replace(/ crossorigin/g, '');
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [preact(), webosHtml()],
  build: {
    target: 'chrome108',
    outDir: 'dist',
    assetsInlineLimit: 0,
    modulePreload: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: { format: 'iife', inlineDynamicImports: true },
    },
  },
});
