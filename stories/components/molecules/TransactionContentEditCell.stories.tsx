/**
 * @file TransactionContentEditCell.stories.tsx
 * @description TransactionContentEditCellコンポーネントの表示確認用ストーリー。
 * useGridApiContext を要求するため TransactionDataGridPanel をラッパーとして使用。
 */
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent } from 'storybook/test';
import { TransactionDataGridPanel } from '@/components/molecules/TransactionDataGridPanel';
import type { TransactionModel } from '@/models/TransactionModel';
import { getTransactionDataGridColumns } from '@/lib/transactionDataGridColumns';

/** 20文字以内（制限内） */
const shortContent = 'スターバックス コーヒー 名古屋';
/** 22文字（制限超過） */
const longContent = 'アマゾンジャパン（キンドル）年間定額サービス';

const mockRows: TransactionModel[] = [
  {
    id: 't1',
    date: '2026/03/01',
    content: shortContent,
    amount: { value: 650, unit: '円' },
    category: '飲食' as TransactionModel['category'],
    subCategory: 'カフェ',
    isCalculated: true,
    isTransfer: false,
    isFixedCost: false,
    memo: '',
    source: 'moneyforward',
  },
  {
    id: 't2',
    date: '2026/03/02',
    content: longContent,
    amount: { value: 1500, unit: '円' },
    category: '未分類' as TransactionModel['category'],
    subCategory: '',
    isCalculated: true,
    isTransfer: false,
    isFixedCost: false,
    memo: '',
    source: 'moneyforward',
  },
];

const columns = getTransactionDataGridColumns();

const meta: Meta<typeof TransactionDataGridPanel> = {
  title: 'Molecules/TransactionContentEditCell',
  component: TransactionDataGridPanel,
  parameters: {
    layout: 'padded',
  },
  args: {
    rows: mockRows,
    columns,
    height: 300,
  },
};

export default meta;
type Story = StoryObj<typeof TransactionDataGridPanel>;

/**
 * Default: 表示状態
 * 制限内・超過の2行を表示。超過行の内容は赤字で表示される。
 */
export const Default: Story = {};

/**
 * EditingNormal: 編集モード（文字数制限内）
 * 制限内セルをダブルクリックして Popper と textarea が表示されることを確認。
 */
export const EditingNormal: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cell = await canvas.findByText(shortContent);
    await userEvent.dblClick(cell);
  },
};

/**
 * EditingOverLimit: 編集モード（文字数超過）
 * 超過セルをダブルクリックして textarea が赤字で表示されることを確認。
 */
export const EditingOverLimit: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cell = await canvas.findByText(longContent);
    await userEvent.dblClick(cell);
  },
};
