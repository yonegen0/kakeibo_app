/**
 * @file useTransactionSummary.ts
 * @description 取引明細から月次の集計（合計収入/支出/残高、カテゴリ別内訳）を算出する。
 * 集計本体は純関数 `calculateTransactionSummary` として実装し、`useTransactionSummary` はそれを useMemo で包む。
 */
import { useMemo } from 'react';
import type { MonthlySummaryModel, TransactionModel } from '@/models/TransactionModel';

export type CategorySummary = MonthlySummaryModel['categories'][number];

/**
 * 日付文字列から `YYYY-MM` を抽出する。
 * - `YYYY/MM/DD`
 * - `YYYY-MM-DD`
 * どちらにも対応する。
 */
const extractMonth = (date: string): string | null => {
  const match = date.match(/^(\d{4})[\/-](\d{2})/);
  if (!match) return null;
  const [, year, month] = match;
  return `${year}-${month}`;
};

/**
 * 集計の純関数本体。
 * @param transactions 取引明細
 * @returns 月次の集計配列（最新月が先頭）
 */
export const calculateTransactionSummary = (
  transactions: TransactionModel[],
): MonthlySummaryModel[] => {
  // 除外ルール適用 + 月でグルーピング
  const monthToTransactions = new Map<string, TransactionModel[]>();

  for (const t of transactions) {
    // 集計対象外の除外
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
    const incomeTotal = txs
      .filter((t) => t.amount.value > 0)
      .reduce((acc, t) => acc + t.amount.value, 0);

    const expenseTotal = txs
      .filter((t) => t.amount.value < 0)
      .reduce((acc, t) => acc + Math.abs(t.amount.value), 0);

    const balance = incomeTotal - expenseTotal;
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

    categories.sort((a, b) => b.amount - a.amount);

    return { month, incomeTotal, expenseTotal, balance, categories };
  });

  summaries.sort((a, b) => b.month.localeCompare(a.month));
  return summaries;
};

/**
 * hooks版：集計本体を useMemo で包んだもの。
 * @param transactions 取引明細
 * @returns 月次集計
 */
export const useTransactionSummary = (transactions: TransactionModel[]): MonthlySummaryModel[] => {
  return useMemo(() => calculateTransactionSummary(transactions), [transactions]);
};

