#!/usr/bin/env node
/**
 * Riot API에서 최신 챔피언 목록을 가져와 champions.ts 업데이트
 */

const fs = require('fs');
const path = require('path');

const VERSIONS_URL = 'https://ddragon.leagueoflegends.com/api/versions.json';
const CHAMPIONS_URL = (version) =>
  `https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/champion.json`;

// 챔피언별 대표 색상 (기존 색상 유지, 새 챔피언은 자동 생성)
const CHAMPION_COLORS = {
  Aatrox: '#ff4444', Ahri: '#ff69b4', Akali: '#00ff88', Akshan: '#ffaa44',
  Alistar: '#9966ff', Ambessa: '#c9a227', Amumu: '#44ff88', Anivia: '#00ddff',
  Annie: '#ff6644', Aphelios: '#4466ff', Ashe: '#66ccff', AurelionSol: '#8855ff',
  Aurora: '#ff88ff', Azir: '#ffcc44', Bard: '#ffdd77', Belveth: '#cc44ff',
  Blitzcrank: '#ffaa00', Brand: '#ff5500', Braum: '#4488ff', Briar: '#ff3366',
  Caitlyn: '#6666ff', Camille: '#00ccff', Cassiopeia: '#44ff44', Chogath: '#9944ff',
  Corki: '#ff8844', Darius: '#cc2222', Diana: '#6688ff', Draven: '#ff6644',
  DrMundo: '#9966ff', Ekko: '#00ffcc', Elise: '#ff44aa', Evelynn: '#ff44ff',
  Ezreal: '#ffcc44', Fiddlesticks: '#44aa44', Fiora: '#ff6688', Fizz: '#44ddff',
  Galio: '#6688cc', Gangplank: '#ff8844', Garen: '#4466ff', Gnar: '#ff8844',
  Gragas: '#cc6644', Graves: '#886644', Gwen: '#88ccff', Hecarim: '#44ffaa',
  Heimerdinger: '#ffcc44', Hwei: '#ff8866', Illaoi: '#44cc88', Irelia: '#ff66aa',
  Ivern: '#44aa44', Janna: '#aaccff', JarvanIV: '#ffcc44', Jax: '#9966ff',
  Jayce: '#ffcc44', Jhin: '#cc4466', Jinx: '#ff66aa', Kaisa: '#cc44ff',
  Kalista: '#44ffcc', Karma: '#44ccaa', Karthus: '#44ff88', Kassadin: '#6644ff',
  Katarina: '#ff4466', Kayle: '#ffcc44', Kayn: '#ff4466', Kennen: '#9944ff',
  Khazix: '#9944ff', Kindred: '#6688ff', Kled: '#ff6644', KogMaw: '#88cc44',
  KSante: '#ffaa44', Leblanc: '#cc66ff', LeeSin: '#ff8844', Leona: '#ffcc44',
  Lillia: '#ff88cc', Lissandra: '#4466ff', Lucian: '#ffcc88', Lulu: '#cc88ff',
  Lux: '#ffee88', Malphite: '#668899', Malzahar: '#9944ff', Maokai: '#448844',
  MasterYi: '#6699ff', Mel: '#d4af37', Milio: '#ff8844', MissFortune: '#ff4466',
  MonkeyKing: '#ff9944', Mordekaiser: '#44cc88', Morgana: '#9944cc', Naafiri: '#cc6644',
  Nami: '#44ccff', Nasus: '#ccaa44', Nautilus: '#cc8844', Neeko: '#ff88cc',
  Nidalee: '#88aa44', Nilah: '#44aaff', Nocturne: '#4466aa', Nunu: '#4488ff',
  Olaf: '#ff8844', Orianna: '#ffcc88', Ornn: '#ff6644', Pantheon: '#ffcc44',
  Poppy: '#4488ff', Pyke: '#44aa88', Qiyana: '#ffaa44', Quinn: '#8866cc',
  Rakan: '#ff88cc', Rammus: '#ffcc44', RekSai: '#cc66aa', Rell: '#ff8844',
  Renata: '#44cc88', Renekton: '#44aa44', Rengar: '#888844', Riven: '#44cc88',
  Rumble: '#ff6644', Ryze: '#4466ff', Samira: '#ff4466', Sejuani: '#4488aa',
  Senna: '#44aa88', Seraphine: '#ff88cc', Sett: '#ff6644', Shaco: '#ff8844',
  Shen: '#4466aa', Shyvana: '#ff4466', Singed: '#44aa44', Sion: '#884444',
  Sivir: '#ffaa44', Skarner: '#9966cc', Smolder: '#ff8844', Sona: '#4488ff',
  Soraka: '#ffcc88', Swain: '#cc4444', Sylas: '#4488cc', Syndra: '#9944ff',
  TahmKench: '#448866', Taliyah: '#cc8866', Talon: '#886688', Taric: '#88aacc',
  Teemo: '#ffaa44', Thresh: '#44cc88', Tristana: '#cc88ff', Trundle: '#4488aa',
  Tryndamere: '#ff4466', TwistedFate: '#ffcc44', Twitch: '#44aa44', Udyr: '#cc8844',
  Urgot: '#448844', Varus: '#cc44aa', Vayne: '#cc4466', Veigar: '#9944ff',
  Velkoz: '#cc66ff', Vex: '#888899', Vi: '#ff66aa', Viego: '#44ccaa',
  Viktor: '#ffcc44', Vladimir: '#cc2244', Volibear: '#4488cc', Warwick: '#448866',
  Xayah: '#ff4488', Xerath: '#4488ff', XinZhao: '#ffaa44', Yasuo: '#44ccff',
  Yone: '#ff4466', Yorick: '#44aa66', Yuumi: '#ff88ff', Yunara: '#88ddff',
  Zaahen: '#cc66ff', Zac: '#66ff44', Zed: '#ff4466', Zeri: '#44ffcc',
  Ziggs: '#ffaa44', Zilean: '#ffcc88', Zoe: '#ff88cc', Zyra: '#ff4466'
};

