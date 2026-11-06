// Navegação espacial (D-pad) + Magic Remote (ponteiro). Sem dependências.
import { actionFromKey, type Action } from './keys';

type Dir = 'left' | 'right' | 'up' | 'down';
const SEL = '[data-focusable]';
const FOCUS_ATTR = 'data-focused';

let current: HTMLElement | null = null;
const memory = new Map<string, string>(); // scope -> último foco (id)
const listeners = new Set<(el: HTMLElement | null) => void>();
let actionHandler: ((a: Action) => boolean | void) | null = null;

export const onFocusChange = (fn: (el: HTMLElement | null) => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
export const setActionHandler = (fn: ((a: Action) => boolean | void) | null) => { actionHandler = fn; };
export const getFocused = () => current;

function visible(el: HTMLElement): boolean {
  if (el.hasAttribute('data-disabled')) return false;
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden';
}

function activeScope(): ParentNode {
  const scopes = document.querySelectorAll<HTMLElement>('[data-focus-scope]');
  return scopes.length ? scopes[scopes.length - 1] : document;
}

function candidates(): HTMLElement[] {
  return Array.from(activeScope().querySelectorAll<HTMLElement>(SEL)).filter(visible);
}

export function focusEl(el: HTMLElement | null, opts: { scroll?: boolean } = {}) {
  if (el === current) return;
  current?.removeAttribute(FOCUS_ATTR);
  current = el;
  if (el) {
    el.setAttribute(FOCUS_ATTR, '');
    el.focus({ preventScroll: true });
    if (opts.scroll !== false) el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    const id = el.getAttribute('data-focus-id');
    const scope = el.closest('[data-focus-memory]')?.getAttribute('data-focus-memory');
    if (id && scope) memory.set(scope, id);
  }
  listeners.forEach((f) => f(current));
}

export function focusFirst(preferId?: string) {
  const list = candidates();
  if (!list.length) return focusEl(null);
  const scopeName = (list[0].closest('[data-focus-memory]') as HTMLElement | null)?.getAttribute('data-focus-memory');
  const remembered = preferId ?? (scopeName ? memory.get(scopeName) : undefined);
  const target = remembered ? list.find((e) => e.getAttribute('data-focus-id') === remembered) : undefined;
  focusEl(target ?? list[0]);
}

function move(dir: Dir) {
  const list = candidates();
  if (!current || !list.includes(current)) return focusFirst();
  const c = current.getBoundingClientRect();
  const cx = c.left + c.width / 2, cy = c.top + c.height / 2;
  let best: HTMLElement | null = null;
  let bestScore = Infinity;
  for (const el of list) {
    if (el === current) continue;
    const r = el.getBoundingClientRect();
    const dx = r.left + r.width / 2 - cx;
    const dy = r.top + r.height / 2 - cy;
    const main = dir === 'left' ? -dx : dir === 'right' ? dx : dir === 'up' ? -dy : dy;
    if (main <= 1) continue;
    const horizontal = dir === 'left' || dir === 'right';
    // horizontal: só dentro da mesma linha (evita saltos estranhos para o cabeçalho)
    if (horizontal && Math.abs(dy) > Math.max(c.height, r.height) * 0.6) continue;
    const perp = horizontal ? Math.abs(dy) : Math.abs(dx);
    const score = main + perp * 2.5;
    if (score < bestScore) { bestScore = score; best = el; }
  }
  if (best) focusEl(best);
}

export function initFocus() {
  document.addEventListener('keydown', (e) => {
    const a = actionFromKey(e);
    if (!a) return;
    if (actionHandler?.(a) === true) { e.preventDefault(); return; }
    if (a === 'left' || a === 'right' || a === 'up' || a === 'down') {
      e.preventDefault();
      move(a);
    } else if (a === 'ok') {
      if (current) { e.preventDefault(); current.click(); }
    }
  });
  // Magic Remote: o ponteiro move o foco
  document.addEventListener('mouseover', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>(SEL);
    if (el && visible(el) && activeScope().contains(el)) focusEl(el, { scroll: false });
  });
}
