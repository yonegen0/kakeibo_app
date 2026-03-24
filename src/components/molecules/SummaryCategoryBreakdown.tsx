/**
 * @file SummaryCategoryBreakdown.tsx
 * @description 月次サマリーのカテゴリ別内訳リストを表示する Molecule。
 */

import { alpha, styled } from '@mui/material/styles';
import { Box, LinearProgress, Typography } from '@mui/material';
import type { MonthlySummaryModel } from '@/models/TransactionModel';
import { MoneyText } from '@/components/atoms/MoneyText';
import { toYenAmount } from '@/lib/toYenAmount';

/* --- Types --- */
/**
 * SummaryCategoryBreakdown の Props
 */
type SummaryCategoryBreakdownProps = {
  /** 表示するカテゴリ行（上位N件は呼び出し側で絞ってもよい） */
  categories: MonthlySummaryModel['categories'];
};

/* --- Styled Components --- */
/** カテゴリ一覧セクション */
const StyledCategorySection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3.5),
  paddingTop: theme.spacing(2.5),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

/** セクションのタイトル */
const StyledSectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  letterSpacing: '-0.01em',
  marginBottom: theme.spacing(2),
}));

/** カテゴリ行 */
const StyledCategoryRow = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-of-type': {
    borderBottom: 'none',
    paddingBottom: 0,
  },
  '&:hover': {
    backgroundColor: 'rgba(15, 23, 42, 0.02)',
    marginLeft: theme.spacing(-1),
    marginRight: theme.spacing(-1),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    borderRadius: theme.spacing(1),
  },
}));

/** カテゴリ行上部（名前・金額を含む） */
const StyledCategoryRowTop = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(1),
}));

/** 名前エリア（ドット＋カテゴリ名＋ピル） */
const StyledCategoryNameRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  minWidth: 0,
}));

/** 種別を示すドット */
const StyledKindDot = styled('span', {
  shouldForwardProp: (prop) => prop !== '$kind',
})<{ $kind: 'income' | 'expense' }>(({ theme, $kind }) => ({
  flexShrink: 0,
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: $kind === 'income' ? theme.palette.success.main : theme.palette.error.main,
  boxShadow:
    $kind === 'income'
      ? `0 0 0 3px ${theme.palette.success.main}22`
      : `0 0 0 3px ${theme.palette.error.main}22`,
}));

/** カテゴリ名表示 */
const StyledCategoryName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

/** 収支種別ラベル（ピル） */
const StyledKindPill = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$kind',
})<{ $kind: 'income' | 'expense' }>(({ theme, $kind }) => ({
  fontSize: '0.65rem',
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  padding: theme.spacing(0.25, 0.75),
  borderRadius: 999,
  color: $kind === 'income' ? theme.palette.success.dark : theme.palette.error.dark,
  backgroundColor:
    $kind === 'income' ? alpha(theme.palette.success.main, 0.12) : alpha(theme.palette.error.main, 0.12),
}));

/** 金額・% 表示エリア */
const StyledCategoryAmountRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'flex-end',
  gap: theme.spacing(1.5),
}));

/** 割合テキスト */
const StyledPercentText = styled('span')(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 700,
  color: theme.palette.text.secondary,
  minWidth: 44,
  textAlign: 'right',
  fontFamily: theme.typography.fontFamily,
}));

/** 進捗バー */
const StyledCategoryProgress = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== '$kind',
})<{ $kind: 'income' | 'expense' }>(({ theme, $kind }) => ({
  height: 6,
  borderRadius: 999,
  backgroundColor: theme.palette.action.hover,
  '& .MuiLinearProgress-bar': {
    borderRadius: 999,
    backgroundColor: $kind === 'income' ? theme.palette.success.main : theme.palette.error.main,
  },
}));

const MAX_ROWS = 6;

/**
 * カテゴリ別内訳（最大6件）
 * @param props.categories 表示するカテゴリ行
 * @returns カテゴリ別内訳表示用の要素
 */
/* --- Component --- */
export const SummaryCategoryBreakdown = (props: SummaryCategoryBreakdownProps) => {
  const rows = props.categories.slice(0, MAX_ROWS);

  return (
    <StyledCategorySection>
      <StyledSectionTitle variant="subtitle1">カテゴリ別内訳</StyledSectionTitle>

      {rows.length === 0 ? (
        <Typography color="text.secondary" fontWeight={500}>
          該当カテゴリがありません
        </Typography>
      ) : (
        rows.map((c) => (
          <StyledCategoryRow key={`${c.kind}-${c.name}`}>
            <StyledCategoryRowTop>
              <StyledCategoryNameRow>
                <StyledKindDot $kind={c.kind} />
                <StyledCategoryName variant="body2">{c.name}</StyledCategoryName>
                <StyledKindPill $kind={c.kind}>{c.kind === 'income' ? '収入' : '支出'}</StyledKindPill>
              </StyledCategoryNameRow>
              <StyledCategoryAmountRow>
                <MoneyText amount={toYenAmount(c.amount)} />
                <StyledPercentText>{c.percentage.toFixed(1)}%</StyledPercentText>
              </StyledCategoryAmountRow>
            </StyledCategoryRowTop>
            <StyledCategoryProgress variant="determinate" value={Math.min(100, c.percentage)} $kind={c.kind} />
          </StyledCategoryRow>
        ))
      )}
    </StyledCategorySection>
  );
};
