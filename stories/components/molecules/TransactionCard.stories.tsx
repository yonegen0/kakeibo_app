/**
 * @file TransactionCard.stories.tsx
 * @description TransactionCard コンポーネントの表示確認用ストーリー。
 * カード単体での収入/支出/未選択カテゴリ/固定費スイッチの状態を網羅する。
 */
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { TransactionCard } from '@/components/molecules/TransactionCard';
import type { TransactionModel } from '@/models/TransactionModel';

const baseRow: TransactionModel = {
  id: 't-1',
  date: '2026/03/01',
  content: 'スターバックス渋谷店',
  amount: { value: -650, unit: '円' },
  category: '食費',
  subCategory: 'カフェ',
  isFixedCost: false,
  memo: 'ラテ',
  source: 'moneyforward',
};

const meta: Meta<typeof TransactionCard> = {
  title: 'Molecules/TransactionCard',
  component: TransactionCard,
  parameters: {
    layout: 'padded',
  },
  args: {
    row: baseRow,
    onClick: fn(),
    onToggleFixedCost: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof TransactionCard>;

/**
 * Default: 支出 1 件
 * 食費カテゴリ・固定費オフ・メモあり。左ボーダーが赤系（支出）。
 */
export const Default: Story = {};

/**
 * Income: 収入カード
 * amount が正の値・カテゴリ「収入」。左ボーダーが緑系・金額も緑系。
 */
export const Income: Story = {
  args: {
    row: {
      ...baseRow,
      id: 't-income',
      content: '給与振込',
      amount: { value: 280000, unit: '円' },
      category: '収入',
      subCategory: '給与',
      memo: '',
    },
  },
};

/**
 * WithoutMemo: メモなし
 * memo フィールドが空の場合は中段にメモ行が出ない。
 */
export const WithoutMemo: Story = {
  args: {
    row: { ...baseRow, memo: '' },
  },
};

/**
 * LongContent: 長い内容を 2 行省略
 * content が長いケース。-webkit-line-clamp で 2 行に省略される。
 */
export const LongContent: Story = {
  args: {
    row: {
      ...baseRow,
      content: 'アマゾンジャパン (キンドル) 月額プレミアム自動更新の長文サンプル',
    },
  },
};

/**
 * InvalidCategory: 未選択カテゴリ
 * VALID_CATEGORIES に含まれない値が入っている場合、pill が赤エラー表示。
 */
export const InvalidCategory: Story = {
  args: {
    row: {
      ...baseRow,
      category: '未分類' as TransactionModel['category'],
      subCategory: '',
      memo: '',
    },
  },
};

/**
 * FixedCostOn: 固定費オン
 * isFixedCost: true の状態。Switch がオン位置で表示される。
 */
export const FixedCostOn: Story = {
  args: {
    row: { ...baseRow, isFixedCost: true, content: '家賃', category: '住宅', subCategory: '家賃' },
  },
};

/**
 * FixedCostDisabled: 固定費スイッチ disabled
 * onToggleFixedCost を渡さない場合、固定費 Switch が操作不可。
 */
export const FixedCostDisabled: Story = {
  args: {
    onToggleFixedCost: undefined,
  },
};

/**
 * Mobile: xs viewport で描画確認
 * iPhone SE 幅で 1 カードのレイアウト崩れがないことを確認する。
 */
export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'xs' } },
};
