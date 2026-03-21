/**
 * @file TransactionGrid.stories.tsx
 * @description TransactionGridコンポーネントの表示確認用ストーリー。
 */
import type { Meta, StoryObj } from '@storybook/react';
import { TransactionGrid } from '@/components/organisms/TransactionGrid';
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

const meta: Meta<typeof TransactionGrid> = {
  title: 'Organisms/TransactionGrid',
  component: TransactionGrid,
  parameters: {
    layout: 'padded',
  },
  args: {
    rows: mockRows,
    height: 500,
    title: '取引明細',
    subtitle: '取り込み済みの取引を一覧できます',
  },
};

export default meta;
type Story = StoryObj<typeof TransactionGrid>;

/**
 * Default: データ表示状態
 * 取引明細データをDataGridで表示。タイトルとサブタイトル付き。
 */
export const Default: Story = {};

/**
 * WithToolbar: ツールバー付き状態
 * AI解析ボタンなどのツールバーが表示された状態。
 */
export const WithToolbar: Story = {
  args: {
    toolbarNode: <div>AI解析ボタン</div>,
  },
};

/**
 * Loading: 読み込み中状態
 * データ読み込み中のローディングオーバーレイが表示される。
 */
export const Loading: Story = {
  args: {
    loading: true,
  },
};

/**
 * Empty: データなし状態
 * 表示対象のデータが0件の状態。空のDataGridが表示される。
 */
export const Empty: Story = {
  args: {
    rows: [],
  },
};