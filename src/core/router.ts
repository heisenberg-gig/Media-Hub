import { createStore } from './store';

export type RouteName = 'home' | 'live' | 'movies' | 'radios' | 'settings' | 'search';
export interface Route { name: RouteName }

export const route = createStore<Route>({ name: 'home' });
/** true enquanto uma transição está a decorrer (bloqueia input duplicado) */
export const busy = createStore(false);

const EASE_OUT = 'cubic-bezier(.22,.9,.28,1)';
const EASE_IN_OUT = 'cubic-bezier(.65,0,.35,1)';

/** Cartão expande até ecrã inteiro → troca de ecrã por baixo → fade-out do véu. */
export async function navigateExpand(to: RouteName, from: HTMLElement) {
  if (busy.get()) return;
  busy.set(true);
  const r = from.getBoundingClientRect();
  const W = window.innerWidth, H = window.innerHeight;
  const veil = document.createElement('div');
  veil.className = 'veil';
  document.body.appendChild(veil);
  const start = `inset(${r.top}px ${W - r.right}px ${H - r.bottom}px ${r.left}px round 28px)`;
  const end = 'inset(0px 0px 0px 0px round 0px)';
  await veil.animate([{ clipPath: start }, { clipPath: end }], { duration: 400, easing: EASE_OUT, fill: 'forwards' }).finished;
  route.set({ name: to });
  await veil.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 380, delay: 80, easing: EASE_IN_OUT, fill: 'forwards' }).finished;
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
  await veil.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: EASE_IN_OUT, fill: 'forwards' }).finished;
  route.set({ name: to });
  await veil.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 320, delay: 40, easing: EASE_IN_OUT, fill: 'forwards' }).finished;
  veil.remove();
  busy.set(false);
}

export const goBack = () => (route.get().name === 'home' ? exitApp() : navigateFade('home'));

export function exitApp() {
  try { window.close(); } catch { /* fora da TV */ }
}
