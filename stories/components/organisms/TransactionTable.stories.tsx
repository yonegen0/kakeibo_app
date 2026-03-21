/**
 * @file TransactionTable.stories.tsx
 * @description TransactionTableコンポーネントの表示確認用ストーリー。
 */
import type { Meta, StoryObj } from '@storybook/react';
import { TransactionTable } from '@/components/organisms/TransactionTable';
import type { TransactionModel } from '@/models/TransactionModel';

const mockRows: TransactionModel[] = [
  {
    id: 't1',
    date: '2026/03/01',
    content: 'アマゾンジャパン（キンドル）',
    amount: { value: 1500, unit: '円' },
    category: '未分類',
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
    category: '未分類',
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
 * Default: データ表示状態
 * 取引明細データをテーブル形式で表示。読み取り専用のシンプルなテーブル。
 */
export const Default: Story = {};

/**
 * Empty: データなし状態
 * 表示対象のデータが0件の状態。空のテーブルが表示される。
 */
export const Empty: Story = {
  args: {
    rows: [],
  },
};

