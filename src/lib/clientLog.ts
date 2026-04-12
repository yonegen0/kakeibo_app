/**
 * @file clientLog.ts
 * @description ブラウザ上のクライアント処理向けログ。hooks や fetch 失敗時の出力形式を揃える。
 */

/**
 * クライアント側の想定外・失敗をコンソールに出す（スコープ付きで検索しやすくする）。
 * @param scope 呼び出し元の識別子（例: useAIAnalyzer）
 * @param message 人が読む短文
 * @param details 追加コンテキスト（Error・API 生データなど。任意個）
 */
export const logClientError = (scope: string, message: string, ...details: readonly unknown[]): void => {
  if (details.length > 0) {
    console.error(`[${scope}]`, message, ...details);
  } else {
    console.error(`[${scope}]`, message);
  }
};
