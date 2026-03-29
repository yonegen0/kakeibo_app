/**
 * @file SummaryCard.stories.tsx
 * @description SummaryCardコンポーネントの表示確認用ストーリー。
 */
import type { Meta, StoryObj } from '@storybook/react';
import { SummaryCard } from '@/components/organisms/SummaryCard';
import type { MonthlySummaryModel } from '@/models/TransactionModel';

const summaries: MonthlySummaryModel[] = [
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
  },
  {
    month: '2026-02',
    incomeTotal: 1000,
    expenseTotal: 500,
    balance: 500,
    categories: [{ name: 'その他', amount: 500, percentage: 50, kind: 'expense' }],
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

