import { useEffect, useState } from 'preact/hooks';
import { route, goBack, busy, type RouteName } from './core/router';
import { setActionHandler } from './core/focus';
import { Splash } from './ui/Splash';
import { Home } from './screens/Home';
import { Placeholder } from './screens/Placeholder';
import { Settings } from './screens/Settings';
import { lang } from './i18n';

const SPLASH_MS = 2600;

export function App() {
  const r = route.use();
  const l = lang.use();
  const [phase, setPhase] = useState<'splash' | 'leaving' | 'ready'>('splash');

  useEffect(() => { document.documentElement.lang = l; }, [l]);

  useEffect(() => {
    // aqui, nas próximas fases, carregam-se playlists/IndexedDB durante o splash
    const a = setTimeout(() => setPhase('leaving'), SPLASH_MS);
    const b = setTimeout(() => setPhase('ready'), SPLASH_MS + 500);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);

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
      {phase !== 'splash' && <Screen name={r.name} />}
      {phase !== 'ready' && <Splash leaving={phase === 'leaving'} />}
    </>
  );
}

function Screen({ name }: { name: RouteName }) {
  switch (name) {
    case 'home': return <Home />;
    case 'settings': return <Settings />;
    default: return <Placeholder name={name} />;
  }
}
