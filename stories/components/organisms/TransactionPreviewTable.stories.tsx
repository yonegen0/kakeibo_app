/**
 * @file TransactionPreviewTable.stories.tsx
 * @description TransactionPreviewTableコンポーネントの表示確認用ストーリー。
 * useTransactionAutoAnalyzer Hooksをモック化し、解析中やエラー時の挙動を網羅。
 */
import type { Meta, StoryObj } from '@storybook/react';
import { mocked, fn } from 'storybook/test';
import { TransactionPreviewTable } from '@/components/organisms/TransactionPreviewTable';
import * as AutoAnalyzerModule from '@/hooks/useTransactionAutoAnalyzer';
import type { TransactionModel } from '@/models/TransactionModel';

/**
 * テスト用のダミーデータ
 * Amount型 ({ value: number, unit: string }) に準拠
 */
const mockRows: TransactionModel[] = [
  {
    id: '1',
    date: '2026-03-01',
    content: 'アマゾンジャパン（キンドル）',
    amount: { value: 1500, unit: '円' },
    category: '未分類',
    subCategory: '',
    memo: '',
    isFixedCost: false,
    source: 'moneyforward'
  },
  {
    id: '2',
    date: '2026-03-02',
    content: 'スターバックス コーヒー 名古屋',
    amount: { value: 650, unit: '円' },
    category: '未分類',
    subCategory: '',
    memo: '',
    isFixedCost: false,
    source: 'moneyforward'
  },
  {
    id: '3',
    date: '2026-03-03',
    content: 'ＡＷＳ（アマゾン　ウェブ　サービス）',
    amount: { value: 12400, unit: '円' },
    category: '未分類',
    subCategory: '',
    memo: '',
    isFixedCost: false,
    source: 'moneyforward'
  }
];

const meta: Meta<typeof TransactionPreviewTable> = {
  title: 'Organisms/TransactionPreviewTable',
  component: TransactionPreviewTable,
  parameters: {
    // データ量が多いコンポーネントのため、余白を広めに確保
    layout: 'padded',
  },
  // 共通のProps定義
  args: {
    rows: mockRows,
    onDataUpdate: fn(),
    height: 500,
  },
};

export default meta;
type Story = StoryObj<typeof TransactionPreviewTable>;

/**
 * Default: 初期表示状態
 * CSVインポート直後、AI解析を実行する前のプレーンなテーブル。
 */
export const Default: Story = {
  beforeEach: () => {
    mocked(AutoAnalyzerModule.useTransactionAutoAnalyzer).mockReturnValue({
      analyzeTransactions: fn(),
      isAnalyzing: false,
      error: null,
    });
  },
};

/**
 * Analyzing: AI解析実行中
 * AI解析ボタンが押下され、Bedrockからの回答を待機している状態。
 * ボタン内のローディングと、DataGrid全体のLoadingオーバレイが表示される。
 */
export const Analyzing: Story = {
  beforeEach: () => {
    mocked(AutoAnalyzerModule.useTransactionAutoAnalyzer).mockReturnValue({
      analyzeTransactions: fn(),
      isAnalyzing: true, // 解析フラグをON
      error: null,
    });
  },
};

/**
 * Analyzed: 解析結果反映済み
 * AIによる推論結果が category / subCategory / memo にマッピングされた状態。
 */
export const Analyzed: Story = {
  args: {
    rows: mockRows.map((row, index) => ({
      ...row,
      category: index === 2 ? 'エンジニアリング' : '食費',
      subCategory: index === 2 ? 'AWS' : 'カフェ',
      memo: '明細内容からAIが自動判別しました',
    })),
  },
  beforeEach: () => {
    mocked(AutoAnalyzerModule.useTransactionAutoAnalyzer).mockReturnValue({
      analyzeTransactions: fn(),
      isAnalyzing: false,
      error: null,
    });
  },
};

/**
 * AnalysisError: APIエラー発生
 * API制限や通信エラーが発生し、ユーザーにエラーが通知されている状態。
 */
export const AnalysisError: Story = {
  beforeEach: () => {
    mocked(AutoAnalyzerModule.useTransactionAutoAnalyzer).mockReturnValue({
      analyzeTransactions: fn(),
      isAnalyzing: false,
      error: 'AWS Bedrockのリクエスト上限に達しました。しばらく待ってから再試行してください。',
    });
  },
};

/**
 * Empty: データなし
 * 表示対象のデータが0件の状態。ボタンが非活性になり、テーブルが空であることを確認。
 */
export const Empty: Story = {
  args: {
    rows: [],
  },
  beforeEach: () => {
    mocked(AutoAnalyzerModule.useTransactionAutoAnalyzer).mockReturnValue({
      analyzeTransactions: fn(),
      isAnalyzing: false,
      error: null,
    });
  },
};