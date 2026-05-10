/**
 * @file TransactionImportTemplate.stories.tsx
 * @description TransactionImportTemplateコンポーネントの表示確認用ストーリー。
 */
import type { Meta, StoryObj } from '@storybook/react';
import { mocked, fn } from 'storybook/test';
import * as TransactionImportTemplateHookModule from '@/hooks/useTransactionImportTemplate';
import type { Transaction as MFUploadedTransaction } from '@/hooks/useMFUploader';
import { TransactionImportTemplate } from '@/components/templates/TransactionImportTemplate';
import type { SummaryModel, TransactionModel } from '@/models/TransactionModel';
import { CONTENT_MAX_LENGTH } from '@/lib/contentValidation';

const mockMfTransactions: MFUploadedTransaction[] = [
  {
    id: 'mf-1',
    isCalculated: true,
    date: '2026/03/01',
    content: 'アマゾンジャパン（キンドル）',
    amount: 1500,
    source: 'dummy',
    category: '未分類',
    subCategory: '',
    memo: '',
    isTransfer: false,
    mfId: 'mf-1',
  },
  {
    id: 'mf-2',
    isCalculated: true,
    date: '2026/03/02',
    content: 'スターバックス コーヒー 名古屋',
    amount: 650,
    source: 'dummy',
    category: '未分類',
    subCategory: '',
    memo: '',
    isTransfer: false,
    mfId: 'mf-2',
  },
];

const mockTransactions: TransactionModel[] = mockMfTransactions.map((row) => ({
  id: row.id,
  date: row.date,
  content: row.content,
  amount: { value: row.amount, unit: '円' },
  category: row.category as TransactionModel['category'],
  subCategory: row.subCategory,
  isFixedCost: false,
  memo: row.memo,
  source: 'moneyforward',
  isCalculated: row.isCalculated,
  isTransfer: row.isTransfer,
}));

const mockSummaries: SummaryModel[] = [
  {
    month: '2026-03',
    incomeTotal: 0,
    expenseTotal: 2150,
    balance: -2150,
    categories: [{ name: '未分類', amount: 2150, percentage: 100, kind: 'expense' }],
    dailyTrend: [{ date: '2026-03-01', income: 0, expense: 1500, balance: -1500 }],
    topExpenses: [{ id: 'mf-1', content: 'アマゾンジャパン（キンドル）', amount: 1500, category: '未分類', date: '2026/03/01' }],
    fixedCosts: [],
  },
];

const meta: Meta<typeof TransactionImportTemplate> = {
  title: 'Templates/TransactionImportTemplate',
  component: TransactionImportTemplate,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof TransactionImportTemplate>;

const createTransactionImportTemplateHookMock = (options?: {
  transactions?: TransactionModel[];
  summaries?: SummaryModel[];
  isParsing?: boolean;
  isAnalyzing?: boolean;
  error?: string | null;
  saveError?: string | null;
  validationError?: string | null;
  dataLength?: number;
}) => ({
  transactions: options?.transactions ?? [],
  summaries: options?.summaries ?? [],
  isParsing: options?.isParsing ?? false,
  isAnalyzing: options?.isAnalyzing ?? false,
  error: options?.error ?? null,
  saveError: options?.saveError ?? null,
  validationError: options?.validationError ?? null,
  handleSavePsv: fn(),
  handleFileSelect: fn(),
  dataLength: options?.dataLength ?? 0,
  handleToggleFixedCost: fn(),
  handleUpdateRow: fn((row: TransactionModel) => row),
});

/**
 * Default: 初期状態
 * ファイルが選択される前のアップロードエリアが表示されている状態。
 */
export const Default: Story = {
  beforeEach: () => {
    mocked(TransactionImportTemplateHookModule.useTransactionImportTemplate).mockReturnValue(
      createTransactionImportTemplateHookMock(),
    );
  },
};

/**
 * Success: アップロード成功状態
 * CSVデータの検証とパースが完了し、取引データが表示されている状態。
 */
export const Success: Story = {
  beforeEach: () => {
    mocked(TransactionImportTemplateHookModule.useTransactionImportTemplate).mockReturnValue(
      createTransactionImportTemplateHookMock({ transactions: mockTransactions, summaries: mockSummaries, dataLength: mockTransactions.length }),
    );
  },
};

/**
 * ValidationError: 検証エラー状態
 * ファイル形式やバリデーションエラーが発生し、エラーメッセージが表示されている状態。
 */
export const ValidationError: Story = {
  beforeEach: () => {
    mocked(TransactionImportTemplateHookModule.useTransactionImportTemplate).mockReturnValue(
      createTransactionImportTemplateHookMock({
        transactions: mockTransactions,
        summaries: mockSummaries,
        error: 'CSVの形式が正しくありません。',
        dataLength: mockTransactions.length,
      }),
    );
  },
};

/**
 * SavingPsv: PSV保存中状態
 * CSVデータ表示後、保存処理が進行中でボタンがローディング表示になる状態。
 */
export const SavingPsv: Story = {
  beforeEach: () => {
    mocked(TransactionImportTemplateHookModule.useTransactionImportTemplate).mockReturnValue(
      createTransactionImportTemplateHookMock({
        transactions: mockTransactions,
        summaries: mockSummaries,
        isAnalyzing: true,
        dataLength: mockTransactions.length,
      }),
    );
  },
};

/**
 * SaveError: PSV保存失敗状態
 * 保存API失敗時のエラーメッセージが表示される状態。
 */
export const SaveError: Story = {
  beforeEach: () => {
    mocked(TransactionImportTemplateHookModule.useTransactionImportTemplate).mockReturnValue(
      createTransactionImportTemplateHookMock({
        transactions: mockTransactions,
        summaries: mockSummaries,
        saveError: 'PSV保存に失敗しました。再試行してください。',
        dataLength: mockTransactions.length,
      }),
    );
  },
};

/**
 * ContentOverLimitError: 内容文字数超過エラー状態
 * 内容が20文字を超える取引があり、保存がブロックされた状態。
 * 取引明細から該当セルを編集するよう促すwarningが表示される。
 */
export const ContentOverLimitError: Story = {
  beforeEach: () => {
    mocked(TransactionImportTemplateHookModule.useTransactionImportTemplate).mockReturnValue(
      createTransactionImportTemplateHookMock({
        transactions: mockTransactions,
        summaries: mockSummaries,
        validationError: `内容が${CONTENT_MAX_LENGTH}文字を超える取引が1件あります。下の取引明細から「内容」セルをクリックして編集してください: 「アマゾンジャパン…」(25文字)`,
        dataLength: mockTransactions.length,
      }),
    );
  },
};

/**
 * CategoryError: 大項目選択肢外エラー状態
 * 大項目が選択肢外（例: 未分類）の取引があり、保存がブロックされた状態。
 * 取引明細から該当セルを選択するよう促すwarningが表示される。
 */
export const CategoryError: Story = {
  beforeEach: () => {
    mocked(TransactionImportTemplateHookModule.useTransactionImportTemplate).mockReturnValue(
      createTransactionImportTemplateHookMock({
        transactions: mockTransactions,
        summaries: mockSummaries,
        validationError: '大項目が選択肢外の取引が1件あります。下の取引明細から「大項目」セルをクリックして選択してください: 「アマゾンジャパン」(現状: 未分類)',
        dataLength: mockTransactions.length,
      }),
    );
  },
};

