/**
 * @file AIReportLoadingBody.stories.tsx
 * @description AIReportLoadingBody の表示確認用ストーリー。
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AIReportLoadingBody } from '@/components/molecules/AIReportLoadingBody';

const meta: Meta<typeof AIReportLoadingBody> = {
  title: 'Molecules/AIReportLoadingBody',
  component: AIReportLoadingBody,
  parameters: {
    layout: 'padded',
  },
  args: {
    message: 'AI がデータを分析しています...',
  },
};

export default meta;
type Story = StoryObj<typeof AIReportLoadingBody>;

/**
 * Default: 生成中の案内
 */
export const Default: Story = {};
