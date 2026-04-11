/**
 * @file AIReportCardShell.tsx
 * @description AI家計レポート用カードの外枠（グラデーション背景・上部アクセント・アニメーション）。
 */
import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { aiReportFadeIn, aiReportSuccessPulse } from '@/lib/aiReportAnimations';

/* 
 * AIReportCardShell の Props
 */
type AIReportCardShellProps = {
  /** カード内に並べる子要素 */
  children: ReactNode;
  /** 成功表示時のみ、カード全体に軽いパルスを重ねるか */
  successAccent?: boolean;
};

/* --- Styled Components --- */
/** 家計レポートカードの外枠（余白・角丸・グラデーション背景・上部カラーライン・フェードイン）。 */
const StyledReportCardPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== '$successAccent',
})<{ $successAccent?: boolean }>(({ theme, $successAccent }) => ({
  position: 'relative',
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 50%, ${theme.palette.background.paper} 100%)`,
  boxShadow: '0 20px 40px rgba(15, 23, 42, 0.1), 0 8px 16px rgba(15, 23, 42, 0.06)',
  width: '100%',
  overflow: 'hidden',
  animation: $successAccent
    ? `${aiReportFadeIn} 0.8s ease-out, ${aiReportSuccessPulse} 2s ease-in-out infinite`
    : `${aiReportFadeIn} 0.6s ease-out`,
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

/**
 * AI家計レポート用のカード外枠を表示する。
 * @param props.children カード内に並べる子要素
 * @param props.successAccent 成功状態の装飾アニメーションを付けるか
 * @returns カードシェル要素
 */
export const AIReportCardShell = (props: AIReportCardShellProps) => {
  return (
    <StyledReportCardPaper elevation={0} $successAccent={props.successAccent === true}>
      {props.children}
    </StyledReportCardPaper>
  );
};
