/**
 * @file TransactionTableSectionHeader.tsx
 * @description 取引ブロックの見出し。左に細いライン、横に短い補足を付けられる。
 */

import { Box, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

/* --- Types --- */
/**
 * TransactionTableSectionHeader の Props
 */
type TransactionTableSectionHeaderProps = {
  /** ブロック名 */
  title: string;
  /** 横に添える短い説明（なくてもよい） */
  subtitle?: string;
};

/* --- Styled Components --- */
/** タイトル行（左のアクセント付き） */
const StyledTitleRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  paddingLeft: theme.spacing(1.25),
  borderLeft: `3px solid ${alpha(theme.palette.primary.main, 0.25)}`,
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  letterSpacing: '-0.01em',
  color: theme.palette.text.primary,
}));

/** タイトル横の補助テキスト */
const StyledTitleHint = styled('span')(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  fontWeight: 500,
  fontFamily: theme.typography.fontFamily,
}));

/**
 * 取引一覧セクションの見出し
 * @param props.title メインタイトル
 * @param props.subtitle タイトル横の補足（任意）
 * @returns 見出し表示用の要素
 */
/* --- Component --- */
export const TransactionTableSectionHeader = (props: TransactionTableSectionHeaderProps) => {
  return (
    <StyledTitleRow>
      <StyledTitle variant="h6">{props.title}</StyledTitle>
      {props.subtitle ? <StyledTitleHint>{props.subtitle}</StyledTitleHint> : null}
    </StyledTitleRow>
  );
};
