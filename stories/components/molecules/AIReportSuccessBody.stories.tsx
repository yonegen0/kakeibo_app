/**
 * @file AIReportSuccessBody.stories.tsx
 * @description AIReportSuccessBody の表示確認用ストーリー。
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AIReportSuccessBody } from '@/components/molecules/AIReportSuccessBody';
import type { AIReportModel } from '@/models/AIReportModel';

const mockReport: AIReportModel = {
  reportId: 'rep-mol-1',
  psvId: 'psv-mol-1',
  title: '3月の家計分析レポート',
  summary: '今月の支出は前月比10%増加しました。食費と交通費の見直しをおすすめします。',
  highlights: ['食費が予算を超過', '固定費の見直しが必要', '貯蓄目標達成'],
  promptSnapshot: 'story-prompt',
  reportMarkdown: `# 概要

今月の総支出は **¥150,000** です。

- 食費: ¥45,000
- 交通費: ¥15,000
`,
  createdAt: new Date('2026-03-31T10:00:00Z').toISOString(),
};

const meta: Meta<typeof AIReportSuccessBody> = {
  title: 'Molecules/AIReportSuccessBody',
  component: AIReportSuccessBody,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof AIReportSuccessBody>;

/**
 * Default: ハイライト付きの本文
 */
export const Default: Story = {
  args: {
    report: mockReport,
  },
};

/**
 * NoHighlights: ハイライトなし
 */
export const NoHighlights: Story = {
  args: {
    report: {
      ...mockReport,
      highlights: [],
    },
  },
};
