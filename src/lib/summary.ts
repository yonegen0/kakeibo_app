/**
 * @file summary.ts
 * @description 取引一覧から月次サマリーを計算する。
 */
import type {
  DailyTrend,
  FixedCostItem,
  SummaryCategory,
  SummaryModel,
  TopExpense,
  TransactionModel,
} from '@/models/TransactionModel';

/* 月範囲を抽出する関数 */
const extractMonth = (date: string): string | null => {
  // 日付をパース
  const match = date.match(/^(\d{4})[/-](\d{2})/);
  // 月がない場合
  if (!match) return null;
  // 月を返却
  return `${match[1]}-${match[2]}`;
};

/* 日付キーを抽出する関数 */
const extractDateKey = (date: string): string | null => {
  // 日付をパース
  const match = date.match(/^(\d{4})[/-](\d{2})[/-](\d{2})/);
  // 日付がない場合
  if (!match) return null;
  // 日付キーを返却
  return `${match[1]}-${match[2]}-${match[3]}`;
};

/* サマリーを作成する関数 */
export const buildSummary = (transactions: TransactionModel[]): SummaryModel | null => {
  // 取引がない場合
  if (transactions.length === 0) return null;

  // 取引をフィルタリング
  const scoped = transactions.filter((t) => t.isCalculated !== false && t.isTransfer !== true);
  if (scoped.length === 0) return null;

  // 月範囲を抽出
  const months = scoped.map((t) => extractMonth(t.date)).filter((m): m is string => Boolean(m));
  // 最新月を取得
  const month = months.sort().slice(-1)[0] ?? '';

  // 収入合計を計算
  const incomeTotal = scoped.filter((t) => t.amount.value > 0).reduce((acc, t) => acc + t.amount.value, 0);
  // 支出合計を計算
  const expenseTotal = scoped
    .filter((t) => t.amount.value < 0)
    .reduce((acc, t) => acc + Math.abs(t.amount.value), 0);
  // 収支を計算
  const balance = incomeTotal - expenseTotal;
  // 収入と支出の合計を計算
  const totalAbs = incomeTotal + expenseTotal;

  // カテゴリごとの収入と支出を計算
  const categoryIncome = new Map<string, number>();
  // カテゴリごとの支出を計算
  const categoryExpense = new Map<string, number>();
  // カテゴリごとの収入と支出を計算
  for (const t of scoped) {
    if (t.amount.value > 0) {
      categoryIncome.set(t.category, (categoryIncome.get(t.category) ?? 0) + t.amount.value);
    } else if (t.amount.value < 0) {
      categoryExpense.set(t.category, (categoryExpense.get(t.category) ?? 0) + Math.abs(t.amount.value));
    }
  }

  // カテゴリ名を取得
  const categoryNames = new Set([...categoryIncome.keys(), ...categoryExpense.keys()]);
  // カテゴリごとの収入と支出を計算
  const categories: SummaryCategory[] = Array.from(categoryNames)
    .map((name) => {
      const incomeAmount = categoryIncome.get(name) ?? 0;
      const expenseAmount = categoryExpense.get(name) ?? 0;
      const kind: SummaryCategory['kind'] = incomeAmount >= expenseAmount ? 'income' : 'expense';
      const amount = kind === 'income' ? incomeAmount : expenseAmount;
      return {
        name,
        amount,
        kind,
        percentage: totalAbs === 0 ? 0 : (amount / totalAbs) * 100,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  // 日付ごとの収入と支出を計算
  const byDate = new Map<string, { income: number; expense: number }>();
  // 日付ごとの収入と支出を計算
  for (const t of scoped) {
    // 日付キーを抽出
    const dateKey = extractDateKey(t.date);
    // 日付キーがない場合
    if (!dateKey) continue;
    const current = byDate.get(dateKey) ?? { income: 0, expense: 0 };
    if (t.amount.value > 0) {
      current.income += t.amount.value;
    } else if (t.amount.value < 0) {
      current.expense += Math.abs(t.amount.value);
    }
    byDate.set(dateKey, current);
  }

  // 日付ごとの収入と支出を計算
  const dailyTrend: DailyTrend[] = Array.from(byDate.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, point]) => ({
      date,
      income: point.income,
      expense: point.expense,
      balance: point.income - point.expense,
    }));

  // 上位支出を取得
  const topExpenses: TopExpense[] = scoped
    .filter((t) => t.amount.value < 0)
    .sort((a, b) => Math.abs(b.amount.value) - Math.abs(a.amount.value))
    .slice(0, 5)
    .map((t) => ({
      id: t.id,
      content: t.content,
      amount: Math.abs(t.amount.value),
      category: t.category,
      date: t.date,
    }));

  // 固定費を取得
  const fixedCosts: FixedCostItem[] = scoped
    .filter((t) => t.isFixedCost)
    .map((t) => ({
      id: t.id,
      content: t.content,
      amount: Math.abs(t.amount.value),
      category: t.category,
    }))
    .sort((a, b) => b.amount - a.amount);

  return {
    month,
    incomeTotal,
    expenseTotal,
    balance,
    categories,
    dailyTrend,
    topExpenses,
    fixedCosts,
  };
};
