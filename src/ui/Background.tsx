import { useEffect, useRef, useState } from 'preact/hooks';
import { onFocusChange } from '../core/focus';

// Cada cartão tem o seu "clima" de cor. Mais tarde: artwork real desfocado.
export const THEMES: Record<string, string> = {
  live: 'radial-gradient(60% 70% at 70% 30%, #3b2fb8 0%, transparent 70%), radial-gradient(50% 60% at 20% 80%, #1a3a8f 0%, transparent 70%)',
  movies: 'radial-gradient(60% 70% at 70% 30%, #8a2f6b 0%, transparent 70%), radial-gradient(50% 60% at 20% 80%, #b8541f 0%, transparent 70%)',
  radios: 'radial-gradient(60% 70% at 70% 30%, #12707a 0%, transparent 70%), radial-gradient(50% 60% at 20% 80%, #2f4fb8 0%, transparent 70%)',
  neutral: 'radial-gradient(60% 70% at 70% 30%, #2a2470 0%, transparent 70%), radial-gradient(50% 60% at 20% 80%, #16205e 0%, transparent 70%)',
};

/** Duas camadas em crossfade (só opacidade → barato na GPU da TV). */
export function Background({ theme = 'neutral' }: { theme?: string }) {
  const [layers, setLayers] = useState<[string, string]>([theme, theme]);
  const [top, setTop] = useState(0);

  useEffect(() => {
    return onFocusChange((el) => {
      const t = el?.getAttribute('data-theme');
      if (t && THEMES[t]) swap(t);
    });
  }, []);

  const topRef = useRef(0);
  const themeRef = useRef(theme);
  function swap(t: string) {
    if (t === themeRef.current) return;
    themeRef.current = t;
    const next = 1 - topRef.current;
    topRef.current = next;
    setLayers((l) => { const n: [string, string] = [...l] as [string, string]; n[next] = t; return n; });
    setTop(next);
  }

  return (
    <div class="bg" aria-hidden="true">
      <div class="bg__layer" style={{ background: THEMES[layers[0]], opacity: top === 0 ? 1 : 0 }} />
      <div class="bg__layer" style={{ background: THEMES[layers[1]], opacity: top === 1 ? 1 : 0 }} />
      <div class="bg__vignette" />
    </div>
  );
}
