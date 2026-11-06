/// <reference types="vite/client" />
declare const __APP_VERSION__: string;
declare const __BUILD__: number;
declare const __NATIVE__: number;
interface ImportMetaEnv { readonly VITE_UPDATE_BASE?: string }
interface Window {
  __MH?: { build: number; native: number; source: 'pkg' | 'ota'; version: string };
  __MH_OK?: boolean;
}
