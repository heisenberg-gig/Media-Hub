import { tNow } from '../i18n';

/** Splash: fundo preto, só o logo (fade-in + pulse) e 3 pontos com as cores dos reflexos do logo. */
export function Splash({ leaving }: { leaving: boolean }) {
  return (
    <div class={`splash ${leaving ? 'splash--leave' : ''}`}>
      <div class="splash__center">
        <div class="splash__pulse">
          <span class="splash__glow" />
          <img class="splash__mark" src="./logo-512.webp" alt="Media Hub" width="320" height="320" />
        </div>
      </div>
      <div class="splash__dots" role="status" aria-label={tNow('loading')}>
        <i /><i /><i />
      </div>
    </div>
  );
}
