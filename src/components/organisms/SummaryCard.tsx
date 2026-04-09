/**
 * @file SummaryCard.tsx
 * @description 月ごとの収支合計とカテゴリ内訳をまとめたカード。見出し・数値・内訳は下位部品に分ける。
 */
import { useEffect, useMemo, useState } from 'react';
import { Box, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { SummaryModel } from '@/models/TransactionModel';
import { SummaryMetricTiles } from '@/components/molecules/SummaryMetricTiles';
import { SummaryCategoryBreakdown } from '@/components/molecules/SummaryCategoryBreakdown';
import { SummaryCardHeader } from '@/components/molecules/SummaryCardHeader';
import { EmptyState } from '@/components/atoms/EmptyState';

/**
 * SummaryCard の Props
 */
type SummaryCardProps = {
  /** 月ごとのサマリー（複数月あれば切り替え可能） */
  summaries: SummaryModel[];
};

/* --- Styled (カード外枠のみ Organism で保持) --- */

/** サマリーカードのルートコンテナ */
const StyledRoot = styled(Paper)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  borderRadius: theme.spacing(2.5),
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
  background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
  boxShadow: '0 12px 40px rgba(15, 23, 42, 0.08)',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    height: 4,
    background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
    opacity: 0.9,
  },
}));

/** ルート内のパディング領域 */
const StyledRootInner = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(3),
  paddingTop: theme.spacing(3.5),
}));

/* --- Component --- */
/**
 * 月次の家計サマリーを表示するカード
 * @param props.summaries 月ごとの家計サマリー一覧
 * @returns サマリーカード表示要素
 */
export const SummaryCard = (props: SummaryCardProps) => {
  const monthOptions = useMemo(
    () => props.summaries.map((s) => s.month),
    [props.summaries],
  );

  const [selectedMonth, setSelectedMonth] = useState<string>(monthOptions[0] ?? '');

  useEffect(() => {
    if (!monthOptions.includes(selectedMonth)) {
      setSelectedMonth(monthOptions[0] ?? '');
    }
  }, [monthOptions, selectedMonth]);

  const summary = props.summaries.find((s) => s.month === selectedMonth) ?? null;

  return (
    <StyledRoot elevation={0}>
      <StyledRootInner>
        <SummaryCardHeader
          eyebrowText="Insights"
          title="月次サマリー"
          monthOptions={monthOptions}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />

        {!summary ? (
          <EmptyState
            title="集計データがありません"
            description="CSVの取り込み後に月次サマリーが表示されます。"
          />
        ) : (
          <>
            <SummaryMetricTiles
              incomeTotal={summary.incomeTotal}
              expenseTotal={summary.expenseTotal}
              balance={summary.balance}
            />
            <SummaryCategoryBreakdown categories={summary.categories} />
          </>
        )}
      </StyledRootInner>
    </StyledRoot>
  );
};
