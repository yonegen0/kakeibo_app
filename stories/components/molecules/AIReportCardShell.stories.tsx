/**
 * @file AIReportCardShell.stories.tsx
 * @description AIReportCardShell の表示確認用ストーリー。
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Typography } from '@mui/material';
import { AIReportCardShell } from '@/components/molecules/AIReportCardShell';

const meta: Meta<typeof AIReportCardShell> = {
  title: 'Molecules/AIReportCardShell',
  component: AIReportCardShell,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof AIReportCardShell>;

/**
 * Default: 通常のフェードインのみ
 */
export const Default: Story = {
  args: {
    successAccent: false,
    children: (
      <Typography variant="body1">カード内のコンテンツ</Typography>
    ),
  },
};

/**
 * SuccessAccent: 成功時のパルス付き
 */
export const WithSuccessAccent: Story = {
  args: {
    successAccent: true,
    children: (
      <Typography variant="body1">成功状態の装飾アニメーション</Typography>
    ),
  },
};
