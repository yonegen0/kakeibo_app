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
  id: string;               // データの重複登録を防ぐためのユニークID
  date: string;             // 時系列分析に使用
  amount: Amount;           // 金額
  content: string;          // 内容・店名
  category: string;         // 分析の主軸となるカテゴリ（大項目）
  isFixedCost: boolean;     // 節約の余地があるかを判定するためのフラグ
  source: 'moneyforward';   // 取り込み元を識別（今後、手動入力等を追加予定）
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