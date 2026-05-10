/**
 * @file ReportTemplate.tsx
 * @description AI分析レポートを表示するテンプレートコンポーネント
 * ワークフローの最終ステップとして、生成されたAIレポートを履歴IDから取得して表示する
 */
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledHeroCard, StepHeader, StyledNavRow } from '@/components/atoms/PageShell';
import { AIReport } from '@/components/organisms/AIReport';
import { useReportTemplate } from '@/hooks/useReportTemplate';
import { Button } from '@/components/atoms/Button';

/* --- Styled --- */

/** エラー・警告アラート */
const StyledStatusAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

/** ローディング行 */
const StyledLoadingRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
}));

/* --- Component --- */

/**
 * AI分析レポート表示テンプレート
 *
 * ワークフローのStep 3として機能し、URLパラメータからreportIdを取得して
 * 対応するAIレポートを表示する。レポートが存在しない場合は適切なエラーメッセージを表示。
 *
 * @returns レポート表示UI
 */
export const ReportTemplate = () => {
  const { reportId, report, isLoading, error, goAnalysis, goUpload } = useReportTemplate();

  return (
    <StyledHeroCard elevation={0}>
      <StepHeader step="03" title="レポート表示" desc="生成済みレポートを履歴IDから再表示します。" />

      {!reportId && (
        <StyledStatusAlert severity="warning">
          reportId が指定されていません。分析画面から移動してください。
        </StyledStatusAlert>
      )}

      {error && <StyledStatusAlert severity="error">{error}</StyledStatusAlert>}

      {isLoading ? (
        <StyledLoadingRow>
          <CircularProgress size={20} />
          <Typography color="text.secondary">レポートを読み込み中です...</Typography>
        </StyledLoadingRow>
      ) : (
        <AIReport report={report} isLoading={false} error={error} />
      )}

      <StyledNavRow>
        <Button variant="outlined" onClick={goAnalysis}>
          分析画面へ
        </Button>
        <Button variant="contained" onClick={goUpload}>
          新しいCSVをアップロード
        </Button>
      </StyledNavRow>
    </StyledHeroCard>
  );
};
