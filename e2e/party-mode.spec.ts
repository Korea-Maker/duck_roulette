import { test, expect, type Page, type ConsoleMessage } from '@playwright/test';

// 파티 모드 테스트는 애니메이션 대기가 길어서 타임아웃 확장
test.use({ actionTimeout: 15000 });

// 콘솔 에러/경고 수집기
interface ConsoleEntry {
  type: string;
  text: string;
  location: string;
}

function setupConsoleListener(page: Page): { errors: ConsoleEntry[]; pageErrors: string[] } {
  const errors: ConsoleEntry[] = [];
  const pageErrors: string[] = [];

  page.on('console', (msg: ConsoleMessage) => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      errors.push({
        type: msg.type(),
        text: msg.text(),
        location: msg.location()?.url || 'unknown',
      });
    }
  });

  page.on('pageerror', (error) => {
    pageErrors.push(`${error.name}: ${error.message}`);
  });

  return { errors, pageErrors };
}

// 결과 모달이 열려있으면 닫는 헬퍼
async function dismissResultModal(page: Page) {
  // 결과 모달의 닫기 버튼 (SVG X 아이콘이 있는 버튼)
  const closeBtn = page.locator('[role="dialog"] button').first();
  if (await closeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
    await closeBtn.click({ force: true });
    await page.waitForTimeout(500);
    return;
  }
  // 솔로 모드 결과 모달 (다른 구조일 수 있음) - z-50 오버레이 클릭
  const overlay = page.locator('.fixed.inset-0.z-40');
  if (await overlay.isVisible({ timeout: 500 }).catch(() => false)) {
    await overlay.click({ force: true, position: { x: 10, y: 10 } });
    await page.waitForTimeout(500);
    return;
  }
  // ESC 키로 닫기 시도
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
}

// 파티 모드로 전환하는 헬퍼
async function switchToPartyMode(page: Page) {
  // 먼저 결과 모달이 열려있으면 닫기
  await dismissResultModal(page);
  // 👥 파티 버튼 클릭
  const partyButton = page.locator('button', { hasText: '파티' });
  await partyButton.click({ force: true });
  // 파티 모드 로딩 대기 (lazy loading)
  await page.waitForSelector('.party-member-slot', { timeout: 10000 });
}

// 솔로 모드로 전환하는 헬퍼
async function switchToSoloMode(page: Page) {
  // 먼저 결과 모달이 열려있으면 닫기
  await dismissResultModal(page);
  const soloButton = page.locator('button', { hasText: '솔로' });
  await soloButton.click({ force: true });
  // 솔로 모드 컨텐츠 로딩 대기
  await page.waitForTimeout(500);
}

