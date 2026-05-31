/**
 * @file no-horizontal-overflow.spec.ts
 * @description 主要ページがモバイル/タブレット幅で横スクロールを生まないことを担保する。
 * theme.ts の MuiCssBaseline で overflowX を hidden にして症状を隠しているため、
 * Storybook の play() でも検証しているが、ルーティング込みの実画面で
 * リグレッションを検知する最後の砦としてここでも繰り返す。
 */
import { expect, test } from '@playwright/test';

/** 検証対象の主要ページ */
const PAGES = ['/', '/upload', '/analysis', '/report'] as const;

for (const path of PAGES) {
  test(`${path} は横スクロールを生まない`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle');

    const result = await page.evaluate(() => ({
      bodyScrollWidth: document.body.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      windowInnerWidth: window.innerWidth,
    }));

    // 1px の誤差は許容（ブラウザの丸め差分対策）
    expect(
      result.bodyScrollWidth,
      `body.scrollWidth=${result.bodyScrollWidth} が clientWidth=${result.clientWidth} を超えています（innerWidth=${result.windowInnerWidth}）`,
    ).toBeLessThanOrEqual(result.clientWidth + 1);
  });
}
