/** Splash: fundo preto e só o logo — fade-in e depois um pulse de brilho, como se estivesse a carregar. */
export function Splash({ leaving }: { leaving: boolean }) {
  return (
    <div class={`splash ${leaving ? 'splash--leave' : ''}`}>
      <div class="splash__pulse">
        <span class="splash__glow" />
        <img class="splash__mark" src="./logo-512.webp" alt="Media Hub" width="320" height="320" />
      </div>
    </div>
  );
}
