// 스트랫 룰렛 전략 데이터
// 다양한 카테고리와 난이도의 챌린지 규칙 30개

export interface Strategy {
  id: string;
  name: string;
  koreanName: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  category: 'item' | 'combat' | 'objective' | 'utility';
}

export const STRATEGIES: Strategy[] = [
  // === ITEM 카테고리 ===
  {
    id: 'no-boots',
    name: 'No Boots',
    koreanName: '부츠 금지',
    description: '부츠를 구매하지 않고 게임을 진행하세요.',
    difficulty: 'easy',
    category: 'item',
  },
  {
    id: 'ap-only',
    name: 'AP Items Only',
    koreanName: 'AP 아이템만',
    description: 'AP 아이템만 구매할 수 있습니다.',
    difficulty: 'medium',
    category: 'item',
  },
  {
    id: 'tank-after-core',
    name: 'Tank After Core',
    koreanName: '1코어 이후 탱커',
    description: '첫 번째 완성 아이템 이후 탱커 아이템만 구매하세요.',
    difficulty: 'medium',
    category: 'item',
  },
  {
    id: 'budget-build',
    name: 'Budget Build',
    koreanName: '가성비 빌드',
    description: '2500골드 이하 아이템만 구매할 수 있습니다.',
    difficulty: 'hard',
    category: 'item',
  },
  {
    id: 'no-mythic',
    name: 'No Core Item',
    koreanName: '코어템 금지',
    description: '3000골드 이상의 아이템을 구매하지 마세요.',
    difficulty: 'hard',
    category: 'item',
  },
  {
    id: 'support-items-only',
    name: 'Support Items Only',
    koreanName: '서포터 아이템만',
    description: '서포터용 아이템만 구매할 수 있습니다.',
    difficulty: 'extreme',
    category: 'item',
  },
  {
    id: 'same-component',
    name: 'Same Component Rush',
    koreanName: '같은 부품 도배',
    description: '같은 조합 부품 아이템을 3개 이상 구매한 후 완성하세요.',
    difficulty: 'easy',
    category: 'item',
  },
  {
    id: 'full-crit',
    name: 'Full Crit Build',
    koreanName: '풀 치명타 빌드',
    description: '치명타 아이템으로만 빌드를 완성하세요.',
    difficulty: 'medium',
    category: 'item',
  },

  // === COMBAT 카테고리 ===
  {
    id: 'two-kills-early',
    name: 'Early Aggression',
    koreanName: '10분 전 2킬',
    description: '10분 전에 2킬을 달성해야 합니다.',
    difficulty: 'medium',
    category: 'combat',
  },
  {
    id: 'no-kill-assist-only',
    name: 'Assist King',
    koreanName: '킬 없이 어시스트만',
    description: '킬을 하지 않고 어시스트만으로 플레이하세요.',
    difficulty: 'hard',
    category: 'combat',
  },
  {
    id: 'first-blood',
    name: 'First Blood Hunter',
    koreanName: '퍼스트 블러드 도전',
    description: '퍼스트 블러드를 반드시 획득하세요.',
    difficulty: 'medium',
    category: 'combat',
  },
  {
    id: 'no-death',
    name: 'Deathless',
    koreanName: '무데스 챌린지',
    description: '한 번도 죽지 않고 게임을 끝내세요.',
    difficulty: 'extreme',
    category: 'combat',
  },
  {
    id: 'solo-kill-3',
    name: 'Solo Kill Master',
    koreanName: '솔로킬 3회',
    description: '솔로킬을 3회 이상 달성하세요.',
    difficulty: 'hard',
    category: 'combat',
  },
  {
    id: 'no-flash-combat',
    name: 'No Flash Fighter',
    koreanName: '플래시 없이 싸우기',
    description: '전투 중 플래시를 사용하지 마세요.',
    difficulty: 'easy',
    category: 'combat',
  },
  {
    id: 'pentakill-attempt',
    name: 'Pentakill Attempt',
    koreanName: '펜타킬 도전',
    description: '팀파이트에서 펜타킬을 시도하세요.',
    difficulty: 'extreme',
    category: 'combat',
  },

  // === OBJECTIVE 카테고리 ===
  {
    id: 'jungle-50',
    name: 'Jungle Hunter',
    koreanName: '정글 몬스터 50마리',
    description: '정글 몬스터를 50마리 이상 처치하세요.',
    difficulty: 'medium',
    category: 'objective',
  },
  {
    id: 'turret-3',
    name: 'Tower Destroyer',
    koreanName: '포탑 3개 파괴',
    description: '포탑을 3개 이상 직접 파괴하세요.',
    difficulty: 'medium',
    category: 'objective',
  },
  {
    id: 'baron-solo',
    name: 'Baron Solo',
    koreanName: '바론 솔로 도전',
    description: '바론을 혼자서 처치하세요.',
    difficulty: 'extreme',
    category: 'objective',
  },
  {
    id: 'dragon-steal',
    name: 'Dragon Stealer',
    koreanName: '드래곤 스틸',
    description: '상대 팀이 치고 있는 드래곤을 스틸하세요.',
    difficulty: 'hard',
    category: 'objective',
  },
  {
    id: 'cs-200',
    name: 'CS Master',
    koreanName: 'CS 200개 달성',
    description: '20분 전에 CS 200개를 달성하세요.',
    difficulty: 'hard',
    category: 'objective',
  },
  {
    id: 'no-cs',
    name: 'No CS Challenge',
    koreanName: 'CS 없이 플레이',
    description: '미니언을 직접 처치하지 않고 플레이하세요.',
    difficulty: 'extreme',
    category: 'objective',
  },
  {
    id: 'rift-herald',
    name: 'Herald Rider',
    koreanName: '전령 소환 2회',
    description: '전령을 2회 소환하여 포탑에 돌진시키세요.',
    difficulty: 'medium',
    category: 'objective',
  },
  {
    id: 'first-turret',
    name: 'First Tower',
    koreanName: '첫 포탑 파괴',
    description: '게임에서 가장 먼저 포탑을 파괴하세요.',
    difficulty: 'easy',
    category: 'objective',
  },

  // === UTILITY 카테고리 ===
  {
    id: 'ward-20',
    name: 'Vision Master',
    koreanName: '와드 20개 설치',
    description: '와드를 20개 이상 설치하세요.',
    difficulty: 'easy',
    category: 'utility',
  },
  {
    id: 'roam-all-lanes',
    name: 'Global Roamer',
    koreanName: '전 라인 로밍',
    description: '10분 전에 모든 라인에 로밍하여 킬/어시스트를 기록하세요.',
    difficulty: 'hard',
    category: 'utility',
  },
  {
    id: 'ping-leader',
    name: 'Ping Commander',
    koreanName: '핑 사령관',
    description: '모든 오브젝트 싸움 전 20초 전에 핑을 찍으세요.',
    difficulty: 'easy',
    category: 'utility',
  },
  {
    id: 'shotcaller',
    name: 'Shotcaller',
    koreanName: '샷콜러',
    description: '팀의 모든 오브젝트 콜을 주도하세요.',
    difficulty: 'medium',
    category: 'utility',
  },
  {
    id: 'deny-vision',
    name: 'Vision Denier',
    koreanName: '와드 파괴왕',
    description: '상대 와드를 10개 이상 파괴하세요.',
    difficulty: 'medium',
    category: 'utility',
  },
  {
    id: 'no-recall',
    name: 'No Recall',
    koreanName: '리콜 금지',
    description: '10분 동안 리콜하지 않고 버티세요.',
    difficulty: 'hard',
    category: 'utility',
  },
  {
    id: 'chat-ban',
    name: 'Silent Player',
    koreanName: '채팅 금지',
    description: '채팅을 사용하지 않고 핑으로만 소통하세요.',
    difficulty: 'easy',
    category: 'utility',
  },
];

export const DIFFICULTY_COLORS: Record<Strategy['difficulty'], string> = {
  easy: '#4ade80',
  medium: '#facc15',
  hard: '#f97316',
  extreme: '#ef4444',
};

export const DIFFICULTY_LABELS: Record<Strategy['difficulty'], string> = {
  easy: '쉬움',
  medium: '보통',
  hard: '어려움',
  extreme: '극한',
};

export const CATEGORY_LABELS: Record<Strategy['category'], string> = {
  item: '아이템',
  combat: '전투',
  objective: '오브젝트',
  utility: '유틸리티',
};

export const CATEGORY_ICONS: Record<Strategy['category'], string> = {
  item: '🛒',
  combat: '⚔️',
  objective: '🏰',
  utility: '🔧',
};
