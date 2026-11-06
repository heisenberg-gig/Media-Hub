import { tNow } from '../i18n';

export function Splash({ leaving }: { leaving: boolean }) {
  return (
    <div class={`splash ${leaving ? 'splash--leave' : ''}`}>
      <div class="splash__center">
        <img class="splash__mark" src="./logo-mark.svg" alt="" width="132" height="132" />
        <div class="splash__word" aria-label="Media Hub">
          {'Media Hub'.split('').map((c, i) => (
            <span style={{ '--i': i } as any}>{c === ' ' ? ' ' : c}</span>
          ))}
        </div>
      </div>
      <div class="splash__dots" role="status" aria-label={tNow('loading')}>
        <i /><i /><i />
      </div>
    </div>
  );
}
