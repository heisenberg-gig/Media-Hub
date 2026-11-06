import { useEffect } from 'preact/hooks';
import { Background } from '../ui/Background';
import { IconBack, IconRadio, IconReel, IconSearch, IconTv } from '../ui/icons';
import { Clock, Weather } from '../ui/ClockWeather';
import { useT } from '../i18n';
import { focusFirst } from '../core/focus';
import { goBack, type RouteName } from '../core/router';

const ICON: Partial<Record<RouteName, any>> = { live: IconTv, movies: IconReel, radios: IconRadio, search: IconSearch };

export function Placeholder({ name }: { name: RouteName }) {
  const t = useT();
  const Icon = ICON[name] ?? IconTv;
  const title = name === 'live' ? t('liveTv') : name === 'movies' ? t('movies') : name === 'radios' ? t('radios') : t('search');
  useEffect(() => { const id = setTimeout(() => focusFirst(), 300); return () => clearTimeout(id); }, []);
  return (
    <div class="screen sub enter" data-focus-memory={`ph-${name}`}>
      <Background theme={name === 'search' ? 'neutral' : name} />
      <div class="sub__top">
        <button class="circle" data-focusable data-focus-id="back" aria-label={t('back')} onClick={goBack}><IconBack size={28} /></button>
        <h1>{title}</h1>
        <div class="sub__meta"><Weather /><Clock /></div>
      </div>
      <div class="sub__empty">
        <Icon size={88} />
        <h2>{t('comingSoon')}</h2>
        <p>{t('comingSoonText')}</p>
      </div>
    </div>
  );
}
