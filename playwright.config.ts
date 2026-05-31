/**
 * @file playwright.config.ts
 * @description E2E スモークテスト（横スクロール検出）の Playwright 設定。
 * Storybook の Vitest ブラウザ用に同梱されている `playwright` パッケージとは
 * 別に `@playwright/test` を入れて、`npm run test:e2e` で実行する。
 *
 * ブラウザは Chromium のみを使用する（WebKit/Firefox は別途インストールが
 * 必要なため）。モバイル相当の確認は Chromium 上で viewport を直接指定し、
 * `isMobile`/`hasTouch` を有効にして DevTools のデバイスツールバーと同じ
 * 挙動でレンダリングする。
 */
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  // CI ではリトライ 1 回・ローカルは即失敗
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      // iPhone SE 相当（375 x 667）。Chromium モバイルエミュレーション。
      name: 'mobile-375',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      // Pixel 7 相当（412 x 915）。
      name: 'mobile-412',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 412, height: 915 },
        deviceScaleFactor: 2.625,
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      // iPad mini 相当（768 x 1024）。タブレット境界での DataGrid 表示を確認。
      name: 'tablet-768',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 768, height: 1024 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
