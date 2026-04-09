/**
 * @file SummaryCard.stories.tsx
 * @description SummaryCardコンポーネントの表示確認用ストーリー。
 */
import type { Meta, StoryObj } from '@storybook/react';
import { SummaryCard } from '@/components/organisms/SummaryCard';
import type { SummaryModel } from '@/models/TransactionModel';

const summaries: SummaryModel[] = [
  {
    month: '2026-03',
    incomeTotal: 2150,
    expenseTotal: 1800,
    balance: 350,
    categories: [
      { name: '食費', amount: 1200, percentage: 60, kind: 'expense' },
      { name: 'エンジニアリング', amount: 950, percentage: 44.2, kind: 'income' },
      { name: '生活用品', amount: 600, percentage: 30, kind: 'expense' },
    ],
    dailyTrend: [{ date: '2026-03-01', income: 2150, expense: 1800, balance: 350 }],
    topExpenses: [{ id: 't-1', content: '食材', amount: 1200, category: '食費', date: '2026/03/01' }],
    fixedCosts: [{ id: 't-2', content: '光熱費', amount: 600, category: '生活用品' }],
  },
  {
    month: '2026-02',
    incomeTotal: 1000,
    expenseTotal: 500,
    balance: 500,
    categories: [{ name: 'その他', amount: 500, percentage: 50, kind: 'expense' }],
    dailyTrend: [{ date: '2026-02-01', income: 1000, expense: 500, balance: 500 }],
    topExpenses: [{ id: 't-3', content: '雑費', amount: 500, category: 'その他', date: '2026/02/01' }],
    fixedCosts: [],
  },
];

const meta: Meta<typeof SummaryCard> = {
  title: 'Organisms/SummaryCard',
  component: SummaryCard,
  parameters: {
    layout: 'padded',
  },
  args: {
    summaries,
  },
};

export default meta;
type Story = StoryObj<typeof SummaryCard>;

/**
 * Default: サマリー表示状態
 * 月次集計データをカード形式で表示。ヘッダー、メトリクス、カテゴリ内訳を含む。
 */
export const Default: Story = {};

/**
 * Empty: データなし状態
 * 集計データがない場合の表示。空の状態を確認。
 */
export const Empty: Story = {
  args: {
    summaries: [],
  },
};

