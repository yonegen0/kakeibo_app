/**
 * @file page.tsx
 * @description コンポーネント確認ページ。開発者向けに各コンポーネントの表示状態を確認するためのページ。
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Alert, Box, Button, Container, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { AIReportModel } from '@/models/AIReportModel';
import type { SummaryModel, TransactionModel } from '@/models/TransactionModel';
import { SummaryCard } from '@/components/organisms/SummaryCard';
import { AIReport } from '@/components/organisms/AIReport';
import { TransactionTable } from '@/components/organisms/TransactionTable';
import { useComponentsPreviewStore } from '@/stores/useComponentsPreviewStore';

/* --- Mock Data --- */

/** テスト用の取引データ */
const mockTransactions: TransactionModel[] = [
  {
    id: 't-1',
    date: '2026/03/01',
    amount: { value: -3600, unit: '円' },
    content: 'スーパー',
    category: '食費',
    subCategory: '食材',
    isCalculated: true,
    isTransfer: false,
    isFixedCost: false,
    memo: '',
    source: 'moneyforward',
  },
  {
    id: 't-2',
    date: '2026/03/03',
    amount: { value: 320000, unit: '円' },
    content: '給与',
    category: '収入',
    subCategory: '給与',
    isCalculated: true,
    isTransfer: false,
    isFixedCost: true,
    memo: '',
    source: 'moneyforward',
  },
  {
    id: 't-3',
    date: '2026/03/05',
    amount: { value: -7800, unit: '円' },
    content: '電気代',
    category: '光熱費',
    subCategory: '電気',
    isCalculated: true,
    isTransfer: false,
    isFixedCost: true,
    memo: '',
    source: 'moneyforward',
  },
];

const mockSummaries: SummaryModel[] = [
  {
    month: '2026-03',
    incomeTotal: 320000,
    expenseTotal: 11400,
    balance: 308600,
    categories: [
      { name: '給与', amount: 320000, percentage: 100, kind: 'income' },
      { name: '食費', amount: 3600, percentage: 31.6, kind: 'expense' },
      { name: '光熱費', amount: 7800, percentage: 68.4, kind: 'expense' },
    ],
    dailyTrend: [{ date: '2026-03-01', income: 320000, expense: 11400, balance: 308600 }],
    topExpenses: [{ id: 't-3', content: '電気代', amount: 7800, category: '光熱費', date: '2026/03/05' }],
    fixedCosts: [{ id: 't-3', content: '電気代', amount: 7800, category: '光熱費' }],
  },
];

const mockReport: AIReportModel = {
  reportId: 'rep-preview-1',
  psvId: 'psv-preview-1',
  title: '3月の家計AIレポート',
  summary: '固定費は安定しています。食費を週次で管理するとさらに改善できます。',
  highlights: ['固定費は良好', '食費の上振れに注意', '収支バランスは黒字'],
  promptSnapshot: 'preview-prompt',
  reportMarkdown: `## コメント

- 収支は十分に黒字です
- 食費の予算超過を抑えるとさらに健全です`,
  createdAt: new Date('2026-03-31T10:00:00Z').toISOString(),
};

const StyledPage = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(6),
  backgroundColor: theme.palette.background.default,
}));

const StyledBackLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
  fontWeight: 600,
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const StyledSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const StyledPromptPreview = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
  whiteSpace: 'pre-wrap',
  fontFamily: theme.typography.fontFamily,
  fontSize: '0.85rem',
  color: theme.palette.text.secondary,
}));

const StyledHeader = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2.5),
}));

/**
 * コンポーネント組み合わせ確認ページ
 */
