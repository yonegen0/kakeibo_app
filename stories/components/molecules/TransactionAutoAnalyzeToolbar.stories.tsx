/**
 * @file TransactionAutoAnalyzeToolbar.stories.tsx
 * @description TransactionAutoAnalyzeToolbarコンポーネントの表示確認用ストーリー。
 */
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { TransactionAutoAnalyzeToolbar } from '@/components/molecules/TransactionAutoAnalyzeToolbar';

const meta: Meta<typeof TransactionAutoAnalyzeToolbar> = {
  title: 'Molecules/TransactionAutoAnalyzeToolbar',
  component: TransactionAutoAnalyzeToolbar,
  parameters: {
    layout: 'padded',
  },
  args: {
    onAnalyze: fn(),
    isAnalyzing: false,
    hasData: true,
  },
};

export default meta;
type Story = StoryObj<typeof TransactionAutoAnalyzeToolbar>;

/**
 * Default: 通常状態
 * AI解析ボタンが有効で、クリック可能な状態。データが存在する場合に使用。
 */
export const Default: Story = {};

/**
 * Analyzing: 解析中状態
 * AI解析実行中。ボタンがローディング状態になり、クリック不可。
 */
export const Analyzing: Story = {
  args: {
    isAnalyzing: true,
  },
};

/**
 * Disabled: 無効状態
 * データが存在しない場合。ボタンがグレーアウトされ、クリック不可。
 */
export const Disabled: Story = {
  args: {
    hasData: false,
  },
};