// 랜덤 색상 생성 (새 챔피언용)
function generateColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 70%, 60%)`;
}

function hslToHex(hsl) {
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return '#888888';

  let [, h, s, l] = match.map(Number);
  s /= 100;
  l /= 100;

  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

async function main() {
  try {
    console.log('🔍 최신 버전 확인 중...');
    const versionsRes = await fetch(VERSIONS_URL);
    const versions = await versionsRes.json();
    const latestVersion = versions[0];
    console.log(`📦 최신 버전: ${latestVersion}`);

    console.log('📥 챔피언 데이터 다운로드 중...');
    const championsRes = await fetch(CHAMPIONS_URL(latestVersion));
    const championsData = await championsRes.json();

    // API 응답 검증용 정규식 (영문, 숫자, 공백, 일부 특수문자 허용)
    const VALID_NAME_REGEX = /^[a-zA-Z0-9\s'.&\-:!()]+$/;

    const champions = Object.entries(championsData.data)
      .filter(([id, data]) => {
        // id 검증: 문자열이고 허용 문자만 포함
        if (typeof id !== 'string' || !VALID_NAME_REGEX.test(id)) {
          console.error(`⚠️ 잘못된 챔피언 id 형식: ${JSON.stringify(id)}`);
          return false;
        }
        // name 검증: 문자열이고 허용 문자만 포함
        if (typeof data.name !== 'string' || !VALID_NAME_REGEX.test(data.name)) {
          console.error(`⚠️ 잘못된 챔피언 name 형식 (id: ${id}): ${JSON.stringify(data.name)}`);
          return false;
        }
        // tags 검증: 배열이면 유효
        if (data.tags && !Array.isArray(data.tags)) {
          console.error(`⚠️ 잘못된 tags 형식 (id: ${id}): ${JSON.stringify(data.tags)}`);
          return false;
        }
        return true;
      })
      .map(([id, data]) => ({
        id,
        name: data.name,
        koreanName: data.name,
        color: CHAMPION_COLORS[id] || hslToHex(generateColor(id)),
        tags: data.tags || []
      }))
      .sort((a, b) => a.id.localeCompare(b.id));

    console.log(`✅ ${champions.length}개 챔피언 로드 완료`);

    const content = `import type { Champion } from '../types';