export default function ComponentsPreviewPage() {
  const router = useRouter();
  const lastPsvId = useComponentsPreviewStore((state) => state.lastPsvId);
  const lastReportId = useComponentsPreviewStore((state) => state.lastReportId);
  const setLastPsvId = useComponentsPreviewStore((state) => state.setLastPsvId);
  const setLastReportId = useComponentsPreviewStore((state) => state.setLastReportId);
  const [flowBusy, setFlowBusy] = useState(false);
  const [flowError, setFlowError] = useState<string | null>(null);

  const handleSeedPsv = async () => {
    setFlowError(null);
    setFlowBusy(true);
    try {
      const response = await fetch('/api/psv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactions: mockTransactions,
          fileName: 'components-preview.csv',
        }),
      });
      if (!response.ok) {
        throw new Error('PSV の作成に失敗しました。');
      }
      const data: { psvId: string } = await response.json();
      setLastPsvId(data.psvId);
      router.push(`/components-preview/analysis?psvId=${encodeURIComponent(data.psvId)}`);
    } catch (e) {
      setFlowError(e instanceof Error ? e.message : 'PSV の作成に失敗しました。');
    } finally {
      setFlowBusy(false);
    }
  };

  const handleAnalyzeToReport = async () => {
    if (!lastPsvId) {
      setFlowError('先に「プレビュー用PSVを作成」を実行するか、psvId を把握してください。');
      return;
    }
    setFlowError(null);
    setFlowBusy(true);
    try {
      const response = await fetch(`/api/analyze/${encodeURIComponent(lastPsvId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error('分析APIの実行に失敗しました。');
      }
      const data: { report: { reportId: string } } = await response.json();
      setLastReportId(data.report.reportId);
      router.push(`/components-preview/report/${encodeURIComponent(data.report.reportId)}`);
    } catch (e) {
      setFlowError(e instanceof Error ? e.message : '分析APIの実行に失敗しました。');
    } finally {
      setFlowBusy(false);
    }
  };

  return (
    <StyledPage>
      <Container maxWidth="lg">
        <StyledHeader elevation={0}>
          <Typography variant="h5" fontWeight={800}>
            Components Preview
          </Typography>
          <Typography color="text.secondary">
            `SummaryCard` / `AIReport` / `TransactionTable` と prompt 編集フローの確認ページです。
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
            <Button size="small" variant="contained" disabled={flowBusy} onClick={handleSeedPsv}>
              {flowBusy ? '処理中...' : 'プレビュー用PSV作成→分析テンプレ'}
            </Button>
            <Button size="small" variant="outlined" disabled={flowBusy || !lastPsvId} onClick={handleAnalyzeToReport}>
              分析API実行→レポートテンプレ
            </Button>
            <Button component={Link} href="/analysis" size="small" variant="outlined">
              本番フロー /analysis
            </Button>
            <Button component={Link} href="/report" size="small" variant="outlined">
              本番フロー /report
            </Button>
            {lastPsvId && (
              <Button
                component={Link}
                href={`/components-preview/analysis?psvId=${encodeURIComponent(lastPsvId)}`}
                size="small"
                variant="text"
              >
                分析テンプレ再表示
              </Button>
            )}
            {lastReportId && (
              <Button
                component={Link}
                href={`/components-preview/report/${encodeURIComponent(lastReportId)}`}
                size="small"
                variant="text"
              >
                レポートテンプレ再表示
              </Button>
            )}
          </Box>
          {flowError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {flowError}
            </Alert>
          )}
          {(lastPsvId || lastReportId) && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              {lastPsvId && <>lastPsvId: {lastPsvId} </>}
              {lastReportId && <>lastReportId: {lastReportId}</>}
            </Typography>
          )}
          <StyledBackLink href="/">ホームに戻る</StyledBackLink>
        </StyledHeader>

        <StyledSection>
          <SummaryCard summaries={mockSummaries} />
        </StyledSection>

        <StyledSection>
          <AIReport report={mockReport} isLoading={false} error={null} />
        </StyledSection>

        <StyledSection>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
            Prompt Snapshot Preview
          </Typography>
          <StyledPromptPreview elevation={0}>{mockReport.promptSnapshot}</StyledPromptPreview>
        </StyledSection>

        <StyledSection>
          <TransactionTable rows={mockTransactions} height={420} />
        </StyledSection>
      </Container>
    </StyledPage>
  );
}

