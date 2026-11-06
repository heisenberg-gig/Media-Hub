type P = { size?: number; class?: string };
const base = (size = 24) => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', 'stroke-width': 1.6, 'stroke-linecap': 'round' as const, 'stroke-linejoin': 'round' as const,
});

export const IconTv = ({ size, ...r }: P) => (
  <svg {...base(size)} {...r}><rect x="3" y="7" width="18" height="13" rx="3.5" /><path d="M9 3l3 4 3-4" /><path d="M8 14l2.5-2.5L13 14l3-3" /></svg>
);
export const IconReel = ({ size, ...r }: P) => (
  <svg {...base(size)} {...r}><rect x="3" y="3" width="18" height="18" rx="4.5" /><path d="M3 8.5h18" /><path d="M8 3l2 5.5M14 3l2 5.5" /><path d="M10.5 12.5v5l4.2-2.5z" /></svg>
);
export const IconRadio = ({ size, ...r }: P) => (
  <svg {...base(size)} {...r}><rect x="3" y="8" width="18" height="12" rx="3.5" /><path d="M7 8l9-5" /><circle cx="8.5" cy="14" r="2.2" /><path d="M14 12.5h4M14 15.5h2" /></svg>
);
export const IconMic = ({ size, ...r }: P) => (
  <svg {...base(size)} {...r} fill="currentColor" stroke="none"><rect x="9" y="2.5" width="6" height="12" rx="3" /><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /><path d="M12 18v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
);
export const IconGear = ({ size, ...r }: P) => (
  <svg {...base(size)} {...r}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
);
export const IconSearch = ({ size, ...r }: P) => (
  <svg {...base(size)} {...r}><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>
);
export const IconUser = ({ size, ...r }: P) => (
  <svg {...base(size)} {...r}><circle cx="12" cy="8.5" r="3.6" /><path d="M5 20c.9-3.6 3.6-5.4 7-5.4s6.1 1.8 7 5.4" /></svg>
);
export const IconBack = ({ size, ...r }: P) => (
  <svg {...base(size)} {...r}><path d="M14.5 5l-7 7 7 7" /></svg>
);
export const IconCloud = ({ size, ...r }: P) => (
  <svg {...base(size)} {...r} fill="currentColor" stroke="none"><path d="M7.5 19a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18.4 11 4 4 0 0 1 18 19z" /></svg>
);
export const IconSun = ({ size, ...r }: P) => (
  <svg {...base(size)} {...r}><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" /><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" /></svg>
);
export const IconRain = ({ size, ...r }: P) => (
  <svg {...base(size)} {...r}><path d="M7.5 16a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18.4 8 4 4 0 0 1 18 16z" /><path d="M9 19l-1 2M13 19l-1 2M17 19l-1 2" /></svg>
);
