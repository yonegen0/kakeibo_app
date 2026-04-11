/**
 * @file analysisInput.ts
 * @description 分析入力を生成する。
 */
import type { SummaryModel, TransactionModel } from '@/models/TransactionModel';
import { ANALYSIS_REPORT_PROMPT } from '@/constants/prompts';

/* 最大 PSV 行数 */
const MAX_PSV_ROWS = 40;
/* 金額閾値 */
const AMOUNT_THRESHOLD = 10000;

/* テキストをサニタイズする純粋関数 */
const sanitizeText = (value: string) =>
  value
    .replace(/[<>{}`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);

/* 重要な行を選択する純粋関数 */
const pickImportantRows = (transactions: TransactionModel[]) => {
  /* 取引をソート */
  const sorted = [...transactions].sort((a, b) => Math.abs(b.amount.value) - Math.abs(a.amount.value));
  /* 高額取引を選択 */
  const highAmount = sorted.filter((t) => Math.abs(t.amount.value) >= AMOUNT_THRESHOLD);
  /* 固定費を選択 */
  const fixedCosts = sorted.filter((t) => t.isFixedCost);
  /* マージ */
  const merged = [...highAmount, ...fixedCosts, ...sorted];
  /* 一意な取引を選択 */
  const unique = new Map<string, TransactionModel>();
  /* 一意な取引を追加 */
  for (const row of merged) {
    if (!unique.has(row.id)) unique.set(row.id, row);
    if (unique.size >= MAX_PSV_ROWS) break;
  }
  /* 一意な取引を返却 */
  return Array.from(unique.values());
};

/* プロンプト行を生成する純粋関数 */
const toPromptRows = (transactions: TransactionModel[]) =>
  /* 重要な行を選択 */
  pickImportantRows(transactions).map((row) => ({
    id: row.id,
    date: row.date,
    amount: row.amount.value,
    content: sanitizeText(row.content),
    category: sanitizeText(row.category),
    subCategory: sanitizeText(row.subCategory),
    memo: sanitizeText(row.memo),
    isFixedCost: row.isFixedCost,
  }));

/* 分析プロンプトを生成する純粋関数 */
export const buildAnalysisPromptSnapshot = (summary: SummaryModel, transactions: TransactionModel[]) => {
  /* ペイロードを生成 */
  const payload = {
    summary: {
      month: summary.month,
      incomeTotal: summary.incomeTotal,
      expenseTotal: summary.expenseTotal,
      balance: summary.balance,
      topCategories: summary.categories.slice(0, 5),
      topExpenses: summary.topExpenses.slice(0, 5),
    },
    extractedPsvRows: toPromptRows(transactions),
    extractionRule: {
      maxRows: MAX_PSV_ROWS,
      amountThreshold: AMOUNT_THRESHOLD,
      sanitize: 'strip < > { } ` and collapse whitespace',
    },
  };

  return `${ANALYSIS_REPORT_PROMPT}\n\n# 解析入力(JSON)\n${JSON.stringify(payload, null, 2)}`;
};
