/**
 * @file TransactionPreviewTable.stories.tsx
 */
import type { Meta, StoryObj } from '@storybook/react';
import { TransactionPreviewTable } from '@/components/organisms/TransactionPreviewTable';
import type { Transaction } from '@/hooks/useMFUploader';

const meta: Meta<typeof TransactionPreviewTable> = {
  title: 'Organisms/TransactionPreviewTable',
  component: TransactionPreviewTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof TransactionPreviewTable>;

/**
 * モックデータ
 * Zodのtransform適用後（英語プロパティ）の構造に準拠
 */
const mockRows: Transaction[] = [
  {
    id: 'file-1',
    date: '2026/03/01',
    content: 'アマゾンジャパン',
    amount: 15400,
    source: '楽天カード',
    category: '日用品',
    subCategory: '消耗品',
    memo: 'オフィスチェア購入',
    isCalculated: true,
    isTransfer: false,
    mfId: '12345',
  },
  {
    id: 'file-2',
    date: '2026/03/02',
    content: 'スターバックスコーヒー',
    amount: 680,
    source: 'モバイルSuica',
    category: '食費',
    subCategory: 'カフェ',
    memo: '',
    isCalculated: true,
    isTransfer: false,
    mfId: undefined,
  },
  {
    id: 'file-3',
    date: '2026/03/05',
    content: 'カード振替受取',
    amount: 50000,
    source: '三菱UFJ銀行',
    category: '振替',
    subCategory: 'カード引き落とし',
    memo: '',
    isCalculated: false,
    isTransfer: true,
    mfId: undefined,
  },
  // 大量データ・多様な状態のシミュレーション
  ...Array.from({ length: 20 }).map((_, i) => ({
    id: `extra-${i}`,
    date: `2026/03/${String(i + 10).padStart(2, '0')}`,
    content: `テスト取引項目 ${i + 1}`,
    amount: Math.floor(Math.random() * 10000),
    source: i % 2 === 0 ? '三菱UFJ銀行' : '楽天カード',
    category: '未分類',
    subCategory: '未分類',
    memo: i % 5 === 0 ? '自動生成されたメモ' : '',
    isCalculated: i % 10 !== 0, // 10件に1件は計算対象外
    isTransfer: false,
    mfId: `mf-raw-${i}`,
  })),
];

/** 💡 Default: 標準的な表示状態 */
export const Default: Story = {
  args: {
    rows: mockRows,
    height: 500,
  },
};

/** 💡 Empty: データがない状態 */
export const Empty: Story = {
  args: {
    rows: [],
    height: 300,
  },
};

/** 💡 LargeHeight: 高さを広げた状態 */
export const LargeHeight: Story = {
  args: {
    rows: mockRows,
    height: 800,
  },
};

/** 💡 MobileView: モバイル画面幅での表示確認 */
export const MobileView: Story = {
  args: {
    rows: mockRows.slice(0, 5),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};