/**
 * @file useTransactionSummary.ts
 * @description 取引一覧から月ごとの収支サマリー（合計とカテゴリ内訳）を求める。入力が変わるまで結果を使い回す。
 */
import { useMemo } from 'react';
import type { MonthlySummaryModel, TransactionModel } from '@/models/TransactionModel';

/** カテゴリ内訳の 1 行（名前・金額・割合・収入か支出か） */
export type CategorySummary = MonthlySummaryModel['categories'][number];

/**
 * 日付文字列から年月（YYYY-MM）を取り出す。スラッシュ区切り・ハイフン区切りの両方に対応。
 */
const extractMonth = (date: string): string | null => {
  const match = date.match(/^(\d{4})[\/-](\d{2})/);
  if (!match) return null;
  const [, year, month] = match;
  return `${year}-${month}`;
};

/**
 * 取引一覧から月次サマリーを計算する（副作用なし）。
 * @param transactions 集計対象の取引
 * @returns 月ごとのサマリー（新しい月が先頭）
 */
export const calculateTransactionSummary = (
  transactions: TransactionModel[],
): MonthlySummaryModel[] => {
  // 月ごとに分ける（キーは YYYY-MM）
  const monthToTransactions = new Map<string, TransactionModel[]>();

  for (const t of transactions) {
    // 計算対象外・振替は集計に含めない
    if (t.isCalculated === false) continue;
    if (t.isTransfer === true) continue;

    const month = extractMonth(t.date);
    if (!month) continue;

    const existing = monthToTransactions.get(month);
    if (existing) {
      existing.push(t);
    } else {
      monthToTransactions.set(month, [t]);
    }
  }

  const summaries: MonthlySummaryModel[] = Array.from(monthToTransactions.entries()).map(([month, txs]) => {
    // 金額の符号で収入（プラス）と支出（マイナス）を分ける
    const incomeTotal = txs
      .filter((t) => t.amount.value > 0)
      .reduce((acc, t) => acc + t.amount.value, 0);

    const expenseTotal = txs
      .filter((t) => t.amount.value < 0)
      .reduce((acc, t) => acc + Math.abs(t.amount.value), 0);

    const balance = incomeTotal - expenseTotal;
    // 内訳の割合用に、収入・支出の絶対値の合計を使う
    const totalAbs = incomeTotal + expenseTotal;

    // カテゴリ別：収入側/支出側それぞれの絶対値を保持
    const categoryIncomeAbs = new Map<string, number>();
    const categoryExpenseAbs = new Map<string, number>();

    for (const t of txs) {
      if (t.amount.value > 0) {
        categoryIncomeAbs.set(t.category, (categoryIncomeAbs.get(t.category) ?? 0) + t.amount.value);
      } else if (t.amount.value < 0) {
        categoryExpenseAbs.set(t.category, (categoryExpenseAbs.get(t.category) ?? 0) + Math.abs(t.amount.value));
      }
    }

    const categoryNames = new Set<string>([
      ...Array.from(categoryIncomeAbs.keys()),
      ...Array.from(categoryExpenseAbs.keys()),
    ]);

    const categories: CategorySummary[] = Array.from(categoryNames).map((name) => {
      const incomeAbs = categoryIncomeAbs.get(name) ?? 0;
      const expenseAbs = categoryExpenseAbs.get(name) ?? 0;

      const kind: CategorySummary['kind'] = incomeAbs >= expenseAbs ? 'income' : 'expense';
      const amount = kind === 'income' ? incomeAbs : expenseAbs;
      const percentage = totalAbs === 0 ? 0 : (amount / totalAbs) * 100;

      return { name, amount, percentage, kind };
    });

    // 金額の大きい順
    categories.sort((a, b) => b.amount - a.amount);

    return { month, incomeTotal, expenseTotal, balance, categories };
  });

  // 新しい月が先（年月文字列の降順）
  summaries.sort((a, b) => b.month.localeCompare(a.month));
  return summaries;
};

/**
 * 取引一覧が変わったときだけ再計算するラッパー。
 * @param transactions 集計対象の取引
 * @returns 月次サマリーの配列（新しい月が先頭）
 */
export const useTransactionSummary = (transactions: TransactionModel[]): MonthlySummaryModel[] => {
  return useMemo(() => calculateTransactionSummary(transactions), [transactions]);
};

