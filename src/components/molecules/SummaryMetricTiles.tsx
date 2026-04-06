/**
 * @file SummaryMetricTiles.tsx
 * @description 収入・支出・残高を並べた 3 枚のタイル。
 */

import { Box, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { MoneyText } from '@/components/atoms/MoneyText';
import { toYenAmount } from '@/lib/toYenAmount';

/* --- Types --- */
/**
 * SummaryMetricTiles の Props
 */
type SummaryMetricTilesProps = {
  /** その月の収入合計 */
  incomeTotal: number;
  /** その月の支出合計 */
  expenseTotal: number;
  /** 収支差 */
  balance: number;
};

type MetricAccent = 'income' | 'expense' | 'balance';

/* --- Styled Components --- */
/** メトリクスタイル行（3列レイアウト） */
const StyledMetricsRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
}));

/** 各メトリクスタイルカード */
const StyledMetricCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== '$accent',
})<{ $accent: MetricAccent }>(({ theme, $accent }) => {
  const bar =
    $accent === 'income'
      ? theme.palette.success.main
      : $accent === 'expense'
        ? theme.palette.error.main
        : theme.palette.secondary.main;

  return {
    position: 'relative',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1.5),
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(15, 23, 42, 0.04)',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
      backgroundColor: bar,
      borderRadius: '4px 0 0 4px',
    },
  };
});

/** 各カード内のラベル */
const StyledMetricLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 600,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.75),
}));

/**
 * 収入・支出・残高の3タイル
 * @param props.incomeTotal 合計収入
 * @param props.expenseTotal 合計支出
 * @param props.balance 残高
 * @returns 3タイル表示用の要素
 */
/* --- Component --- */
export const SummaryMetricTiles = (props: SummaryMetricTilesProps) => {
  return (
    <StyledMetricsRow>
      <StyledMetricCard $accent="income" elevation={0}>
        <StyledMetricLabel>合計収入</StyledMetricLabel>
        <MoneyText amount={toYenAmount(props.incomeTotal)} />
      </StyledMetricCard>
      <StyledMetricCard $accent="expense" elevation={0}>
        <StyledMetricLabel>合計支出</StyledMetricLabel>
        <MoneyText amount={toYenAmount(props.expenseTotal)} />
      </StyledMetricCard>
      <StyledMetricCard $accent="balance" elevation={0}>
        <StyledMetricLabel>残高</StyledMetricLabel>
        <MoneyText amount={toYenAmount(props.balance)} />
      </StyledMetricCard>
    </StyledMetricsRow>
  );
};
