import type { RuneTree } from '../types';

// 룬 데이터 (5개 트리)
export const RUNE_TREES: RuneTree[] = [
  {
    id: 'Precision',
    name: 'Precision',
    koreanName: '정밀',
    icon: 'perk-images/Styles/7201_Precision.png',
    keystones: [
      { id: 8005, name: 'Press the Attack', koreanName: '집중 공격', icon: 'perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png' },
      { id: 8008, name: 'Lethal Tempo', koreanName: '치명적 속도', icon: 'perk-images/Styles/Precision/LethalTempo/LethalTempoTemp.png' },
      { id: 8021, name: 'Fleet Footwork', koreanName: '기민한 발놀림', icon: 'perk-images/Styles/Precision/FleetFootwork/FleetFootwork.png' },
      { id: 8010, name: 'Conqueror', koreanName: '정복자', icon: 'perk-images/Styles/Precision/Conqueror/Conqueror.png' },
    ],
    slots: [
      [
        { id: 9101, name: 'Overheal', koreanName: '과다치유', icon: 'perk-images/Styles/Precision/Overheal.png' },
        { id: 9111, name: 'Triumph', koreanName: '승전보', icon: 'perk-images/Styles/Precision/Triumph.png' },
        { id: 8009, name: 'Presence of Mind', koreanName: '침착', icon: 'perk-images/Styles/Precision/PresenceOfMind/PresenceOfMind.png' },
      ],
      [
        { id: 9104, name: 'Legend: Alacrity', koreanName: '전설: 민첩함', icon: 'perk-images/Styles/Precision/LegendAlacrity/LegendAlacrity.png' },
        { id: 9105, name: 'Legend: Tenacity', koreanName: '전설: 강인함', icon: 'perk-images/Styles/Precision/LegendTenacity/LegendTenacity.png' },
        { id: 9103, name: 'Legend: Bloodline', koreanName: '전설: 핏빛 길', icon: 'perk-images/Styles/Precision/LegendBloodline/LegendBloodline.png' },
      ],
      [
        { id: 8014, name: 'Coup de Grace', koreanName: '최후의 일격', icon: 'perk-images/Styles/Precision/CoupDeGrace/CoupDeGrace.png' },
        { id: 8017, name: 'Cut Down', koreanName: '체력차 극복', icon: 'perk-images/Styles/Precision/CutDown/CutDown.png' },
        { id: 8299, name: 'Last Stand', koreanName: '최후의 저항', icon: 'perk-images/Styles/Precision/LastStand/LastStand.png' },
      ],
    ],
  },
  {
    id: 'Domination',
    name: 'Domination',
    koreanName: '지배',
    icon: 'perk-images/Styles/7200_Domination.png',
    keystones: [
      { id: 8112, name: 'Electrocute', koreanName: '감전', icon: 'perk-images/Styles/Domination/Electrocute/Electrocute.png' },
      { id: 8124, name: 'Predator', koreanName: '포식자', icon: 'perk-images/Styles/Domination/Predator/Predator.png' },
      { id: 8128, name: 'Dark Harvest', koreanName: '어둠의 수확', icon: 'perk-images/Styles/Domination/DarkHarvest/DarkHarvest.png' },
      { id: 9923, name: 'Hail of Blades', koreanName: '칼날비', icon: 'perk-images/Styles/Domination/HailOfBlades/HailOfBlades.png' },
    ],
    slots: [
      [
        { id: 8126, name: 'Cheap Shot', koreanName: '비열한 한 방', icon: 'perk-images/Styles/Domination/CheapShot/CheapShot.png' },
        { id: 8139, name: 'Taste of Blood', koreanName: '피의 맛', icon: 'perk-images/Styles/Domination/TasteOfBlood/GreenTerror_TasteOfBlood.png' },
        { id: 8143, name: 'Sudden Impact', koreanName: '돌발 일격', icon: 'perk-images/Styles/Domination/SuddenImpact/SuddenImpact.png' },
      ],
      [
        { id: 8136, name: 'Zombie Ward', koreanName: '좀비 와드', icon: 'perk-images/Styles/Domination/ZombieWard/ZombieWard.png' },
        { id: 8120, name: 'Ghost Poro', koreanName: '유령 포로', icon: 'perk-images/Styles/Domination/GhostPoro/GhostPoro.png' },
        { id: 8138, name: 'Eyeball Collection', koreanName: '사냥의 증표', icon: 'perk-images/Styles/Domination/EyeballCollection/EyeballCollection.png' },
      ],
      [
        { id: 8135, name: 'Treasure Hunter', koreanName: '보물 사냥꾼', icon: 'perk-images/Styles/Domination/TreasureHunter/TreasureHunter.png' },
        { id: 8134, name: 'Ingenious Hunter', koreanName: '영리한 사냥꾼', icon: 'perk-images/Styles/Domination/IngeniousHunter/IngeniousHunter.png' },
        { id: 8105, name: 'Relentless Hunter', koreanName: '끈질긴 사냥꾼', icon: 'perk-images/Styles/Domination/RelentlessHunter/RelentlessHunter.png' },
        { id: 8106, name: 'Ultimate Hunter', koreanName: '궁극의 사냥꾼', icon: 'perk-images/Styles/Domination/UltimateHunter/UltimateHunter.png' },
      ],
    ],
  },
  {
    id: 'Sorcery',
    name: 'Sorcery',
    koreanName: '마법',
    icon: 'perk-images/Styles/7202_Sorcery.png',
    keystones: [
      { id: 8214, name: 'Summon Aery', koreanName: '콩콩이 소환', icon: 'perk-images/Styles/Sorcery/SummonAery/SummonAery.png' },
      { id: 8229, name: 'Arcane Comet', koreanName: '신비로운 유성', icon: 'perk-images/Styles/Sorcery/ArcaneComet/ArcaneComet.png' },
      { id: 8230, name: 'Phase Rush', koreanName: '난입', icon: 'perk-images/Styles/Sorcery/PhaseRush/PhaseRush.png' },
    ],
    slots: [
      [
        { id: 8224, name: 'Nullifying Orb', koreanName: '무효화 구체', icon: 'perk-images/Styles/Sorcery/NullifyingOrb/Pokeshield.png' },
        { id: 8226, name: 'Manaflow Band', koreanName: '마나순환 팔찌', icon: 'perk-images/Styles/Sorcery/ManaflowBand/ManaflowBand.png' },
        { id: 8275, name: 'Nimbus Cloak', koreanName: '빛의 망토', icon: 'perk-images/Styles/Sorcery/NimbusCloak/NimbusCloak.png' },
      ],
      [
        { id: 8210, name: 'Transcendence', koreanName: '깨달음', icon: 'perk-images/Styles/Sorcery/Transcendence/Transcendence.png' },
        { id: 8234, name: 'Celerity', koreanName: '기민함', icon: 'perk-images/Styles/Sorcery/Celerity/CelerityTemp.png' },
        { id: 8233, name: 'Absolute Focus', koreanName: '절대 집중', icon: 'perk-images/Styles/Sorcery/AbsoluteFocus/AbsoluteFocus.png' },
      ],
      [
        { id: 8237, name: 'Scorch', koreanName: '주문 작열', icon: 'perk-images/Styles/Sorcery/Scorch/Scorch.png' },
        { id: 8232, name: 'Waterwalking', koreanName: '물 위를 걷는 자', icon: 'perk-images/Styles/Sorcery/Waterwalking/Waterwalking.png' },
        { id: 8236, name: 'Gathering Storm', koreanName: '폭풍의 결집', icon: 'perk-images/Styles/Sorcery/GatheringStorm/GatheringStorm.png' },
      ],
    ],
  },
  {
    id: 'Resolve',
    name: 'Resolve',
    koreanName: '결의',
    icon: 'perk-images/Styles/7204_Resolve.png',
    keystones: [
      { id: 8437, name: 'Grasp of the Undying', koreanName: '착취의 손아귀', icon: 'perk-images/Styles/Resolve/GraspOfTheUndying/GraspOfTheUndying.png' },
      { id: 8439, name: 'Aftershock', koreanName: '여진', icon: 'perk-images/Styles/Resolve/VeteranAftershock/VeteranAftershock.png' },
      { id: 8465, name: 'Guardian', koreanName: '수호자', icon: 'perk-images/Styles/Resolve/Guardian/Guardian.png' },
    ],
    slots: [
      [
        { id: 8446, name: 'Demolish', koreanName: '철거', icon: 'perk-images/Styles/Resolve/Demolish/Demolish.png' },
        { id: 8463, name: 'Font of Life', koreanName: '생명의 샘', icon: 'perk-images/Styles/Resolve/FontOfLife/FontOfLife.png' },
        { id: 8401, name: 'Shield Bash', koreanName: '보호막 강타', icon: 'perk-images/Styles/Resolve/MirrorShell/MirrorShell.png' },
      ],
      [
        { id: 8429, name: 'Conditioning', koreanName: '사전 준비', icon: 'perk-images/Styles/Resolve/Conditioning/Conditioning.png' },
        { id: 8444, name: 'Second Wind', koreanName: '재생의 바람', icon: 'perk-images/Styles/Resolve/SecondWind/SecondWind.png' },
        { id: 8473, name: 'Bone Plating', koreanName: '뼈 방패', icon: 'perk-images/Styles/Resolve/BonePlating/BonePlating.png' },
      ],
      [
        { id: 8451, name: 'Overgrowth', koreanName: '과잉성장', icon: 'perk-images/Styles/Resolve/Overgrowth/Overgrowth.png' },
        { id: 8453, name: 'Revitalize', koreanName: '소생', icon: 'perk-images/Styles/Resolve/Revitalize/Revitalize.png' },
        { id: 8242, name: 'Unflinching', koreanName: '불굴의 의지', icon: 'perk-images/Styles/Sorcery/Unflinching/Unflinching.png' },
      ],
    ],
  },
  {
    id: 'Inspiration',
    name: 'Inspiration',
    koreanName: '영감',
    icon: 'perk-images/Styles/7203_Whimsy.png',
    keystones: [
      { id: 8351, name: 'Glacial Augment', koreanName: '빙결 강화', icon: 'perk-images/Styles/Inspiration/GlacialAugment/GlacialAugment.png' },
      { id: 8360, name: 'Unsealed Spellbook', koreanName: '봉인 풀린 주문서', icon: 'perk-images/Styles/Inspiration/UnsealedSpellbook/UnsealedSpellbook.png' },
      { id: 8369, name: 'First Strike', koreanName: '선제공격', icon: 'perk-images/Styles/Inspiration/FirstStrike/FirstStrike.png' },
    ],
    slots: [
      [
        { id: 8306, name: 'Hextech Flashtraption', koreanName: '마법공학 점멸기', icon: 'perk-images/Styles/Inspiration/HextechFlashtraption/HextechFlashtraption.png' },
        { id: 8304, name: 'Magical Footwear', koreanName: '마법의 신발', icon: 'perk-images/Styles/Inspiration/MagicalFootwear/MagicalFootwear.png' },
        { id: 8313, name: 'Perfect Timing', koreanName: '완벽한 타이밍', icon: 'perk-images/Styles/Inspiration/PerfectTiming/PerfectTiming.png' },
      ],
      [
        { id: 8321, name: 'Future\'s Market', koreanName: '외상', icon: 'perk-images/Styles/Inspiration/FuturesMarket/FuturesMarket.png' },
        { id: 8316, name: 'Minion Dematerializer', koreanName: '미니언 해체분석기', icon: 'perk-images/Styles/Inspiration/MinionDematerializer/MinionDematerializer.png' },
        { id: 8345, name: 'Biscuit Delivery', koreanName: '비스킷 배달', icon: 'perk-images/Styles/Inspiration/BiscuitDelivery/BiscuitDelivery.png' },
      ],
      [
        { id: 8347, name: 'Cosmic Insight', koreanName: '우주적 통찰력', icon: 'perk-images/Styles/Inspiration/CosmicInsight/CosmicInsight.png' },
        { id: 8410, name: 'Approach Velocity', koreanName: '쾌속 접근', icon: 'perk-images/Styles/Resolve/ApproachVelocity/ApproachVelocity.png' },
        { id: 8352, name: 'Time Warp Tonic', koreanName: '시간 왜곡 물약', icon: 'perk-images/Styles/Inspiration/TimeWarpTonic/TimeWarpTonic.png' },
      ],
    ],
  },
];