// 스핀 버튼 클릭 및 완료 대기 헬퍼
async function spinAndWait(page: Page, waitMs: number = 8000) {
  // SpinButton 컴포넌트: framer-motion 애니메이션이 적용되어 있어 force click 필요
  const spinButton = page.locator('.spin-button');
  // JS로 스크롤 (framer-motion 안정성 대기 회피)
  await spinButton.evaluate(el => el.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(300);
  await spinButton.click({ force: true });
  // 스핀 애니메이션 완료 대기
  await page.waitForTimeout(waitMs);
}

test.describe('파티 모드 E2E 테스트', () => {
  // 파티 모드 테스트는 애니메이션 대기가 길므로 타임아웃 넉넉히
  test.describe.configure({ timeout: 90000 });

  // ==========================================
  // 시나리오 A: 파티 모드 기본 동작
  // ==========================================
  test('시나리오 A: 파티 모드 기본 동작 - 접근 및 로딩', async ({ page }) => {
    const { errors, pageErrors } = setupConsoleListener(page);

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 파티 모드 전환
    await switchToPartyMode(page);

    // 파티 모드가 정상 로딩되었는지 확인
    const partySlots = page.locator('.party-member-slot');
    const slotCount = await partySlots.count();
    console.log(`[시나리오A] 파티 멤버 슬롯 수: ${slotCount}`);

    // 기본 5명의 멤버가 표시되어야 함
    expect(slotCount).toBe(5);

    // 파티 룰렛 헤더 확인
    const header = page.locator('h2', { hasText: '파티 룰렛' });
    await expect(header).toBeVisible();

    // 콘솔 에러 보고
    console.log(`[시나리오A] 콘솔 에러: ${errors.length}개`);
    errors.forEach(e => console.log(`  [${e.type}] ${e.text}`));
    console.log(`[시나리오A] 페이지 에러: ${pageErrors.length}개`);
    pageErrors.forEach(e => console.log(`  ${e}`));

    // 페이지 에러가 없어야 함
    expect(pageErrors).toHaveLength(0);
  });

  // ==========================================
  // 시나리오 B: 파티 스핀 실행
  // ==========================================
  test('시나리오 B: 파티 스핀 실행 및 결과 표시', async ({ page }) => {
    const { errors, pageErrors } = setupConsoleListener(page);

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await switchToPartyMode(page);

    // 스핀 버튼 클릭
    await spinAndWait(page, 10000);

    // 스핀 완료 후 각 멤버에 결과가 표시되는지 확인
    const partySlots = page.locator('.party-member-slot');
    const slotCount = await partySlots.count();
    console.log(`[시나리오B] 스핀 후 파티 멤버 슬롯 수: ${slotCount}`);

    // 각 멤버 슬롯에 챔피언 이미지가 표시되는지 확인
    for (let i = 0; i < slotCount; i++) {
      const slot = partySlots.nth(i);
      // 챔피언 이미지 또는 텍스트가 존재하는지 확인
      const hasImage = await slot.locator('img').count();
      const hasText = await slot.locator('span').count();
      console.log(`[시나리오B] 멤버 ${i}: 이미지=${hasImage}, 텍스트=${hasText}`);
      expect(hasImage + hasText).toBeGreaterThan(0);
    }

    // 결과 모달이 표시되는지 확인 (showResult)
    // PartyResultDisplay가 나타나는지 체크
    await page.waitForTimeout(1000);
    const resultModal = page.locator('text=파티 결과').or(page.locator('[class*="result"]'));
    const modalVisible = await resultModal.count();
    console.log(`[시나리오B] 결과 모달 표시: ${modalVisible > 0 ? 'YES' : 'NO'}`);

    // 콘솔 에러 보고
    console.log(`[시나리오B] 콘솔 에러: ${errors.length}개`);
    errors.forEach(e => console.log(`  [${e.type}] ${e.text}`));
    console.log(`[시나리오B] 페이지 에러: ${pageErrors.length}개`);
    pageErrors.forEach(e => console.log(`  ${e}`));

    // TypeError: Cannot read properties of undefined 에러가 없어야 함
    const typeErrors = pageErrors.filter(e => e.includes('TypeError') || e.includes('Cannot read properties'));
    expect(typeErrors).toHaveLength(0);
  });

  // ==========================================
  // 시나리오 C: 멤버 수 변경 후 스핀
  // ==========================================
  test('시나리오 C: 멤버 수 변경 후 스핀', async ({ page }) => {
    const { errors, pageErrors } = setupConsoleListener(page);

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await switchToPartyMode(page);

    // 현재 멤버 수 확인
    let slotCount = await page.locator('.party-member-slot').count();
    console.log(`[시나리오C] 초기 멤버 수: ${slotCount}`);

    // 멤버 수 감소 버튼 찾기 (- 버튼)
    const decreaseButton = page.locator('button', { hasText: '-' }).first();
    const increaseButton = page.locator('button', { hasText: '+' }).first();

    // 멤버 수 감소
    if (await decreaseButton.isVisible()) {
      await decreaseButton.click();
      await page.waitForTimeout(500);
      slotCount = await page.locator('.party-member-slot').count();
      console.log(`[시나리오C] 감소 후 멤버 수: ${slotCount}`);
    }

    // 즉시 스핀 실행
    await spinAndWait(page, 10000);
    console.log(`[시나리오C] 감소 후 스핀 완료`);

    // 에러 확인
    const typeErrorsAfterDecrease = pageErrors.filter(e => e.includes('TypeError'));
    console.log(`[시나리오C] 감소 후 TypeError: ${typeErrorsAfterDecrease.length}개`);

    // 멤버 수 증가
    if (await increaseButton.isVisible()) {
      await increaseButton.click();
      await increaseButton.click();
      await page.waitForTimeout(500);
      slotCount = await page.locator('.party-member-slot').count();
      console.log(`[시나리오C] 증가 후 멤버 수: ${slotCount}`);
    }

    // 즉시 스핀 실행
    await spinAndWait(page, 10000);
    console.log(`[시나리오C] 증가 후 스핀 완료`);

    // 콘솔 에러 보고
    console.log(`[시나리오C] 총 콘솔 에러: ${errors.length}개`);
    errors.forEach(e => console.log(`  [${e.type}] ${e.text}`));
    console.log(`[시나리오C] 총 페이지 에러: ${pageErrors.length}개`);
    pageErrors.forEach(e => console.log(`  ${e}`));

    expect(pageErrors).toHaveLength(0);
  });

  // ==========================================
  // 시나리오 D: 파티 ↔ 솔로 모드 전환 후 스핀
  // ==========================================
  test('시나리오 D: 파티 ↔ 솔로 모드 전환 후 스핀', { timeout: 180000 }, async ({ page }) => {
    const { errors, pageErrors } = setupConsoleListener(page);

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Step 1: 파티 모드로 전환 후 스핀
    console.log(`[시나리오D] Step 1: 파티 모드 스핀`);
    await switchToPartyMode(page);
    await spinAndWait(page, 10000);
    const errorsAfterStep1 = [...pageErrors];
    console.log(`[시나리오D] Step 1 후 에러: ${errorsAfterStep1.length}개`);

    // Step 2: 솔로 모드로 전환 (switchToSoloMode 내에서 모달 자동 닫기)
    console.log(`[시나리오D] Step 2: 솔로 모드 전환`);
    await switchToSoloMode(page);
    await page.waitForTimeout(500);

    // Step 3: 솔로 모드에서 스핀
    console.log(`[시나리오D] Step 3: 솔로 모드 스핀`);
    await spinAndWait(page, 6000);
    const errorsAfterStep3 = pageErrors.length - errorsAfterStep1.length;
    console.log(`[시나리오D] Step 3 후 새로운 에러: ${errorsAfterStep3}개`);

    // Step 4: 다시 파티 모드로 전환
    console.log(`[시나리오D] Step 4: 다시 파티 모드 전환`);
    await switchToPartyMode(page);
    await page.waitForTimeout(500);

    // Step 5: 파티 모드에서 스핀
    console.log(`[시나리오D] Step 5: 파티 모드 스핀`);
    await spinAndWait(page, 10000);

    // 전체 콘솔 에러 보고
    console.log(`[시나리오D] 총 콘솔 에러: ${errors.length}개`);
    errors.forEach(e => console.log(`  [${e.type}] ${e.text}`));
    console.log(`[시나리오D] 총 페이지 에러: ${pageErrors.length}개`);
    pageErrors.forEach(e => console.log(`  ${e}`));

    expect(pageErrors).toHaveLength(0);
  });

  // ==========================================
  // 시나리오 E: 빠른 연속 스핀
  // ==========================================
  test('시나리오 E: 빠른 연속 스핀', async ({ page }) => {
    const { errors, pageErrors } = setupConsoleListener(page);

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await switchToPartyMode(page);

    const spinButton = page.locator('.spin-button');
    await spinButton.evaluate(el => el.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(300);

    // 빠르게 3회 클릭
    console.log(`[시나리오E] 빠른 연속 3회 클릭 시작`);
    await spinButton.click({ force: true });
    await page.waitForTimeout(200);
    await spinButton.click({ force: true });
    await page.waitForTimeout(200);
    await spinButton.click({ force: true });

    // 마지막 스핀 완료 대기
    await page.waitForTimeout(12000);

    console.log(`[시나리오E] 연속 스핀 완료`);

    // 페이지가 크래시 없이 살아있는지 확인
    const partySlots = page.locator('.party-member-slot');
    const slotCount = await partySlots.count();
    console.log(`[시나리오E] 스핀 후 멤버 슬롯 수: ${slotCount}`);
    expect(slotCount).toBeGreaterThan(0);

    // 콘솔 에러 보고
    console.log(`[시나리오E] 총 콘솔 에러: ${errors.length}개`);
    errors.forEach(e => console.log(`  [${e.type}] ${e.text}`));
    console.log(`[시나리오E] 총 페이지 에러: ${pageErrors.length}개`);
    pageErrors.forEach(e => console.log(`  ${e}`));

    // TypeError 에러가 없어야 함
    const typeErrors = pageErrors.filter(e => e.includes('TypeError') || e.includes('Cannot read properties'));
    expect(typeErrors).toHaveLength(0);
  });

  // ==========================================
  // 시나리오 F: 최소/최대 멤버 수 엣지 케이스
  // ==========================================
  test('시나리오 F: 최소/최대 멤버 수 엣지 케이스', async ({ page }) => {
    const { errors, pageErrors } = setupConsoleListener(page);

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await switchToPartyMode(page);

    // 최소 멤버 수까지 감소
    const decreaseButton = page.locator('button', { hasText: '-' }).first();
    if (await decreaseButton.isVisible()) {
      for (let i = 0; i < 10; i++) {
        if (await decreaseButton.isEnabled()) {
          await decreaseButton.click();
          await page.waitForTimeout(200);
        } else {
          break;
        }
      }
    }

    let slotCount = await page.locator('.party-member-slot').count();
    console.log(`[시나리오F] 최소 멤버 수: ${slotCount}`);

    // 최소 멤버로 스핀
    await spinAndWait(page, 8000);
    console.log(`[시나리오F] 최소 멤버 스핀 완료`);

    // 최대 멤버 수까지 증가
    const increaseButton = page.locator('button', { hasText: '+' }).first();
    if (await increaseButton.isVisible()) {
      for (let i = 0; i < 10; i++) {
        if (await increaseButton.isEnabled()) {
          await increaseButton.click();
          await page.waitForTimeout(200);
        } else {
          break;
        }
      }
    }

    slotCount = await page.locator('.party-member-slot').count();
    console.log(`[시나리오F] 최대 멤버 수: ${slotCount}`);

    // 최대 멤버로 스핀
    await spinAndWait(page, 12000);
    console.log(`[시나리오F] 최대 멤버 스핀 완료`);

    // 콘솔 에러 보고
    console.log(`[시나리오F] 총 콘솔 에러: ${errors.length}개`);
    errors.forEach(e => console.log(`  [${e.type}] ${e.text}`));
    console.log(`[시나리오F] 총 페이지 에러: ${pageErrors.length}개`);
    pageErrors.forEach(e => console.log(`  ${e}`));

    expect(pageErrors).toHaveLength(0);
  });
});