// Riot Data Dragon 기반 챔피언 목록 (${champions.length}개) - 각 챔피언의 대표 색상 및 역할 포함
// 자동 생성됨 - 수동 수정 금지
// 최종 업데이트: ${new Date().toISOString().split('T')[0]}
// API 버전: ${latestVersion}
export const CHAMPIONS: Champion[] = [
${champions.map(c => `  { id: '${c.id}', name: '${c.name.replace(/'/g, "\\'")}', koreanName: '${c.koreanName.replace(/'/g, "\\'")}', color: '${c.color}', tags: [${c.tags.map(t => `'${t}'`).join(', ')}] },`).join('\n')}
];

// 모든 챔피언 역할 목록
export const CHAMPION_TAGS = ['Fighter', 'Tank', 'Mage', 'Assassin', 'Marksman', 'Support'] as const;

// 역할별 한글 이름
export const TAG_NAMES: Record<string, string> = {
  Fighter: '전사',
  Tank: '탱커',
  Mage: '마법사',
  Assassin: '암살자',
  Marksman: '원거리 딜러',
  Support: '서포터',
};
`;

    const outputPath = path.join(__dirname, '../src/data/champions.ts');
    fs.writeFileSync(outputPath, content, 'utf8');
    console.log(`💾 ${outputPath} 저장 완료`);

    // CDN 버전 업데이트
    console.log('🔄 CDN 버전 업데이트 중...');

    // .env 파일 업데이트
    const envPath = path.join(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8');
      envContent = envContent.replace(/VITE_DDRAGON_VERSION=[\d.]+/, `VITE_DDRAGON_VERSION=${latestVersion}`);
      fs.writeFileSync(envPath, envContent, 'utf8');
      console.log(`💾 .env 업데이트 완료 (${latestVersion})`);
    }

    // .env.example 파일 업데이트
    const envExamplePath = path.join(__dirname, '../.env.example');
    if (fs.existsSync(envExamplePath)) {
      let envExampleContent = fs.readFileSync(envExamplePath, 'utf8');
      envExampleContent = envExampleContent.replace(/VITE_DDRAGON_VERSION=[\d.]+/, `VITE_DDRAGON_VERSION=${latestVersion}`);
      fs.writeFileSync(envExamplePath, envExampleContent, 'utf8');
      console.log(`💾 .env.example 업데이트 완료 (${latestVersion})`);
    }

    // src/config/api.ts 파일 업데이트
    const apiConfigPath = path.join(__dirname, '../src/config/api.ts');
    if (fs.existsSync(apiConfigPath)) {
      let apiContent = fs.readFileSync(apiConfigPath, 'utf8');
      apiContent = apiContent.replace(/'\d+\.\d+\.\d+'/g, `'${latestVersion}'`);
      fs.writeFileSync(apiConfigPath, apiContent, 'utf8');
      console.log(`💾 src/config/api.ts 업데이트 완료 (${latestVersion})`);
    }

    // src/components/SpinHistory.tsx 파일 업데이트 (하드코딩된 버전)
    const spinHistoryPath = path.join(__dirname, '../src/components/SpinHistory.tsx');
    if (fs.existsSync(spinHistoryPath)) {
      let spinHistoryContent = fs.readFileSync(spinHistoryPath, 'utf8');
      spinHistoryContent = spinHistoryContent.replace(/cdn\/\d+\.\d+\.\d+\/img/g, `cdn/${latestVersion}/img`);
      fs.writeFileSync(spinHistoryPath, spinHistoryContent, 'utf8');
      console.log(`💾 src/components/SpinHistory.tsx 업데이트 완료 (${latestVersion})`);
    }

    console.log('🎉 챔피언 목록 및 CDN 버전 업데이트 완료!');

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    process.exit(1);
  }
}

main();
