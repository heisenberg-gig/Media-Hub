import { useEffect, useState } from 'preact/hooks';

export interface Store<T> {
  get(): T;
  set(next: T | ((prev: T) => T)): void;
  subscribe(fn: (v: T) => void): () => void;
  use(): T;
}

export function createStore<T>(initial: T): Store<T> {
  let value = initial;
  const subs = new Set<(v: T) => void>();
  const store: Store<T> = {
    get: () => value,
    set(next) {
      const n = typeof next === 'function' ? (next as (p: T) => T)(value) : next;
      if (Object.is(n, value)) return;
      value = n;
      subs.forEach((f) => f(value));
    },
    subscribe(fn) {
      subs.add(fn);
      return () => subs.delete(fn);
    },
    use() {
      const [v, setV] = useState(value);
      useEffect(() => {
        setV(value);
        return store.subscribe(setV);
      }, []);
      return v;
    },
  };
  return store;
}

export function persisted<T>(key: string, fallback: T): Store<T> {
  let initial = fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw) initial = JSON.parse(raw) as T;
  } catch { /* storage indisponível */ }
  const s = createStore(initial);
  s.subscribe((v) => {
    try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* ignora */ }
  });
  return s;
}
