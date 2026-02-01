const DDRAGON_VERSION = import.meta.env.VITE_DDRAGON_VERSION || '16.2.1';
const DDRAGON_BASE_URL = import.meta.env.VITE_DDRAGON_BASE_URL || 'https://ddragon.leagueoflegends.com';

export const API_CONFIG = {
  DDRAGON_VERSION,
  DDRAGON_BASE_URL,

  // Helper methods for constructing API URLs
  getChampionImageUrl: (championKey: string) => {
    return `${DDRAGON_BASE_URL}/cdn/${DDRAGON_VERSION}/img/champion/${championKey}.png`;
  },

  getChampionSplashUrl: (championKey: string, skinNum: number = 0) => {
    return `${DDRAGON_BASE_URL}/cdn/img/champion/splash/${championKey}_${skinNum}.jpg`;
  },

  getChampionLoadingUrl: (championKey: string, skinNum: number = 0) => {
    return `${DDRAGON_BASE_URL}/cdn/img/champion/loading/${championKey}_${skinNum}.jpg`;
  }
} as const;
