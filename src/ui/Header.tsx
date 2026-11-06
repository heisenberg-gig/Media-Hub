import { IconGear, IconMic, IconSearch, IconUser } from './icons';
import { useT } from '../i18n';
import { navigateFade } from '../core/router';

export function Header() {
  const t = useT();
  return (
    <header class="header">
      <div class="header__left">
        <div class="brand">
          <img src="./logo-mark.svg" alt="" width="44" height="44" />
          <span class="brand__name">Media Hub</span>
        </div>
        <span class="header__sep" />
        <button class="circle" data-focusable data-focus-id="mic" aria-label={t('voice')} data-theme="neutral">
          <IconMic size={26} />
        </button>
        <button class="searchpill" data-focusable data-focus-id="search" data-theme="neutral" onClick={() => navigateFade('search')}>
          <IconSearch size={24} /> <span>{t('search')}</span>
        </button>
      </div>
      <div class="header__right">
        <button class="circle" data-focusable data-focus-id="settings" aria-label={t('settings')} data-theme="neutral" onClick={() => navigateFade('settings')}>
          <IconGear size={26} />
        </button>
        <button class="circle circle--avatar" data-focusable data-focus-id="profile" aria-label={t('profile')} data-theme="neutral">
          <IconUser size={28} />
        </button>
      </div>
    </header>
  );
}
