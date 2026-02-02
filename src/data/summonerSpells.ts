import type { SummonerSpell } from '../types';

// 소환사 주문 목록 (소환사 협곡에서 사용 가능한 것들)
export const SUMMONER_SPELLS: SummonerSpell[] = [
  { id: 'SummonerFlash', name: 'Flash', koreanName: '점멸', icon: 'SummonerFlash.png' },
  { id: 'SummonerDot', name: 'Ignite', koreanName: '점화', icon: 'SummonerDot.png' },
  { id: 'SummonerExhaust', name: 'Exhaust', koreanName: '탈진', icon: 'SummonerExhaust.png' },
  { id: 'SummonerHeal', name: 'Heal', koreanName: '치유', icon: 'SummonerHeal.png' },
  { id: 'SummonerBarrier', name: 'Barrier', koreanName: '방어막', icon: 'SummonerBarrier.png' },
  { id: 'SummonerTeleport', name: 'Teleport', koreanName: '순간이동', icon: 'SummonerTeleport.png' },
  { id: 'SummonerSmite', name: 'Smite', koreanName: '강타', icon: 'SummonerSmite.png' },
  { id: 'SummonerHaste', name: 'Ghost', koreanName: '유체화', icon: 'SummonerHaste.png' },
  { id: 'SummonerBoost', name: 'Cleanse', koreanName: '정화', icon: 'SummonerBoost.png' },
];
