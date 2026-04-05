/**
 * @file AIReport.tsx
 * @description AI が生成した家計レポート（AIReportModel）を表示する Organism。
 */
import { Box, Chip, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import InsightsIcon from '@mui/icons-material/Insights';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import type { AIReportModel } from '@/models/AIReportModel';
import { MarkdownRenderer } from '@/components/atoms/MarkdownRenderer';
import { EmptyState } from '@/components/atoms/EmptyState';

/* --- Animations --- */

/** フェードインアニメーション */
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/** 成功時のパルスアニメーション */
const successPulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

type AIReportProps = {
  /** 表示対象のレポート（null の場合は未生成） */
  report: AIReportModel | null;
  /** AIレポート生成中かどうか */
  isLoading: boolean;
  /** 生成中に発生したエラー（なければ null） */
  error: string | null;
};

/** レポート全体のカード */
const StyledRoot = styled(Paper)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 50%, ${theme.palette.background.paper} 100%)`,
  boxShadow: '0 20px 40px rgba(15, 23, 42, 0.1), 0 8px 16px rgba(15, 23, 42, 0.06)',
  width: '100%',
  overflow: 'hidden',
  animation: `${fadeIn} 0.6s ease-out`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
    opacity: 0.8,
  },
}));

/** ヘッダー行（タイトル＋補足） */
const HeaderRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

/** ハイライト（箇条書きチップ）の行 */
const HighlightsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(3),
}));

/**
 * AI レポートを状態（Loading / Error / Empty / Success）に応じて表示する。
 * @param props.report 表示対象のレポート
 * @param props.isLoading 生成中フラグ
 * @param props.error エラーメッセージ
 * @returns レポート表示用カード
 */
export const AIReport = (props: AIReportProps) => {
  const header = (
    <HeaderRow>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <InsightsIcon color="primary" sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="overline" color="primary" fontWeight={600}>
            AI Insights
          </Typography>
          <Typography variant="h6" fontWeight={800}>
            家計レポート
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary">
        集計結果をもとにした分析レポート
      </Typography>
    </HeaderRow>
  );

  if (props.isLoading) {
    return (
      <StyledRoot elevation={0}>
        {header}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center', py: 4 }}>
          <CircularProgress size={24} color="primary" />
          <Typography color="text.secondary" fontWeight={500}>
            AI がデータを分析しています...
          </Typography>
        </Box>
      </StyledRoot>
    );
  }

  if (props.error) {
    return (
      <StyledRoot elevation={0}>
        {header}
        <Alert
          severity="error"
          icon={<ErrorOutlineIcon />}
          sx={{
            borderRadius: 2,
            '& .MuiAlert-message': { fontWeight: 500 }
          }}
        >
          レポート生成に失敗しました：{props.error}
        </Alert>
      </StyledRoot>
    );
  }

  if (!props.report) {
    return (
      <StyledRoot elevation={0}>
        {header}
        <EmptyState
          title="AI レポートがまだ生成されていません"
          description="集計を確認後、「AIレポートを生成」ボタンから作成できます。"
        />
      </StyledRoot>
    );
  }

  return (
    <StyledRoot elevation={0} sx={{ animation: `${fadeIn} 0.8s ease-out, ${successPulse} 2s ease-in-out infinite` }}>
      {header}

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: 'primary.main' }}>
          {props.report.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          {props.report.summary}
        </Typography>
      </Box>

      {props.report.highlights.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: 'text.primary' }}>
            主なポイント
          </Typography>
          <HighlightsRow>
            {props.report.highlights.map((h, index) => (
              <Chip
                key={h}
                label={h}
                size="small"
                color="primary"
                variant="filled"
                sx={{
                  fontWeight: 500,
                  animation: `${fadeIn} 0.6s ease-out ${index * 0.1}s both`,
                  '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s' }
                }}
              />
            ))}
          </HighlightsRow>
        </Box>
      )}

      <Box sx={{ position: 'relative' }}>
        <CheckCircleOutlineIcon
          sx={{
            position: 'absolute',
            top: -8,
            right: -8,
            color: 'success.main',
            fontSize: 20,
            animation: `${successPulse} 3s ease-in-out infinite`
          }}
        />
        <MarkdownRenderer markdown={props.report.rawMarkdown} />
      </Box>
    </StyledRoot>
  );
};