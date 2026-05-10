/**
 * @file TransactionCategoryEditCell.stories.tsx
 * @description TransactionCategoryEditCellコンポーネントの表示確認用ストーリー。
 * useGridApiContext を要求するため TransactionDataGridPanel をラッパーとして使用。
 */
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent } from 'storybook/test';
import { TransactionDataGridPanel } from '@/components/molecules/TransactionDataGridPanel';
import type { TransactionModel } from '@/models/TransactionModel';
import { getTransactionDataGridColumns } from '@/lib/transactionDataGridColumns';

/** 有効な大項目を持つ支出行 */
const validCategory = '食費';
/** Category 型外の大項目を持つ行（MF CSV からの取り込み直後を想定） */
const invalidCategory = '未分類';
/** 収入行の大項目 */
const incomeCategory = '収入';

const mockRows: TransactionModel[] = [
  {
    id: 't1',
    date: '2026/03/01',
    content: 'スターバックス コーヒー',
    amount: { value: -650, unit: '円' },
    category: validCategory,
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
    content: 'アマゾンジャパン（キンドル）',
    amount: { value: -1500, unit: '円' },
    category: invalidCategory as TransactionModel['category'],
    subCategory: '',
    isCalculated: true,
    isTransfer: false,
    isFixedCost: false,
    memo: '',
    source: 'moneyforward',
  },
  {
    id: 't3',
    date: '2026/03/25',
    content: '給与',
    amount: { value: 200000, unit: '円' },
    category: incomeCategory,
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
  title: 'Molecules/TransactionCategoryEditCell',
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
 * 有効カテゴリと選択肢外カテゴリの2行を表示。
 * 選択肢外の行の大項目は赤字で表示される。
 */
export const Default: Story = {};

/**
 * EditingValid: 編集モード（有効カテゴリ）
 * 有効カテゴリのセルをダブルクリックして Select が表示されることを確認。
 */
export const EditingValid: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cell = await canvas.findByText(validCategory);
    await userEvent.dblClick(cell);
  },
};

/**
 * EditingInvalid: 編集モード（選択肢外カテゴリ）
 * 選択肢外カテゴリのセルをダブルクリックして Select が空表示で開くことを確認。
 */
export const EditingInvalid: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cell = await canvas.findByText(invalidCategory);
    await userEvent.dblClick(cell);
  },
};

/**
 * EditingIncome: 編集モード（収入行）
 * 正値 amount の収入行をダブルクリックして、ドロップダウンに「収入」のみ表示されることを確認。
 */
export const EditingIncome: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cell = await canvas.findByText(incomeCategory);
    await userEvent.dblClick(cell);
  },
};
