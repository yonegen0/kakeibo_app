/**
 * @file AIReportLoadingBody.tsx
 * @description AI家計レポート生成中の本文（スピナーと案内文）
 */
import { Box, CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

/** スピナーと案内文を中央寄せで横並びにする行 */
const StyledLoadingRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  justifyContent: 'center',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

/** 生成中メッセージ（セカンダリ色・中太） */
const StyledLoadingMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 500,
}));

/** AIReportLoadingBody の Props */
export type AIReportLoadingBodyProps = {
  /** スピナー横に表示する案内文 */
  message: string;
};

/**
 * 家計レポートの生成待ち状態の本文を表示する
 * @param props.message 案内文
 * @returns ローディング行
 */
export const AIReportLoadingBody = (props: AIReportLoadingBodyProps) => {
  return (
    <StyledLoadingRow>
      <CircularProgress size={24} color="primary" />
      <StyledLoadingMessage>{props.message}</StyledLoadingMessage>
    </StyledLoadingRow>
  );
};
