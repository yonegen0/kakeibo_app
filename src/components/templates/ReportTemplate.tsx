/**
 * @file ReportTemplate.tsx
 * @description AI分析レポートを表示するテンプレートコンポーネント
 * ワークフローの最終ステップとして、生成されたAIレポートを履歴IDから取得して表示する
 */
import { Alert, Box, Button, CircularProgress, Paper, Typography } from '@mui/material';
import { AIReport } from '@/components/organisms/AIReport';
import { useReportTemplate } from '@/hooks/useReportTemplate';

/* --- Component --- */
/**
 * AI分析レポート表示テンプレート
 *
 * ワークフローのStep 3として機能し、URLパラメータからreportIdを取得して
 * 対応するAIレポートを表示する。レポートが存在しない場合は適切なエラーメッセージを表示。
 *
 * @returns {JSX.Element} レポート表示UI
 */
export const ReportTemplate = () => {
  const { reportId, report, isLoading, error, goAnalysis, goUpload } = useReportTemplate();

  /* --- Render --- */
  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
      {/* ステップインジケーター */}
      <Typography variant="overline" color="primary" fontWeight={700}>
        Step 3
      </Typography>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
        レポート表示
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        生成済みレポートを履歴IDから再表示します。
      </Typography>

      {/* reportId未指定時の警告 */}
      {!reportId && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          reportId が指定されていません。分析画面から移動してください。
        </Alert>
      )}

      {/* AI分析エラー表示 */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* レポート読み込み中または完了後の表示 */}
      {isLoading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 2 }}>
          <CircularProgress size={20} />
          <Typography color="text.secondary">レポートを読み込み中です...</Typography>
        </Box>
      ) : (
        <AIReport report={report} isLoading={false} error={error} />
      )}

      {/* ナビゲーションボタン */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button variant="outlined" onClick={goAnalysis}>
          分析画面へ
        </Button>
        <Button variant="contained" onClick={goUpload}>
          新しいCSVをアップロード
        </Button>
      </Box>
    </Paper>
  );
};
