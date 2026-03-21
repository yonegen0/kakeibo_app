/**
 * @file TransactionTableSectionHeader.stories.tsx
 * @description TransactionTableSectionHeaderコンポーネントの表示確認用ストーリー。
 */
import type { Meta, StoryObj } from '@storybook/react';
import { TransactionTableSectionHeader } from '@/components/molecules/TransactionTableSectionHeader';

const meta: Meta<typeof TransactionTableSectionHeader> = {
  title: 'Molecules/TransactionTableSectionHeader',
  component: TransactionTableSectionHeader,
  parameters: {
    layout: 'padded',
  },
  args: {
    title: '取引明細',
  },
};

export default meta;
type Story = StoryObj<typeof TransactionTableSectionHeader>;

/**
 * Default: タイトル表示状態
 * セクションのタイトルだけを表示。シンプルなヘッダー。
 */
export const Default: Story = {};

/**
 * WithSubtitle: サブタイトル付き状態
 * タイトルとサブタイトルの両方を表示。説明文を追加可能。
 */
export const WithSubtitle: Story = {
  args: {
    subtitle: '取り込み済みの取引を一覧できます',
  },
};

