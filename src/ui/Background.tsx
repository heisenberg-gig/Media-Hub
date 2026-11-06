import { useEffect, useState } from 'preact/hooks';
import { onFocusChange } from '../core/focus';

// Cada cartão tem o seu "clima" de cor. Mais tarde: artwork real desfocado.
export const THEMES: Record<string, string> = {
  live: 'radial-gradient(60% 70% at 70% 30%, #3b2fb8 0%, transparent 70%), radial-gradient(50% 60% at 20% 80%, #1a3a8f 0%, transparent 70%)',
  movies: 'radial-gradient(60% 70% at 70% 30%, #8a2f6b 0%, transparent 70%), radial-gradient(50% 60% at 20% 80%, #b8541f 0%, transparent 70%)',
  radios: 'radial-gradient(60% 70% at 70% 30%, #12707a 0%, transparent 70%), radial-gradient(50% 60% at 20% 80%, #2f4fb8 0%, transparent 70%)',
  neutral: 'radial-gradient(60% 70% at 70% 30%, #2a2470 0%, transparent 70%), radial-gradient(50% 60% at 20% 80%, #16205e 0%, transparent 70%)',
};
const KEYS = Object.keys(THEMES);
// vinheta + base ficam dentro de cada camada: camadas opacas, e menos uma camada de ecrã inteiro a misturar
const VIGNETTE = 'radial-gradient(120% 100% at 50% 40%, transparent 40%, rgba(5,4,15,.55) 100%)';
const BASE = 'linear-gradient(160deg, #16132e, #0d0b1f)';
const layerBg = (k: string) => `${VIGNETTE}, ${THEMES[k]}, ${BASE}`;

/**
 * Todas as camadas são pintadas UMA vez (gradientes de ecrã inteiro são caros de rasterizar)
 * e o crossfade só alterna opacidade → corre na GPU sem repintar nada.
 */
export function Background({ theme = 'neutral' }: { theme?: string }) {
  const [active, setActive] = useState(theme);

  useEffect(() => {
    setActive(theme);
    let timer = 0;
    const off = onFocusChange((el) => {
      const t = el?.getAttribute('data-theme');
      if (!t || !THEMES[t]) return;
      // só troca o fundo quando o foco "assenta": em navegação rápida só os cartões animam
      clearTimeout(timer);
      timer = window.setTimeout(() => setActive(t), 240);
    });
    return () => { off(); clearTimeout(timer); };
  }, [theme]);

  return (
    <div class="bg" aria-hidden="true">
      {KEYS.map((k) => (
        <div class="bg__layer" style={{ background: layerBg(k), opacity: k === active ? 1 : 0 }} />
      ))}
    </div>
  );
}
