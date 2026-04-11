/**
 * @file AnalysisTemplate.tsx
 * @description 画面②: PSV集計とAI分析実行（分析実行画面）。
 */
import { Alert, Box, Button, CircularProgress, Paper, TextField, Typography } from '@mui/material';
import { SummaryCard } from '@/components/organisms/SummaryCard';
import { useAnalysisTemplate } from '@/hooks/useAnalysisTemplate';

/* --- Component --- */

/**
 * PSVデータを集計し、AI分析を実行するテンプレートコンポーネント
 * アップロードされた取引データを基にサマリーを生成し、AIレポート作成を行う
 * @returns 分析実行画面の JSX 要素
 */
export const AnalysisTemplate = () => {
  const {
    summaries,
    loadingSummary,
    localError,
    summaryError,
    analyzeError,
    isAnalyzing,
    promptOverride,
    isLoadingPrompt,
    setPromptOverride,
    handleAnalyze,
    handleLoadDefaultPrompt,
    handleResetPrompt,
    goUpload,
    hasSummary,
    hasPsvId,
  } = useAnalysisTemplate();

  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
      {/* ステップインジケーター */}
      <Typography variant="overline" color="primary" fontWeight={700}>
        Step 2
      </Typography>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
        分析実行
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        保存済みPSVを集計し、AI分析を実行します。
      </Typography>

      {/* エラー表示 */}
      {(localError || summaryError || analyzeError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {localError ?? summaryError ?? analyzeError}
        </Alert>
      )}

      {/* サマリー生成中または完了後の表示 */}
      {loadingSummary ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 2 }}>
          <CircularProgress size={20} />
          <Typography color="text.secondary">サマリーを生成中です...</Typography>
        </Box>
      ) : (
        <SummaryCard summaries={summaries} />
      )}

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
          プロンプト編集（任意）
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleLoadDefaultPrompt}
            disabled={!hasPsvId || isLoadingPrompt}
          >
            {isLoadingPrompt ? '読み込み中...' : 'デフォルトを読み込む'}
          </Button>
          <Button variant="text" size="small" onClick={handleResetPrompt} disabled={isLoadingPrompt}>
            リセット
          </Button>
        </Box>
        <TextField
          fullWidth
          multiline
          minRows={5}
          placeholder="ここに入力すると、デフォルト生成プロンプトの代わりにこの内容を利用します。"
          value={promptOverride}
          onChange={(event) => setPromptOverride(event.target.value)}
        />
      </Box>

      {/* ナビゲーションボタン */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button variant="outlined" onClick={goUpload}>
          アップロード画面へ戻る
        </Button>
        <Button variant="contained" disabled={!hasSummary || isAnalyzing} onClick={handleAnalyze}>
          {isAnalyzing ? 'AI分析を実行中...' : 'AI分析を実行してレポートへ'}
        </Button>
      </Box>
    </Paper>
  );
};
