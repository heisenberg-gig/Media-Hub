import { IconGear, IconMic, IconSearch, IconUser } from './icons';
import { useT } from '../i18n';
import { navigateFade } from '../core/router';
import { applyUpdate, update } from '../core/update';

export function Header() {
  const t = useT();
  const up = update.use();
  return (
    <header class="header">
      <div class="header__left">
        <img class="brand" src="./logo-128.webp" alt="Media Hub" width="68" height="68" />
        <span class="header__sep" />
        <button class="circle" data-focusable data-focus-id="mic" aria-label={t('voice')} data-theme="neutral">
          <IconMic size={26} />
        </button>
        <button class="searchpill" data-focusable data-focus-id="search" data-theme="neutral" onClick={() => navigateFade('search')}>
          <IconSearch size={24} /> <span>{t('search')}</span>
        </button>
      </div>
      <div class="header__right">
        {up.status === 'ready' && (
          <button class="pill pill--accent" data-focusable data-focus-id="update" data-theme="neutral" onClick={applyUpdate}>
            {t('updatePill')} {up.latest}
          </button>
        )}
        <button class="circle" data-focusable data-focus-id="settings" aria-label={t('settings')} data-theme="neutral" onClick={() => navigateFade('settings')}>
          <IconGear size={26} />
          {(up.status === 'ready' || up.status === 'needsIpk') && <i class="dot" />}
        </button>
        <button class="circle circle--avatar" data-focusable data-focus-id="profile" aria-label={t('profile')} data-theme="neutral">
          <IconUser size={28} />
        </button>
      </div>
    </header>
  );
}
