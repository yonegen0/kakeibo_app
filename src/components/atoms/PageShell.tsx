/**
 * @file PageShell.tsx
 * @description 全画面共通のレイアウト・スタイルプリミティブ。
 * Slate × Cyan の設計思想を全ページで統一するための基盤コンポーネント群。
 */
import { Box, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

/* --- Styled Primitives --- */

/** ページ全体のレイアウトコンテナ（radial-gradient 背景） */
export const StyledPage = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(8),
  background: `
    radial-gradient(ellipse at 0% 0%, ${theme.palette.secondary.main}18 0%, transparent 50%),
    radial-gradient(ellipse at 100% 100%, ${theme.palette.primary.light}12 0%, transparent 50%),
    ${theme.palette.background.default}
  `,
}));

/** cyan glow + 多層 shadow の Paper カード */
export const StyledHeroCard = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  border: `1px solid ${theme.palette.primary.light}2A`,
  padding: theme.spacing(4),
  background: `
    radial-gradient(ellipse at 0% 0%, ${theme.palette.secondary.main}12, transparent 60%),
    ${theme.palette.background.paper}
  `,
  backdropFilter: 'blur(8px)',
  boxShadow: `
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 24px 48px -12px rgba(15, 23, 42, 0.16)
  `,
}));

/** ナビゲーションボタンを両端に配置する行 */
export const StyledNavRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: theme.spacing(3),
}));

/* --- StepBadge --- */

const StyledBadgeOuter = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  padding: `${theme.spacing(0.5)} ${theme.spacing(1.25)}`,
  borderRadius: theme.spacing(6),
  border: `1px solid ${theme.palette.secondary.main}50`,
  backgroundColor: `${theme.palette.secondary.main}10`,
  marginBottom: theme.spacing(1.5),
  '&::before': {
    content: '""',
    display: 'inline-block',
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: theme.palette.secondary.main,
    flexShrink: 0,
  },
}));

const StyledBadgeLabel = styled('span')(({ theme }) => ({
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '0.6875rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  color: theme.palette.secondary.dark,
}));

/**
 * StepBadge の Props
 */
type StepBadgeProps = {
  /** ステップ番号（例: "01"） */
  step: string;
};

/**
 * ステップ番号バッジ
 * @param props.step ステップ番号文字列
 * @returns ステップバッジの JSX 要素
 */
export const StepBadge = ({ step }: StepBadgeProps) => (
  <StyledBadgeOuter>
    <StyledBadgeLabel>STEP {step}</StyledBadgeLabel>
  </StyledBadgeOuter>
);

/* --- StepHeader --- */

const StyledStepTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  marginBottom: theme.spacing(0.75),
}));

const StyledStepLead = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(3),
}));

/**
 * StepHeader の Props
 */
type StepHeaderProps = {
  /** ステップ番号（例: "01"） */
  step: string;
  /** ステップタイトル */
  title: string;
  /** ステップ説明文（任意） */
  desc?: string;
};

/**
 * ステップヘッダー（バッジ + タイトル + 説明文）
 * @param props.step ステップ番号
 * @param props.title タイトル
 * @param props.desc 説明文（任意）
 * @returns ステップヘッダーの JSX 要素
 */
export const StepHeader = ({ step, title, desc }: StepHeaderProps) => (
  <>
    <StepBadge step={step} />
    <StyledStepTitle variant="h5">{title}</StyledStepTitle>
    {desc && <StyledStepLead variant="body1">{desc}</StyledStepLead>}
  </>
);
