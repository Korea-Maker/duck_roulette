export const API_CONFIG = {
  DDRAGON_VERSION: import.meta.env.VITE_DDRAGON_VERSION || '16.2.1',
  DDRAGON_BASE_URL: import.meta.env.VITE_DDRAGON_BASE_URL || 'https://ddragon.leagueoflegends.com',

  // Helper methods for constructing API URLs
  getChampionImageUrl: (championKey: string) => {
    return `${import.meta.env.VITE_DDRAGON_BASE_URL || 'https://ddragon.leagueoflegends.com'}/cdn/${import.meta.env.VITE_DDRAGON_VERSION || '16.2.1'}/img/champion/${championKey}.png`;
  },

  getChampionSplashUrl: (championKey: string, skinNum: number = 0) => {
    return `${import.meta.env.VITE_DDRAGON_BASE_URL || 'https://ddragon.leagueoflegends.com'}/cdn/img/champion/splash/${championKey}_${skinNum}.jpg`;
  },

  getChampionLoadingUrl: (championKey: string, skinNum: number = 0) => {
    return `${import.meta.env.VITE_DDRAGON_BASE_URL || 'https://ddragon.leagueoflegends.com'}/cdn/img/champion/loading/${championKey}_${skinNum}.jpg`;
  }
} as const;
