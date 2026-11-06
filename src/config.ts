/** Onde a app procura atualizações (branch `ota`, publicado automaticamente pelo GitHub Actions). */
export const UPDATE_BASE =
  import.meta.env.VITE_UPDATE_BASE || 'https://raw.githubusercontent.com/heisenberg-gig/Media-Hub/ota/';
