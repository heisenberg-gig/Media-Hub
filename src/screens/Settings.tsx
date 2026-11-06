import { useEffect } from 'preact/hooks';
import { Background } from '../ui/Background';
import { IconBack } from '../ui/icons';
import { lang, useT, type Lang } from '../i18n';
import { focusFirst } from '../core/focus';
import { goBack } from '../core/router';
import { applyUpdate, checkForUpdate, runningInfo, update } from '../core/update';

export function Settings() {
  const t = useT();
  const cur = lang.use();
  const up = update.use();
  const info = runningInfo();
  useEffect(() => { const id = setTimeout(() => focusFirst(), 300); return () => clearTimeout(id); }, []);
  const opts: { id: Lang; label: string }[] = [
    { id: 'pt-PT', label: t('portuguese') },
    { id: 'en', label: t('english') },
  ];
  return (
    <div class="screen sub enter" data-focus-memory="settings">
      <Background theme="neutral" />
      <div class="sub__top">
        <button class="circle" data-focusable data-focus-id="back" aria-label={t('back')} onClick={goBack}><IconBack size={28} /></button>
        <h1>{t('settings')}</h1>
      </div>
      <section class="setting">
        <h2>{t('language')}</h2>
        <p>{t('languageHint')}</p>
        <div class="setting__row">
          {opts.map((o) => (
            <button class={`pill ${cur === o.id ? 'pill--on' : ''}`} data-focusable data-focus-id={o.id} onClick={() => lang.set(o.id)}>
              {o.label}
            </button>
          ))}
        </div>
      </section>
      <section class="setting setting--updates">
        <h2>{t('updates')}</h2>
        <p>{t('updatesHint')}</p>
        <div class="setting__line">
          {t('installed')}: <b>{info.version}</b>
          <small>build {info.build} · {info.source === 'ota' ? t('fromUpdate') : t('fromPackage')}</small>
        </div>
        <div class={`setting__status ${up.status === 'error' ? 'setting__status--bad' : ''}`}>{statusText(up.status, t, up.latest)}</div>
        <div class="setting__row">
          {up.status === 'ready' ? (
            <button class="pill pill--accent" data-focusable data-focus-id="restart" onClick={applyUpdate}>{t('restartUpdate')}</button>
          ) : (
            <button class="pill" data-focusable data-focus-id="check" onClick={checkForUpdate}>{t('checkUpdates')}</button>
          )}
        </div>
      </section>
    </div>
  );
}

function statusText(st: string, t: (k: any) => string, latest?: string) {
  switch (st) {
    case 'checking': return t('checking');
    case 'downloading': return `${t('downloading')} ${latest ?? ''}`;
    case 'uptodate': return t('upToDate');
    case 'ready': return `${t('updateReady')} ${latest ?? ''}`;
    case 'needsIpk': return t('needsIpk');
    case 'error': return t('updateError');
    default: return '';
  }
}
