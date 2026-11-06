import { useEffect, useState } from 'preact/hooks';
import { route, goBack, busy, type RouteName } from './core/router';
import { setActionHandler } from './core/focus';
import { Splash } from './ui/Splash';
import { Home } from './screens/Home';
import { Placeholder } from './screens/Placeholder';
import { Settings } from './screens/Settings';
import { lang } from './i18n';
import { checkForUpdate } from './core/update';

const SPLASH_MS = 1900;

export function App() {
  const r = route.use();
  const l = lang.use();
  const [phase, setPhase] = useState<'splash' | 'leaving' | 'ready'>('splash');

  useEffect(() => { document.documentElement.lang = l; }, [l]);

  useEffect(() => {
    // aqui, nas próximas fases, carregam-se playlists/IndexedDB durante o splash
    const a = setTimeout(() => setPhase('leaving'), SPLASH_MS);
    const b = setTimeout(() => setPhase('ready'), SPLASH_MS + 350);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);

  // verificação automática de atualizações, já com a Home no ecrã
  useEffect(() => {
    if (phase !== 'ready') return;
    const id = setTimeout(() => { void checkForUpdate(); }, 2500);
    return () => clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    setActionHandler((a) => {
      if (phase !== 'ready' || busy.get()) return true; // engole input durante splash/transições
      if (a === 'back') { goBack(); return true; }
      return false;
    });
    return () => setActionHandler(null);
  }, [phase]);

  return (
    <>
      {phase !== 'splash' && <Home />}
      {phase !== 'splash' && r.name !== 'home' && (
        <div class="overlay" data-focus-scope>
          <Screen name={r.name} />
        </div>
      )}
      {phase !== 'ready' && <Splash leaving={phase === 'leaving'} />}
    </>
  );
}

function Screen({ name }: { name: RouteName }) {
  switch (name) {
    case 'home': return null;
    case 'settings': return <Settings />;
    default: return <Placeholder name={name} />;
  }
}
