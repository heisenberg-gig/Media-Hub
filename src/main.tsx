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
