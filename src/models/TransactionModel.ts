/**
 * @file TransactionModel.ts
 * @description アプリケーションの共通データ型定義。
 */

/**
 * 通貨と数値をセットにした金額オブジェクト
 * 将来的なマルチ通貨対応（USD等）を見越した構造です。
 */
export type Amount = {
  value: number;         // 金額
  unit: string;          // 単位
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
  isCalculated?: boolean;   // 計算対象フラグ（CSVに存在しない場合は true とみなす）
  isTransfer?: boolean;     // 振替フラグ（CSVに存在しない場合は false とみなす）
  isFixedCost: boolean;     // 固定費フラグ
  memo: string;             // 解析理由や補足メモを追加
  source: 'moneyforward';   // 取り込み元
};

/** 月次集計モデル */
export type MonthlySummaryModel = {
  month: string;                  // 月（YYYY-MM）
  incomeTotal: number;            // 収入合計
  expenseTotal: number;           // 支出合計
  balance: number;                // 収支
  categories: SummaryCategory[];  // カテゴリ内訳
};

/** カテゴリ内訳の1行（名前・金額・割合・収入か支出か） */
export type SummaryCategory = {
  name: string;               // カテゴリ名
  amount: number;             // 金額
  percentage: number;         // 割合
  kind: 'income' | 'expense'; // 収入か支出か
};

/** 日次トレンドの1行（日付・収入・支出・収支） */
export type DailyTrend = {
  date: string;           // 日付
  income: number;         // 収入
  expense: number;        // 支出
  balance: number;        // 収支
};

/** 上位支出の1行（ID・内容・金類・カテゴリ・日付） */
export type TopExpense = {
  id: string;             // ユニークID
  content: string;        // 内容
  amount: number;         // 金額
  category: string;       // カテゴリ
  date: string;           // 日付
};

/** 固定費の1行（ID・内容・金額・カテゴリ） */
export type FixedCostItem = {
  id: string;             // ユニークID
  content: string;        // 内容
  amount: number;         // 金額
  category: string;       // カテゴリ
};

/** サマリーの1行（月・収入・支出・収支・カテゴリ・日次トレンド・上位支出・固定費） */
export type SummaryModel = {
  month: string;                  // 月（YYYY-MM）
  incomeTotal: number;            // 収入合計
  expenseTotal: number;           // 支出合計
  balance: number;                // 収支
  categories: SummaryCategory[];  // カテゴリ内訳
  dailyTrend: DailyTrend[];       // 日次トレンド
  topExpenses: TopExpense[];      // 上位支出
  fixedCosts: FixedCostItem[];    // 固定費
};

/** PSVメタデータの1行（PSV ID・ユーザーID・ファイル名・行数・月範囲・作成日時・更新日時・最新フラグ） */
export type PsvMetaModel = {
  psvId: string;            // PSV ID
  userId: string;           // ユーザーID
  fileName: string;         // ファイル名
  rowCount: number;         // 行数
  monthRange: {             // 月範囲
    from: string;           // 開始月（YYYY-MM）
    to: string;             // 終了月（YYYY-MM）
  };
  createdAt: string;        // 作成日時（ISO 8601）
  updatedAt: string;        // 更新日時（ISO 8601）
  isLatest: boolean;        // 最新フラグ
};