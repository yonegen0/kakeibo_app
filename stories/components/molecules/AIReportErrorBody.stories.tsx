/**
 * @file AIReportErrorBody.stories.tsx
 * @description AIReportErrorBody の表示確認用ストーリー。
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AIReportErrorBody } from '@/components/molecules/AIReportErrorBody';

const meta: Meta<typeof AIReportErrorBody> = {
  title: 'Molecules/AIReportErrorBody',
  component: AIReportErrorBody,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof AIReportErrorBody>;

/**
 * Default: エラー詳細付き
 */
export const Default: Story = {
  args: {
    errorDetail: 'サーバーとの通信に失敗しました。',
  },
};
