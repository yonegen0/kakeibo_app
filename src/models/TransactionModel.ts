/**
 * @file TransactionModel.ts
 * @description アプリケーションの基盤となる取引明細および集計データの型定義。
 * データベース、APIレスポンス、およびフロントエンドの各コンポーネント間で共有される
 * 信頼できる唯一の情報源（Single Source of Truth）として機能します。
 */

/** 金額オブジェクト */
export type Amount = {
  value: number;    // 数値
  unit: string;     // 'JPY' 等
};

/** 取引明細モデル */
export type TransactionModel = {
  id: string;               // 一意識別子 (S3キー+行番号等)
  date: string;             // ISO 8601形式 (YYYY-MM-DD)
  amount: Amount;           // 金額
  content: string;          // 内容・店名
  category: string;         // 大項目カテゴリ
  subCategory?: string;     // 中項目カテゴリ (任意)
  isFixedCost: boolean;     // 固定費判定フラグ
  source: 'moneyforward';   // データソース識別用
};

/** 月次集計モデル */
export type MonthlySummaryModel = {
  month: string;            // YYYY-MM
  totalAmount: number;
  categories: {
    name: string;
    amount: number;
    percentage: number;
  }[];
};