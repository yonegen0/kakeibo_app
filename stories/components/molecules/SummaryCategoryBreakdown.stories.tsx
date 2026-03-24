/**
 * @file SummaryCategoryBreakdown.stories.tsx
 * @description SummaryCategoryBreakdownコンポーネントの表示確認用ストーリー。
 */
import type { Meta, StoryObj } from '@storybook/react';
import { SummaryCategoryBreakdown } from '@/components/molecules/SummaryCategoryBreakdown';
import type { MonthlySummaryModel } from '@/models/TransactionModel';

const categories: MonthlySummaryModel['categories'] = [
  { name: '食費', amount: 1200, percentage: 60, kind: 'expense' },
  { name: 'エンジニアリング', amount: 950, percentage: 44.2, kind: 'income' },
  { name: '生活用品', amount: 600, percentage: 30, kind: 'expense' },
  { name: 'その他', amount: 100, percentage: 5, kind: 'expense' },
];

const meta: Meta<typeof SummaryCategoryBreakdown> = {
  title: 'Molecules/SummaryCategoryBreakdown',
  component: SummaryCategoryBreakdown,
  parameters: {
    layout: 'padded',
  },
  args: {
    categories,
  },
};

export default meta;
type Story = StoryObj<typeof SummaryCategoryBreakdown>;

/**
 * Default: カテゴリ内訳表示状態
 * 収入と支出のカテゴリ別内訳をバーグラフで表示。パーセンテージと金額が示される。
 */
export const Default: Story = {};

/**
 * Empty: データなし状態
 * カテゴリデータがない場合の表示。空の状態を確認。
 */
export const Empty: Story = {
  args: {
    categories: [],
  },
};

