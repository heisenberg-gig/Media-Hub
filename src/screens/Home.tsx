import { useEffect } from 'preact/hooks';
import { Header } from '../ui/Header';
import { Background } from '../ui/Background';
import { ClockWeather } from '../ui/ClockWeather';
import { IconRadio, IconReel, IconTv } from '../ui/icons';
import { useT } from '../i18n';
import { focusFirst } from '../core/focus';
import { navigateExpand, type RouteName } from '../core/router';

export function Home() {
  const t = useT();
  // espera a animação de entrada começar antes de pôr foco (evita medir rects em transição)
  useEffect(() => { const id = setTimeout(() => focusFirst('live'), 650); return () => clearTimeout(id); }, []);

  const cards: { id: RouteName; icon: any; title: string; sub: string }[] = [
    { id: 'live', icon: <IconTv size={64} />, title: t('liveTv'), sub: t('liveSub') },
    { id: 'movies', icon: <IconReel size={64} />, title: t('movies'), sub: t('moviesSub') },
    { id: 'radios', icon: <IconRadio size={64} />, title: t('radios'), sub: t('radiosSub') },
  ];

  return (
    <div class="screen home" data-focus-memory="home">
      <Background theme="live" />
      <Header />
      <main class="cards">
        {cards.map((c, i) => (
          <button
            class={`card card--${c.id}`}
            style={{ '--i': i } as any}
            data-focusable data-focus-id={c.id} data-theme={c.id}
            onClick={(e) => navigateExpand(c.id, e.currentTarget as HTMLElement)}
          >
            <span class="card__hint">{t('noPlaylist')}</span>
            <span class="card__icon">{c.icon}</span>
            <span class="card__title">{c.title}</span>
            <span class="card__sub">{c.sub}</span>
            <span class="card__bar" />
          </button>
        ))}
      </main>
      <ClockWeather />
    </div>
  );
}
