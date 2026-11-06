import { render } from 'preact';
import '@fontsource/exo-2/latin-300.css';
import '@fontsource/exo-2/latin-400.css';
import '@fontsource/exo-2/latin-500.css';
import '@fontsource/exo-2/latin-600.css';
import '@fontsource/exo-2/latin-700.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/splash.css';
import './styles/home.css';
import './styles/sub.css';
import { App } from './app';
import { initFocus } from './core/focus';

initFocus();
render(<App />, document.getElementById('app')!);

// se chegámos aqui e nada rebentou durante 1.5 s, o boot loader deixa de reverter para o .ipk
setTimeout(() => { window.__MH_OK = true; }, 1500);
