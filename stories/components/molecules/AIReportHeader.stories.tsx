/**
 * @file AIReportHeader.stories.tsx
 * @description AIReportHeader の表示確認用ストーリー。
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AIReportHeader } from '@/components/molecules/AIReportHeader';

const meta: Meta<typeof AIReportHeader> = {
  title: 'Molecules/AIReportHeader',
  component: AIReportHeader,
  parameters: {
    layout: 'padded',
  },
  args: {
    eyebrowText: 'AI Insights',
    headingText: '家計レポート',
    sideCaption: '集計結果をもとにした分析レポート',
  },
};

export default meta;
type Story = StoryObj<typeof AIReportHeader>;

/**
 * Default: 家計レポート共通ヘッダー
 */
export const Default: Story = {};

/**
 * CustomCopy: 文言差し替えの例
 */
export const CustomCopy: Story = {
  args: {
    eyebrowText: 'REPORT',
    headingText: '月次レビュー',
    sideCaption: '直近の取引データに基づくサマリーです。',
  },
};
