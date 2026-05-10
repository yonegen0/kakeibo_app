/**
 * @file TransactionTable.stories.tsx
 * @description TransactionTableコンポーネントの表示確認用ストーリー。
 */
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { TransactionTable } from '@/components/organisms/TransactionTable';
import type { TransactionModel } from '@/models/TransactionModel';

const mockRows: TransactionModel[] = [
  {
    id: 't1',
    date: '2026/03/01',
    content: 'アマゾンジャパン（キンドル）',
    amount: { value: 1500, unit: '円' },
    category: '未分類' as TransactionModel['category'],
    subCategory: '',
    isFixedCost: false,
    memo: '',
    source: 'moneyforward',
  },
  {
    id: 't2',
    date: '2026/03/02',
    content: 'スターバックス コーヒー 名古屋',
    amount: { value: 650, unit: '円' },
    category: '未分類' as TransactionModel['category'],
    subCategory: '',
    isFixedCost: false,
    memo: '',
    source: 'moneyforward',
  },
];

const meta: Meta<typeof TransactionTable> = {
  title: 'Organisms/TransactionTable',
  component: TransactionTable,
  parameters: {
    layout: 'padded',
  },
  args: {
    rows: mockRows,
    height: 500,
  },
};

export default meta;
type Story = StoryObj<typeof TransactionTable>;

/**
 * Default: 読み取り専用（固定費列が disabled）
 * onToggleFixedCost 未指定のため固定費列のスイッチが操作不可。
 */
export const Default: Story = {};

/**
 * WithFixedCostToggle: 固定費トグル有効状態
 * onToggleFixedCost が渡され、各行の固定費スイッチが操作可能。
 */
export const WithFixedCostToggle: Story = {
  args: {
    onToggleFixedCost: fn(),
  },
};

/**
 * WithFixedCostOn: 固定費オン行あり
 * 一部の行が固定費としてマークされた状態。
 */
export const WithFixedCostOn: Story = {
  args: {
    rows: [
      { ...mockRows[0], isFixedCost: true },
      { ...mockRows[1], isFixedCost: false },
    ],
    onToggleFixedCost: fn(),
  },
};

/**
 * WithRowUpdate: インライン編集有効状態
 * onUpdateRow が渡され、大項目・中項目・メモのセルが編集可能。
 */
export const WithRowUpdate: Story = {
  args: {
    onUpdateRow: fn(),
  },
};

/**
 * Empty: データなし状態
 * 表示対象のデータが0件の状態。空のテーブルが表示される。
 */
export const Empty: Story = {
  args: {
    rows: [],
  },
};

