/**
 * @file EmptyState.stories.tsx
 * @description EmptyState コンポーネントの表示確認用ストーリー。
 */
import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from '@/components/atoms/EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Atoms/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'padded',
  },
  args: {
    title: 'データがありません',
    description: '条件に合うデータが見つかりませんでした。',
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {};

export const TitleOnly: Story = {
  args: {
    description: undefined,
  },
};

