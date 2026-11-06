import { createStore } from './store';

export type RouteName = 'home' | 'live' | 'movies' | 'radios' | 'settings' | 'search';
export interface Route { name: RouteName }

export const route = createStore<Route>({ name: 'home' });
/** true enquanto uma transição está a decorrer (bloqueia input duplicado) */
export const busy = createStore(false);

const EASE_OUT = 'cubic-bezier(.22,.9,.28,1)';
const EASE_IN_OUT = 'cubic-bezier(.65,0,.35,1)';
const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

/**
 * Cartão expande até ecrã inteiro → troca de ecrã por baixo → fade-out do véu.
 * Só transform/opacity (compositor): o véu nasce com o tamanho do cartão e escala até cobrir o ecrã.
 */
export async function navigateExpand(to: RouteName, from: HTMLElement) {
  if (busy.get()) return;
  busy.set(true);
  const r = from.getBoundingClientRect();
  const W = window.innerWidth, H = window.innerHeight;
  const veil = document.createElement('div');
  veil.className = 'veil veil--card';
  Object.assign(veil.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
  document.body.appendChild(veil);
  const sx = W / r.width, sy = H / r.height;
  await veil.animate(
    [{ transform: 'translate(0,0) scale(1,1)', borderRadius: '28px' },
     { transform: `translate(${-r.left}px,${-r.top}px) scale(${sx},${sy})`, borderRadius: '8px' }],
    { duration: 300, easing: EASE_OUT, fill: 'forwards' },
  ).finished;
  route.set({ name: to });
  await frame(); await frame(); // deixa o novo ecrã montar enquanto o véu ainda o cobre
  await veil.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: EASE_IN_OUT, fill: 'forwards' }).finished;
  veil.remove();
  busy.set(false);
}

/** Troca com fade para o preto e de volta (voltar atrás, ecrãs secundários). */
export async function navigateFade(to: RouteName) {
  if (busy.get()) return;
  busy.set(true);
  const veil = document.createElement('div');
  veil.className = 'veil veil--dark';
  veil.style.opacity = '0';
  document.body.appendChild(veil);
  await veil.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: EASE_IN_OUT, fill: 'forwards' }).finished;
  route.set({ name: to });
  await frame(); await frame();
  await veil.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 240, easing: EASE_IN_OUT, fill: 'forwards' }).finished;
  veil.remove();
  busy.set(false);
}

export const goBack = () => (route.get().name === 'home' ? exitApp() : navigateFade('home'));

export function exitApp() {
  try { window.close(); } catch { /* fora da TV */ }
}
