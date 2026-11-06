import { persisted } from '../core/store';
import { pt, type Dict } from './pt';
import { en } from './en';

export type Lang = 'pt-PT' | 'en';
const dicts: Record<Lang, Dict> = { 'pt-PT': pt, en };

const guess: Lang = (navigator.language || 'pt').toLowerCase().startsWith('pt') ? 'pt-PT' : 'en';
export const lang = persisted<Lang>('mh.lang', guess);

export function useT() {
  const l = lang.use();
  return (k: keyof Dict) => dicts[l][k];
}
export const tNow = (k: keyof Dict) => dicts[lang.get()][k];
