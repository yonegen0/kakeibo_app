/**
 * @file MoneyText.stories.tsx
 * @description MoneyTextコンポーネントの表示確認用ストーリー。
 */
import type { Meta, StoryObj } from '@storybook/react';
import { MoneyText } from '@/components/atoms/MoneyText';
import type { Amount } from '@/models/TransactionModel';

const meta: Meta<typeof MoneyText> = {
  title: 'Atoms/MoneyText',
  component: MoneyText,
  parameters: {
    layout: 'padded',
  },
  args: {
    amount: { value: 1234, unit: '円' } satisfies Amount,
  },
};

export default meta;
type Story = StoryObj<typeof MoneyText>;

/**
 * Default: 正の金額表示状態
 * 通常の正の金額をフォーマットして表示。千円区切りと通貨単位が付与される。
 */
export const Default: Story = {};

/**
 * Negative: 負の金額表示状態
 * 支出などの負の金額を表示。マイナス記号付きでフォーマットされる。
 */
export const Negative: Story = {
  args: {
    amount: { value: -500, unit: '円' } satisfies Amount,
  },
};

/**
 * Zero: ゼロ金額表示状態
 * 金額が0の場合の表示。特別なフォーマットなしで0が表示される。
 */
export const Zero: Story = {
  args: {
    amount: { value: 0, unit: '円' } satisfies Amount,
  },
};

