/**
 * @file AIReportSuccessBody.tsx
 * @description 生成済みのAI家計レポート（タイトル・要約・ハイライト・Markdown本文）を表示する。
 */
import { Box, Chip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import type { AIReportModel } from '@/models/AIReportModel';
import { MarkdownRenderer } from '@/components/atoms/MarkdownRenderer';
import { aiReportFadeIn, aiReportSuccessPulse } from '@/lib/aiReportAnimations';

/* --- Types --- */
/* 
 * AIReportSuccessBody の Props
 */
type AIReportSuccessBodyProps = {
  /** 表示する家計レポートの内容 */
  report: AIReportModel;
};

/* --- Styled Components --- */
/** レポートタイトルと要約テキストをまとめるブロック（下余白）。 */
const StyledSummaryBlock = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

/** レポートの主タイトル（プライマリ色・太字）。 */
const StyledReportTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(1),
  color: theme.palette.primary.main,
}));

/** 要約本文（セカンダリ色・読みやすい行間）。 */
const StyledSummaryText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  lineHeight: 1.6,
}));

/** 「主なポイント」セクション全体のラッパー（下余白）。 */
const StyledHighlightsSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

/** 「主なポイント」見出し。 */
const StyledHighlightsHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
}));

/** ハイライト用 Chip を折り返し配置する行。 */
const StyledHighlightsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1.5),
}));

/** ハイライト1件（入場フェードの遅延・ホバー時のわずかな浮き）。 */
const StyledHighlightChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== '$staggerIndex',
})<{ $staggerIndex: number }>(({ $staggerIndex }) => ({
  fontWeight: 500,
  animation: `${aiReportFadeIn} 0.6s ease-out both`,
  animationDelay: `${$staggerIndex * 0.1}s`,
  '&:hover': {
    transform: 'translateY(-2px)',
    transition: 'transform 0.2s',
  },
}));

/** Markdown 本文と右上バッジアイコンの相対配置用ラッパー。 */
const StyledMarkdownBlock = styled(Box)(() => ({
  position: 'relative',
}));

/** 生成成功を示す右上バッジ（パルスアニメーション）。 */
const StyledSuccessBadgeIcon = styled(CheckCircleOutlineIcon)(({ theme }) => ({
  position: 'absolute',
  top: -8,
  right: -8,
  color: theme.palette.success.main,
  fontSize: 20,
  animation: `${aiReportSuccessPulse} 3s ease-in-out infinite`,
}));

/**
 * 生成済みの家計レポート本文ブロックを表示する。
 * @param props.report 表示対象のレポート
 * @returns 成功時のレポート本文
 */
export const AIReportSuccessBody = (props: AIReportSuccessBodyProps) => {
  const { report } = props;

  return (
    <>
      <StyledSummaryBlock>
        <StyledReportTitle variant="h6">{report.title}</StyledReportTitle>
        <StyledSummaryText variant="body1">{report.summary}</StyledSummaryText>
      </StyledSummaryBlock>

      {report.highlights.length > 0 ? (
        <StyledHighlightsSection>
          <StyledHighlightsHeading variant="subtitle2">主なポイント</StyledHighlightsHeading>
          <StyledHighlightsRow>
            {report.highlights.map((highlight, index) => (
              <StyledHighlightChip
                key={`${highlight}-${index}`}
                label={highlight}
                size="small"
                color="primary"
                variant="filled"
                $staggerIndex={index}
              />
            ))}
          </StyledHighlightsRow>
        </StyledHighlightsSection>
      ) : null}

      <StyledMarkdownBlock>
        <StyledSuccessBadgeIcon aria-hidden />
        <MarkdownRenderer markdown={report.reportMarkdown} />
      </StyledMarkdownBlock>
    </>
  );
};
