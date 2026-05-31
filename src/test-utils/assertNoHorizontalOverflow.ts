/**
 * @file assertNoHorizontalOverflow.ts
 * @description Storybook の play() で使う、ビューポート幅を超えて要素がはみ出して
 * いないことを確認するためのアサーション。
 * theme.ts の MuiCssBaseline で overflowX: hidden を付けてはいるが、
 * それは症状を隠しているだけで、内部に画面幅超過要素があれば
 * document.body.scrollWidth がウィンドウ幅を超える。これを検出する。
 */
import { expect } from 'storybook/test';

/**
 * 現在のビューポートで横スクロールが発生していないことを確認する。
 * 1px の誤差は許容する（ブラウザの丸め差分対策）。
 */
export const assertNoHorizontalOverflow = (): void => {
  const bodyWidth = document.body.scrollWidth;
  const winWidth = window.innerWidth;
  expect(bodyWidth, `body.scrollWidth=${bodyWidth} > window.innerWidth=${winWidth}（横スクロール検出）`).toBeLessThanOrEqual(winWidth + 1);
};
