/**
 * @file TransactionGrid.stories.tsx
 * @description TransactionGridコンポーネントの表示確認用ストーリー。
 */
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { TransactionGrid } from '@/components/organisms/TransactionGrid';
import type { TransactionModel } from '@/models/TransactionModel';
import { TransactionAutoAnalyzeToolbar } from '@/components/molecules/TransactionAutoAnalyzeToolbar';

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
 * WithToolbar: ツールバー付き状態
 * AI解析ボタンなどのツールバーが表示された状態。
 */
export const WithToolbar: Story = {
  args: {
    toolbarNode: (
      <TransactionAutoAnalyzeToolbar
      onAnalyze={() => {}}
      isAnalyzing={false}
      hasData={true}
      />
    ),
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
 * 表示対象のデータが0件の状態。空のDataGridが表示される。
 */
export const Empty: Story = {
  args: {
    rows: [],
  },
};