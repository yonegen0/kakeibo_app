/**
 * @file SummaryCardHeader.stories.tsx
 * @description SummaryCardHeaderコンポーネントの表示確認用ストーリー。
 */
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { SummaryCardHeader } from '@/components/molecules/SummaryCardHeader';

const meta: Meta<typeof SummaryCardHeader> = {
  title: 'Molecules/SummaryCardHeader',
  component: SummaryCardHeader,
  parameters: {
    layout: 'padded',
  },
  args: {
    eyebrowText: 'Insights',
    title: '月次サマリー',
    monthOptions: ['2026-03', '2026-02'],
    selectedMonth: '2026-03',
    onMonthChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof SummaryCardHeader>;

/**
 * Default: デフォルト表示状態
 * 月次サマリーのヘッダー部分を表示。eyebrowText、title、月選択ドロップダウンが配置されている。
 */
export const Default: Story = {};


