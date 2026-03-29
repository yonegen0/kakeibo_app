/**
 * @file SummaryMetricTiles.stories.tsx
 * @description SummaryMetricTilesコンポーネントの表示確認用ストーリー。
 */
import type { Meta, StoryObj } from '@storybook/react';
import { SummaryMetricTiles } from '@/components/molecules/SummaryMetricTiles';

const meta: Meta<typeof SummaryMetricTiles> = {
  title: 'Molecules/SummaryMetricTiles',
  component: SummaryMetricTiles,
  parameters: {
    layout: 'padded',
  },
  args: {
    incomeTotal: 2150,
    expenseTotal: 1800,
    balance: 350,
  },
};

export default meta;
type Story = StoryObj<typeof SummaryMetricTiles>;

/**
 * Default: メトリクス表示状態
 * 収入総額、支出総額、残高の3つのタイルを表示。各メトリクスにアイコンと金額が示される。
 */
export const Default: Story = {};

