import { test, expect } from '@playwright/test';

test.describe('Duck Roulette - Build Randomization (Ultimate Bravery)', () => {
  // Use larger viewport for tests with modals
  test.use({ viewport: { width: 1280, height: 1024 } });

  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Wait for the app to load
    await expect(page.locator('h1')).toContainText('LoL 슬롯 머신');

    // Wait for animations to settle
    await page.waitForTimeout(1000);
  });

  test('TC1: Build toggle switch is visible and OFF by default', async ({ page }) => {
    // Find the build toggle button specifically
    const buildToggle = page.getByRole('button', { name: '🎲 빌드 랜덤화 (Ultimate Bravery)' });
    await expect(buildToggle).toBeVisible();

    // Verify it's OFF (aria-pressed="false")
    await expect(buildToggle).toHaveAttribute('aria-pressed', 'false');

    console.log('✓ TC1 PASS: Build toggle is visible and OFF by default');
  });

  test('TC2: Spin with build OFF shows no build information', async ({ page }) => {
    // Build toggle should be OFF by default
    const buildToggle = page.getByRole('button', { name: '🎲 빌드 랜덤화 (Ultimate Bravery)' });
    await expect(buildToggle).toHaveAttribute('aria-pressed', 'false');

    // Click spin button with force to bypass animation stability check
    const spinButton = page.locator('button.spin-button');
    await spinButton.click({ force: true });

    // Wait for result modal to appear (header is "당신의 운명")
    await page.waitForSelector('text=당신의 운명', { timeout: 10000 });

    // Verify build section does NOT exist
    const buildSection = page.locator('h4:has-text("🎒 빌드")');
    await expect(buildSection).not.toBeVisible();

    console.log('✓ TC2 PASS: No build info shown when toggle is OFF');
  });

  test('TC3: Toggle build ON and spin shows complete build info', async ({ page }) => {
    // Click the toggle to enable build randomization
    const buildToggle = page.getByRole('button', { name: '🎲 빌드 랜덤화 (Ultimate Bravery)' });
    await buildToggle.click();

    // Verify ON (aria-pressed="true")
    await expect(buildToggle).toHaveAttribute('aria-pressed', 'true');

    // Click spin button with force
    const spinButton = page.locator('button.spin-button');
    await spinButton.click({ force: true });

    // Wait for result modal
    await page.waitForSelector('text=당신의 운명', { timeout: 10000 });

    // Verify build section exists
    const buildHeader = page.locator('h4:has-text("🎒 빌드")');
    await expect(buildHeader).toBeVisible();

    // Verify primary rune section exists
    const primaryRuneSection = page.locator('span:has-text("주룬")');
    await expect(primaryRuneSection).toBeVisible();

    // Verify secondary rune section exists
    const secondaryRuneSection = page.locator('span:has-text("보조")');
    await expect(secondaryRuneSection).toBeVisible();

    // Verify summoner spells section exists
    const summonerSection = page.locator('span:has-text("주문")');
    await expect(summonerSection).toBeVisible();

    // Verify skill order section exists
    const skillSection = page.locator('span:has-text("스킬")');
    await expect(skillSection).toBeVisible();

    console.log('✓ TC3 PASS: Complete build info displayed when toggle is ON');
  });

  test('TC4: Multiple spins generate builds', async ({ page }) => {
    // Enable build randomization
    const buildToggle = page.getByRole('button', { name: '🎲 빌드 랜덤화 (Ultimate Bravery)' });
    await buildToggle.click();

    // First spin
    const spinButton = page.locator('button.spin-button');
    await spinButton.click({ force: true });

    // Wait for result
    await page.waitForSelector('text=당신의 운명', { timeout: 10000 });

    // Verify build is shown
    await expect(page.locator('h4:has-text("🎒 빌드")')).toBeVisible();

    // Close modal with ESC key
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Second spin
    await spinButton.click({ force: true });

    // Wait for new result
    await page.waitForSelector('text=당신의 운명', { timeout: 10000 });

    // Verify build is still shown
    await expect(page.locator('h4:has-text("🎒 빌드")')).toBeVisible();

    console.log('✓ TC4 PASS: Multiple spins generate builds');
  });

  test('TC5: Build toggle state persists across spins', async ({ page }) => {
    // Enable build randomization
    const buildToggle = page.getByRole('button', { name: '🎲 빌드 랜덤화 (Ultimate Bravery)' });
    await buildToggle.click();
    await expect(buildToggle).toHaveAttribute('aria-pressed', 'true');

    // First spin
    const spinButton = page.locator('button.spin-button');
    await spinButton.click({ force: true });
    await page.waitForSelector('text=당신의 운명', { timeout: 10000 });

    // Verify build is shown
    await expect(page.locator('h4:has-text("🎒 빌드")')).toBeVisible();

    // Close modal with ESC key
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Second spin
    await spinButton.click({ force: true });
    await page.waitForSelector('text=당신의 운명', { timeout: 10000 });

    // Verify build is still shown (toggle state persisted)
    await expect(page.locator('h4:has-text("🎒 빌드")')).toBeVisible();

    console.log('✓ TC5 PASS: Build toggle state persists across multiple spins');
  });
});
