/**
 * @file AIReport.stories.tsx
 * @description AIReportコンポーネントの表示確認用ストーリー。
 */
import type { Meta, StoryObj } from '@storybook/react';
import { AIReport } from '@/components/organisms/AIReport';
import type { AIReportModel } from '@/models/AIReportModel';

const mockReport: AIReportModel = {
  title: '3月の家計分析レポート',
  summary: '今月の支出は前月比10%増加しました。食費と交通費の見直しをおすすめします。',
  highlights: ['食費が予算を超過', '固定費の見直しが必要', '貯蓄目標達成'],
  rawMarkdown: `# 3月の家計分析レポート

## 概要
今月の総支出は¥150,000で、前月比10%の増加となりました。

## 主なポイント
- **食費**: ¥45,000 (予算: ¥40,000)
- **交通費**: ¥15,000 (前月比 +20%)
- **固定費**: ¥60,000 (安定)

## 改善提案
1. 外食を減らして自炊を増やす
2. 定期券の見直しを検討
3. 光熱費の節約


>総支出: ¥150,000
>予算: ¥140,000
>差額: ¥10,000 (超過)

`,
};

const meta: Meta<typeof AIReport> = {
  title: 'Organisms/AIReport',
  component: AIReport,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof AIReport>;

/**
 * Loading: レポート生成中
 */
export const Loading: Story = {
  args: {
    report: null,
    isLoading: true,
    error: null,
  },
};

/**
 * Error: エラー発生
 */
export const Error: Story = {
  args: {
    report: null,
    isLoading: false,
    error: 'レポート生成中にエラーが発生しました。',
  },
};

/**
 * Empty: 未生成状態
 */
export const Empty: Story = {
  args: {
    report: null,
    isLoading: false,
    error: null,
  },
};

/**
 * Success: レポート表示
 */
export const WithData: Story = {
  args: {
    report: mockReport,
    isLoading: false,
    error: null,
  },
};
