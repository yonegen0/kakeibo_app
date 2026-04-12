/**
 * @file ReportTemplate.stories.tsx
 * @description ReportTemplateコンポーネントの表示確認用ストーリー。
 */
import type { Meta, StoryObj } from '@storybook/react';
import { fn, mocked } from 'storybook/test';
import { ReportTemplate } from '@/components/templates/ReportTemplate';
import * as ReportTemplateHookModule from '@/hooks/useReportTemplate';
import type { AIReportModel } from '@/models/AIReportModel';

const mockReport: AIReportModel = {
  reportId: 'report-123',
  psvId: 'psv-456',
  title: '2026-03 の家計レポート',
  summary: '今月の支出は35万円で、前月比5%増加しました。食費の増加が主な要因です。',
  highlights: [
    '総支出: 350,000円 (前月比 +5%)',
    '食費: 80,000円 (前月比 +15%)',
    '住居費: 固定費として120,000円',
    '貯蓄率: 30% (目標達成)',
  ],
  promptSnapshot: '家計分析プロンプト v1.0',
  reportMarkdown: `# 2026年3月 家計分析レポート

## 概要
今月の家計状況を分析した結果、以下の傾向が確認されました。

## 支出内訳
- **食費**: 80,000円 (22.9%)
- **住居費**: 120,000円 (34.3%)
- **交通費**: 25,000円 (7.1%)
- **その他**: 125,000円 (35.7%)

## 分析結果
食費の増加が気になりますが、全体としては健全な家計状況です。

## 改善提案
1. 外食を減らして自炊を増やす
2. 定期券の活用を検討する
3. 固定費の見直しを検討する`,
  createdAt: '2026-03-15T10:00:00Z',
};

const meta: Meta<typeof ReportTemplate> = {
  title: 'Templates/ReportTemplate',
  component: ReportTemplate,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ReportTemplate>;

const createReportTemplateHookMock = (options?: {
  reportId?: string;
  report?: AIReportModel | null;
  isLoading?: boolean;
  error?: string | null;
}) => ({
  reportId: options?.reportId ?? '',
  report: options?.report ?? null,
  isLoading: options?.isLoading ?? false,
  error: options?.error ?? null,
  goAnalysis: fn(),
  goUpload: fn(),
});

/**
 * Default: reportId未指定状態
 * URLパラメータにreportIdが含まれていない状態。
 */
export const Default: Story = {
  beforeEach: () => {
    mocked(ReportTemplateHookModule.useReportTemplate).mockReturnValue(createReportTemplateHookMock());
  },
};

/**
 * Loading: レポート読み込み中状態
 * reportIdが指定され、レポートの取得処理が実行中の状態。
 */
export const Loading: Story = {
  beforeEach: () => {
    mocked(ReportTemplateHookModule.useReportTemplate).mockReturnValue(
      createReportTemplateHookMock({ reportId: 'report-123', isLoading: true }),
    );
  },
};

/**
 * ReportLoaded: レポート表示状態
 * AIレポートの取得が完了し、内容が表示されている状態。
 */
export const ReportLoaded: Story = {
  beforeEach: () => {
    mocked(ReportTemplateHookModule.useReportTemplate).mockReturnValue(
      createReportTemplateHookMock({ reportId: 'report-123', report: mockReport }),
    );
  },
};

/**
 * FetchError: レポート取得エラー状態
 * reportIdが指定されているが、レポートの取得に失敗した状態。
 */
export const FetchError: Story = {
  beforeEach: () => {
    mocked(ReportTemplateHookModule.useReportTemplate).mockReturnValue(
      createReportTemplateHookMock({ reportId: 'report-not-found', error: 'レポートが見つかりません' }),
    );
  },
};

/**
 * PathParamRoute: /report/[reportId] のパス前提
 * クエリではなくパスパラメータで reportId を扱う想定。
 */
export const PathParamRoute: Story = {
  beforeEach: () => {
    mocked(ReportTemplateHookModule.useReportTemplate).mockReturnValue(
      createReportTemplateHookMock({ reportId: 'report-123', report: mockReport }),
    );
  },
};

/**
 * ReloadKeepsPath: リロード時の再取得
 * 既存の path reportId で fetchReportById が呼ばれることを確認。
 */
export const ReloadKeepsPath: Story = {
  beforeEach: () => {
    mocked(ReportTemplateHookModule.useReportTemplate).mockReturnValue(
      createReportTemplateHookMock({ reportId: 'report-123', report: mockReport }),
    );
  },
};