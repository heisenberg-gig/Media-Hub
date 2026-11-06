// Atualização OTA: a app procura um manifest no repositório (branch `ota`), descarrega o
// código novo, valida-o (tamanho + SHA-256) e guarda-o. No arranque seguinte o boot loader
// (index.html) corre-o; se der erro volta sozinho à versão do .ipk.
import { UPDATE_BASE } from '../config';
import { createStore } from './store';

export type UpdateStatus = 'idle' | 'checking' | 'downloading' | 'uptodate' | 'ready' | 'needsIpk' | 'error';
export interface UpdateState { status: UpdateStatus; latest?: string; checkedAt?: number }

export const update = createStore<UpdateState>({ status: 'idle' });

const KEY = 'mh.ota';
const runningBuild = () => window.__MH?.build ?? __BUILD__;
const runningNative = () => window.__MH?.native ?? __NATIVE__;
export const runningInfo = () => ({
  version: window.__MH?.version ?? __APP_VERSION__,
  build: runningBuild(),
  source: window.__MH?.source ?? 'pkg',
});

async function fetchText(url: string, ms = 12000): Promise<string> {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  try {
    const r = await fetch(`${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`, { cache: 'no-store', signal: ctl.signal });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.text();
  } finally { clearTimeout(t); }
}

async function sha256(text: string): Promise<string | null> {
  try {
    if (!crypto?.subtle) return null;
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch { return null; }
}

async function verified(text: string, meta: { size: number; sha256: string }, what: string) {
  if (new TextEncoder().encode(text).length !== meta.size) throw new Error(`${what}: tamanho inválido`);
  const h = await sha256(text);
  if (h && h !== meta.sha256) throw new Error(`${what}: integridade inválida`);
}

let running = false;

/** Procura (e descarrega, se houver) uma atualização. Seguro de chamar várias vezes. */
export async function checkForUpdate(): Promise<void> {
  if (running) return;
  running = true;
  update.set((s) => ({ ...s, status: 'checking' }));
  try {
    const m = JSON.parse(await fetchText(`${UPDATE_BASE}manifest.json`));
    const checkedAt = Date.now();
    if (!(m.build > runningBuild())) return void update.set({ status: 'uptodate', checkedAt });
    // esta versão já rebentou nesta TV e foi revertida: não voltar a tentar a mesma
    try { if (localStorage.getItem('mh.ota.bad') === String(m.build)) return void update.set({ status: 'uptodate', checkedAt }); } catch { /* ignora */ }
    if (m.native > runningNative()) return void update.set({ status: 'needsIpk', latest: m.version, checkedAt });

    let stored: { build?: number } | null = null;
    try { stored = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { /* ignora */ }
    if (stored?.build === m.build) return void update.set({ status: 'ready', latest: m.version, checkedAt });

    update.set({ status: 'downloading', latest: m.version, checkedAt });
    const [js, css] = await Promise.all([fetchText(UPDATE_BASE + m.js.file), fetchText(UPDATE_BASE + m.css.file)]);
    await verified(js, m.js, 'app.js');
    await verified(css, m.css, 'app.css');
    localStorage.setItem(KEY, JSON.stringify({ version: m.version, build: m.build, native: m.native, js, css }));
    update.set({ status: 'ready', latest: m.version, checkedAt });
  } catch (e) {
    console.warn('[update]', e);
    update.set((s) => ({ ...s, status: 'error', checkedAt: Date.now() }));
  } finally { running = false; }
}

/** Reinicia a app: o boot loader arranca a atualização guardada. */
export const applyUpdate = () => location.reload();
