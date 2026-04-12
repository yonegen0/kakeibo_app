/**
 * @file AnalysisTemplate.stories.tsx
 * @description AnalysisTemplateコンポーネントの表示確認用ストーリー。
 */
import type { Meta, StoryObj } from '@storybook/react';
import { fn, mocked } from 'storybook/test';
import { AnalysisTemplate } from '@/components/templates/AnalysisTemplate';
import * as AnalysisTemplateHookModule from '@/hooks/useAnalysisTemplate';
import type { SummaryModel } from '@/models/TransactionModel';

const mockSummary: SummaryModel = {
  month: '2026-03',
  incomeTotal: 500000,
  expenseTotal: 350000,
  balance: 150000,
  categories: [
    { name: '食費', amount: 80000, percentage: 22.9, kind: 'expense' },
    { name: '交通費', amount: 25000, percentage: 7.1, kind: 'expense' },
    { name: '住居費', amount: 120000, percentage: 34.3, kind: 'expense' },
  ],
  dailyTrend: [{ date: '2026-03-01', income: 0, expense: 12000, balance: -12000 }],
  topExpenses: [{ id: 'tx-1', content: '家賃', amount: 120000, category: '住居費', date: '2026-03-01' }],
  fixedCosts: [{ id: 'tx-1', content: '家賃', amount: 120000, category: '住居費' }],
};

const createAnalysisTemplateHookMock = (options?: {
  summaries?: SummaryModel[];
  loadingSummary?: boolean;
  localError?: string | null;
  summaryError?: string | null;
  analyzeError?: string | null;
  isAnalyzing?: boolean;
  promptOverride?: string;
  isLoadingPrompt?: boolean;
  hasPsvId?: boolean;
}) => ({
  summaries: options?.summaries ?? [],
  loadingSummary: options?.loadingSummary ?? false,
  localError: options?.localError ?? null,
  summaryError: options?.summaryError ?? null,
  analyzeError: options?.analyzeError ?? null,
  isAnalyzing: options?.isAnalyzing ?? false,
  promptOverride: options?.promptOverride ?? '',
  isLoadingPrompt: options?.isLoadingPrompt ?? false,
  setPromptOverride: fn(),
  handleAnalyze: fn(),
  handleLoadDefaultPrompt: fn(),
  handleResetPrompt: fn(),
  goUpload: fn(),
  hasSummary: (options?.summaries?.length ?? 0) > 0,
  hasPsvId: options?.hasPsvId ?? false,
});

const meta: Meta<typeof AnalysisTemplate> = {
  title: 'Templates/AnalysisTemplate',
  component: AnalysisTemplate,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof AnalysisTemplate>;

/**
 * Default: 初期状態
 * PSV IDが指定されていない状態。
 */
export const Default: Story = {
  beforeEach: () => {
    mocked(AnalysisTemplateHookModule.useAnalysisTemplate).mockReturnValue(createAnalysisTemplateHookMock());
  },
};

/**
 * LoadingSummary: サマリー生成中状態
 * PSVデータの集計処理が実行中の状態。
 */
export const LoadingSummary: Story = {
  beforeEach: () => {
    mocked(AnalysisTemplateHookModule.useAnalysisTemplate).mockReturnValue(
      createAnalysisTemplateHookMock({ loadingSummary: true, hasPsvId: true }),
    );
  },
};

/**
 * SummaryLoaded: サマリー生成完了状態
 * PSVデータの集計が完了し、サマリーが表示されている状態。
 */
export const SummaryLoaded: Story = {
  beforeEach: () => {
    mocked(AnalysisTemplateHookModule.useAnalysisTemplate).mockReturnValue(
      createAnalysisTemplateHookMock({ summaries: [mockSummary], hasPsvId: true }),
    );
  },
};

/**
 * Analyzing: AI分析実行中状態
 * AI分析が実行中の状態。
 */
export const Analyzing: Story = {
  beforeEach: () => {
    mocked(AnalysisTemplateHookModule.useAnalysisTemplate).mockReturnValue(
      createAnalysisTemplateHookMock({ summaries: [mockSummary], isAnalyzing: true, hasPsvId: true }),
    );
  },
};

/**
 * SummaryError: サマリー生成エラー状態
 * PSVデータの集計処理でエラーが発生した状態。
 */
export const SummaryError: Story = {
  beforeEach: () => {
    mocked(AnalysisTemplateHookModule.useAnalysisTemplate).mockReturnValue(
      createAnalysisTemplateHookMock({ summaryError: 'PSVデータの集計に失敗しました。' }),
    );
  },
};

/**
 * AnalyzeError: AI分析エラー状態
 * AI分析実行でエラーが発生した状態。
 */
export const AnalyzeError: Story = {
  beforeEach: () => {
    mocked(AnalysisTemplateHookModule.useAnalysisTemplate).mockReturnValue(
      createAnalysisTemplateHookMock({
        summaries: [mockSummary],
        analyzeError: 'AI分析の実行に失敗しました。',
        hasPsvId: true,
      }),
    );
  },
};

/**
 * PromptLoaded: デフォルトプロンプト読込後
 * 「デフォルトを読み込む」を押して入力欄が埋まる状態。
 */
export const PromptLoaded: Story = {
  beforeEach: () => {
    mocked(AnalysisTemplateHookModule.useAnalysisTemplate).mockReturnValue(
      createAnalysisTemplateHookMock({
        summaries: [mockSummary],
        promptOverride: 'default prompt template for analysis',
        hasPsvId: true,
      }),
    );
  },
};

/**
 * PromptReset: プロンプトリセット動作
 * 読み込み後に「リセット」で空に戻る状態。
 */
export const PromptReset: Story = {
  beforeEach: () => {
    mocked(AnalysisTemplateHookModule.useAnalysisTemplate).mockReturnValue(
      createAnalysisTemplateHookMock({ summaries: [mockSummary], hasPsvId: true }),
    );
  },
};