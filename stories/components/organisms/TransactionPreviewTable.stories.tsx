/**
 * @file TransactionPreviewTable.stories.tsx
 * @description [DEPRECATED] TransactionPreviewTable の互換確認ストーリー。
 */
import type { Meta, StoryObj } from '@storybook/react';
import { TransactionPreviewTable } from '@/components/organisms/TransactionPreviewTable';
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
  title: 'Legacy/TransactionPreviewTable',
  component: TransactionPreviewTable,
  parameters: {
    // データ量が多いコンポーネントのため、余白を広めに確保
    layout: 'padded',
  },
  // 共通のProps定義
  args: {
    rows: mockRows,
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
};

/**
 * Analyzed: 解析結果反映済み
 * 旧フローで整形済みデータを表示する状態。
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
};

/**
 * Empty: データなし
 * 表示対象のデータが0件の状態。
 */
export const Empty: Story = {
  args: {
    rows: [],
  },
};