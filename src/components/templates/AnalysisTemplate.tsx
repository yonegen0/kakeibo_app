/**
 * @file AnalysisTemplate.tsx
 * @description 画面②: PSV集計とAI分析実行（分析実行画面）。
 */
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import { Input } from '@/components/atoms/Input';
import { styled } from '@mui/material/styles';
import { StyledHeroCard, StepHeader, StyledNavRow } from '@/components/atoms/PageShell';
import { SummaryCard } from '@/components/organisms/SummaryCard';
import { useAnalysisTemplate } from '@/hooks/useAnalysisTemplate';
import { Button } from '@/components/atoms/Button';

/* --- Styled --- */

/** エラーアラート */
const StyledErrorAlert = styled(Alert)(({ theme }) => ({
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

/** プロンプト編集セクション */
const StyledPromptSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

/** セクション見出し */
const StyledSubtitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(1),
}));

/** プロンプト操作ボタン行 */
const StyledPromptControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
}));

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
    <StyledHeroCard elevation={0}>
      <StepHeader step="02" title="分析実行" desc="保存済みPSVを集計し、AI分析を実行します。" />

      {(localError || summaryError || analyzeError) && (
        <StyledErrorAlert severity="error">
          {localError ?? summaryError ?? analyzeError}
        </StyledErrorAlert>
      )}

      {loadingSummary ? (
        <StyledLoadingRow>
          <CircularProgress size={20} />
          <Typography color="text.secondary">サマリーを生成中です...</Typography>
        </StyledLoadingRow>
      ) : (
        <SummaryCard summaries={summaries} />
      )}

      <StyledPromptSection>
        <StyledSubtitle variant="subtitle2">プロンプト編集（任意）</StyledSubtitle>
        <StyledPromptControls>
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
        </StyledPromptControls>
        <Input
          fullWidth
          multiline
          minRows={5}
          placeholder="ここに入力すると、デフォルト生成プロンプトの代わりにこの内容を利用します。"
          value={promptOverride}
          onChange={(event) => setPromptOverride(event.target.value)}
        />
      </StyledPromptSection>

      <StyledNavRow>
        <Button variant="outlined" onClick={goUpload}>
          アップロード画面へ戻る
        </Button>
        <Button variant="contained" disabled={!hasSummary || isAnalyzing} onClick={handleAnalyze}>
          {isAnalyzing ? 'AI分析を実行中...' : 'AI分析を実行してレポートへ'}
        </Button>
      </StyledNavRow>
    </StyledHeroCard>
  );
};
