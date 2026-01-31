# 🎰 LoL 슬롯 머신 (Duck Roulette)

리그 오브 레전드 챔피언, 라인, 템트리를 랜덤으로 정해주는 슬롯 머신 웹앱입니다.

![LoL Slot Machine](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎮 데모

**[https://duckroulette-seven.vercel.app](https://duckroulette-seven.vercel.app)**

## ✨ 기능

- 🎯 **챔피언 랜덤 선택** - 172개 이상의 LoL 챔피언 지원
- 🗺️ **라인 랜덤 선택** - 탑, 정글, 미드, 원딜, 서포터
- 💥 **템트리 랜덤 선택** - AD(물리) / AP(마법)
- 🪙 **코인 투입 애니메이션** - 실제 슬롯머신 같은 인터랙션
- 🔊 **사운드 효과** - 스핀 및 결과 효과음
- 🎨 **다양한 테마** - 여러 색상 테마 지원
- 📱 **반응형 디자인** - 모바일/데스크톱 지원
- 🎊 **컨페티 효과** - 결과 발표 시 축하 효과

## 🛠️ 기술 스택

| 분류 | 기술 |
|------|------|
| **Frontend** | React 18, TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS |
| **Animation** | Framer Motion |
| **Deployment** | Vercel |

## 🚀 시작하기

### 설치

```bash
# 저장소 클론
git clone https://github.com/Korea-Maker/duck_roulette.git
cd duck_roulette

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 📁 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── SlotMachine.tsx  # 메인 슬롯 머신
│   ├── SlotReel.tsx     # 개별 슬롯 릴
│   ├── SlotItem.tsx     # 슬롯 아이템
│   ├── SpinButton.tsx   # 스핀 버튼
│   ├── ResultDisplay/   # 결과 표시 모달
│   ├── ThemeSelector.tsx # 테마 선택기
│   └── SpinHistory.tsx  # 스핀 히스토리
├── data/                # 정적 데이터
│   ├── champions.ts     # 챔피언 목록
│   ├── lanes.ts         # 라인 정보
│   └── damageTypes.ts   # 데미지 타입
├── hooks/               # 커스텀 훅
│   ├── useSlotMachine.ts
│   ├── useSound.ts
│   └── useSpinHistory.ts
├── config/              # 설정
│   ├── constants.ts     # 상수
│   └── api.ts           # API 설정
├── contexts/            # React Context
├── types/               # TypeScript 타입
└── utils/               # 유틸리티 함수
```

## ⚙️ 설정

### 슬롯 설정 (`src/config/constants.ts`)

```typescript
export const SLOT_CONFIG = {
  ITEM_HEIGHT: 64,      // 슬롯 아이템 높이 (px)
  VISIBLE_ITEMS: 3,     // 보이는 아이템 수
  SPIN_DURATION: 3000,  // 스핀 지속 시간 (ms)
  SPIN_ITEMS_COUNT: 30, // 스핀 중 보여줄 아이템 수
};
```

## 🎨 테마

다양한 테마를 지원합니다:
- Pure Dark (기본)
- Ocean Calm
- Sunset Warm
- Soft Gold
- Summoner's Rift

## 🔄 자동 챔피언 업데이트

GitHub Actions를 통해 새로운 챔피언이 출시되면 자동으로 업데이트됩니다.

## 📝 라이선스

MIT License

## 👨‍💻 제작자

**제로콕** - [Korea-Maker](https://github.com/Korea-Maker)

---

⭐ 이 프로젝트가 마음에 드셨다면 Star를 눌러주세요!
