/**
 * @file TransactionCardListPanel.tsx
 * @description xs/sm で DataGrid の代わりに表示するカードリスト。
 * カードタップで TransactionEditDrawer を開き、固定費フラグの切替はカード上で完結する。
 */
'use client';

import { useMemo, useState } from 'react';
import { Box, Pagination, Skeleton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { TransactionModel } from '@/models/TransactionModel';
import { EmptyState } from '@/components/atoms/EmptyState';
import { TransactionCard } from '@/components/molecules/TransactionCard';
import { TransactionEditDrawer } from '@/components/molecules/TransactionEditDrawer';

/* --- Types --- */

/** TransactionCardListPanel の Props */
export type TransactionCardListPanelProps = {
  /** 表示する取引一覧 */
  rows: TransactionModel[];
  /** ローディング中フラグ（true ならスケルトン表示） */
  loading?: boolean;
  /** 表上に差し込む任意の UI（自動仕訳ボタン等） */
  toolbarNode?: React.ReactNode;
  /** 固定費フラグ切替 */
  onToggleFixedCost?: (id: string) => void;
  /** 編集確定時のハンドラ */
  onUpdateRow?: (newRow: TransactionModel) => TransactionModel;
};

/* --- Constants --- */

const PAGE_SIZE = 10;

/* --- Styled --- */

/** リスト全体の縦並び */
const StyledList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.25),
  padding: theme.spacing(1.5),
}));

/** ページネーション周りの行 */
const StyledFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(1.5),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

/** 件数表示 */
const StyledCountLabel = styled(Typography)(({ theme }) => ({
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '0.6875rem',
  color: theme.palette.text.secondary,
  letterSpacing: '0.04em',
}));

/* --- Component --- */

/**
 * 取引カードリスト（xs/sm 用の表示パネル）
 * @param props.rows 表示対象の取引一覧
 * @param props.loading ローディング状態
 * @param props.toolbarNode 表上に差し込む UI（自動仕訳ボタン等）
 * @param props.onToggleFixedCost 固定費トグルハンドラ
 * @param props.onUpdateRow 編集確定ハンドラ
 * @returns カードリスト表示用の要素
 */
export const TransactionCardListPanel = (props: TransactionCardListPanelProps) => {
  const { rows, loading, toolbarNode, onToggleFixedCost, onUpdateRow } = props;

  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);

  const paginatedRows = useMemo(
    () => rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [rows, safePage],
  );

  const editingRow = useMemo(
    () => rows.find((r) => r.id === editingId) ?? null,
    [rows, editingId],
  );

  const handleSave = (newRow: TransactionModel): TransactionModel => {
    if (!onUpdateRow) return newRow;
    return onUpdateRow(newRow);
  };

  // ローディング中はスケルトン
  if (loading) {
    return (
      <Box>
        {toolbarNode}
        <StyledList>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={104} animation="wave" />
          ))}
        </StyledList>
      </Box>
    );
  }

  // 空状態
  if (rows.length === 0) {
    return (
      <Box>
        {toolbarNode}
        <EmptyState
          title="取引が表示できません"
          description="CSVを取り込むと一覧に並びます。"
        />
      </Box>
    );
  }

  const rangeFrom = (safePage - 1) * PAGE_SIZE + 1;
  const rangeTo = Math.min(safePage * PAGE_SIZE, rows.length);

  return (
    <Box>
      {toolbarNode}

      <StyledList>
        {paginatedRows.map((row) => (
          <TransactionCard
            key={row.id}
            row={row}
            onClick={setEditingId}
            onToggleFixedCost={onToggleFixedCost}
          />
        ))}
      </StyledList>

      <StyledFooter>
        <Pagination
          size="small"
          color="secondary"
          count={pageCount}
          page={safePage}
          onChange={(_, value) => setPage(value)}
          siblingCount={0}
        />
        <StyledCountLabel>
          {rangeFrom}-{rangeTo} / {rows.length} 件
        </StyledCountLabel>
      </StyledFooter>

      <TransactionEditDrawer
        row={editingRow}
        onClose={() => setEditingId(null)}
        onSave={handleSave}
      />
    </Box>
  );
};
