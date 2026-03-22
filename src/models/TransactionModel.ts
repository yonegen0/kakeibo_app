/**
 * @file TransactionModel.ts
 * @description アプリケーションの共通データ型定義。
 */

/**
 * 通貨と数値をセットにした金額オブジェクト
 * 将来的なマルチ通貨対応（USD等）を見越した構造です。
 */
export type Amount = {
  value: number;    
  unit: string;     
};

/**
 * 支出・収入の1件分を表す明細モデル
 * 画面表示だけでなく、AWS Glue でのデータ処理時もこの構造を基準とします。
 */
export type TransactionModel = {
  id: string;               // ユニークID
  date: string;             // 計算日
  amount: Amount;           // 金額オブジェクト
  content: string;          // 取引内容
  category: string;         // 大項目（例：食費）
  subCategory: string;      // 中項目（例：ランチ）を追加
  /**
   * CSV由来のフラグ（集計の除外判定に利用）
   * - `isCalculated === false` は除外
   * - `isTransfer === true` は除外
   */
  isCalculated?: boolean;
  isTransfer?: boolean;
  isFixedCost: boolean;     // 固定費フラグ
  memo: string;             // 解析理由や補足メモを追加
  source: 'moneyforward';   // 取り込み元
};

/** 月次集計モデル */
export type MonthlySummaryModel = {
  month: string;            // YYYY-MM
  incomeTotal: number;
  expenseTotal: number;
  balance: number;
  categories: {
    name: string;
    amount: number;        // 正の金額（収入/支出いずれも絶対値）
    percentage: number;
    kind: 'income' | 'expense';
  }[];
};