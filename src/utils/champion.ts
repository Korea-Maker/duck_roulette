import { API_CONFIG } from '../config/api';

/**
 * 챔피언 ID로 Data Dragon 이미지 URL을 생성합니다.
 * @param championId - 챔피언 ID (예: 'Ahri', 'Lux')
 * @returns 챔피언 이미지 URL
 */
export function getChampionImageUrl(championId: string): string {
  return `${API_CONFIG.DDRAGON_BASE_URL}/cdn/${API_CONFIG.DDRAGON_VERSION}/img/champion/${championId}.png`;
}

/**
 * 챔피언 스플래시 아트 URL을 생성합니다.
 * @param championId - 챔피언 ID
 * @param skinNum - 스킨 번호 (기본: 0)
 * @returns 스플래시 아트 URL
 */
export function getChampionSplashUrl(championId: string, skinNum: number = 0): string {
  return `${API_CONFIG.DDRAGON_BASE_URL}/cdn/img/champion/splash/${championId}_${skinNum}.jpg`;
}
