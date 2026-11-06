import { useEffect } from 'preact/hooks';
import { Background } from '../ui/Background';
import { IconBack } from '../ui/icons';
import { lang, useT, type Lang } from '../i18n';
import { focusFirst } from '../core/focus';
import { goBack } from '../core/router';

export function Settings() {
  const t = useT();
  const cur = lang.use();
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
    </div>
  );
}
