/**
 * @file TransactionDataGridPanel.stories.tsx
 * @description TransactionDataGridPanelコンポーネントの表示確認用ストーリー。
 */
import type { Meta, StoryObj } from '@storybook/react';
import { TransactionDataGridPanel } from '@/components/molecules/TransactionDataGridPanel';
import { TransactionAutoAnalyzeToolbar } from '@/components/molecules/TransactionAutoAnalyzeToolbar';
import type { TransactionModel } from '@/models/TransactionModel';
import { getTransactionDataGridColumns } from '@/lib/transactionDataGridColumns';

const mockRows: TransactionModel[] = [
  {
    id: 't1',
    date: '2026/03/01',
    content: 'アマゾンジャパン（キンドル）',
    amount: { value: 1500, unit: '円' },
    category: '未分類',
    subCategory: '',
    isCalculated: true,
    isTransfer: false,
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
    isCalculated: true,
    isTransfer: false,
    isFixedCost: false,
    memo: '',
    source: 'moneyforward',
  },
];

const columns = getTransactionDataGridColumns();

const meta: Meta<typeof TransactionDataGridPanel> = {
  title: 'Molecules/TransactionDataGridPanel',
  component: TransactionDataGridPanel,
  parameters: {
    layout: 'padded',
  },
  args: {
    rows: mockRows,
    columns,
    height: 350,
  },
};

export default meta;
type Story = StoryObj<typeof TransactionDataGridPanel>;

/**
 * Default: データ表示状態
 * 取引明細データをDataGridで表示。編集可能な列と固定列が混在。
 */
export const Default: Story = {};

/**
 * WithToolbar: AI解析ツールバー付き状態
 * AI自動仕訳ボタンが付いたツールバーが表示された状態。
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

