/**
 * @file TransactionGrid.tsx
 * @description 取引一覧の「見出し＋表」ブロック。通常一覧と自動仕訳付きプレビューの両方で使う。
 * md 以上は DataGrid、md 未満ではタッチ操作に最適化したカードリストへ自動で切り替える。
 */

import { useMemo } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { TransactionModel } from '@/models/TransactionModel';
import { getTransactionDataGridColumns } from '@/lib/transactionDataGridColumns';
import { TransactionTableSectionHeader } from '@/components/molecules/TransactionTableSectionHeader';
import { TransactionDataGridPanel } from '@/components/molecules/TransactionDataGridPanel';
import { TransactionCardListPanel } from '@/components/molecules/TransactionCardListPanel';
import { useIsMobile } from '@/hooks/useIsMobile';

/* --- Types --- */
/**
 * TransactionGrid の Props（取引一覧ブロック）
 */
export type TransactionGridProps = {
  /** 表に並べる取引 */
  rows: TransactionModel[];
  height?: number | string;
  loading?: boolean;
  /** 表の上に出す任意の一行（例: 自動仕訳ボタン） */
  toolbarNode?: React.ReactNode;
  title: string;
  /** タイトル横の短い説明 */
  subtitle?: string;
  /** 固定費フラグをトグルするハンドラ（省略時は固定費列が disabled 表示） */
  onToggleFixedCost?: (id: string) => void;
  /** インライン編集確定時のハンドラ（省略時は編集内容が破棄される） */
  onUpdateRow?: (newRow: TransactionModel) => TransactionModel;
};

/* --- Styled --- */
/** 取引グリッドのルートコンテナ */
const StyledRoot = styled(Box)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(2.5),
  },
}));

/**
 * タイトル + 取引一覧表示。md 以上は DataGrid、md 未満はカードリスト。
 * @param props.rows 表示する取引明細
 * @param props.height テーブル高さ（DataGrid 経路のみ有効）
 * @param props.loading データ取得中の表示状態
 * @param props.toolbarNode toolbar（任意）
 * @param props.title タイトル
 * @param props.subtitle タイトル横の補足（任意）
 * @param props.onToggleFixedCost 固定費トグルハンドラ（任意）
 * @param props.onUpdateRow 編集確定ハンドラ（任意）
 * @returns 取引一覧ブロックの JSX 要素
 */
/* --- Component --- */
export const TransactionGrid = (props: TransactionGridProps) => {
  const isMobile = useIsMobile();

  const columns = useMemo(
    () => getTransactionDataGridColumns({ onToggleFixedCost: props.onToggleFixedCost }),
    [props.onToggleFixedCost],
  );

  return (
    <StyledRoot>
      <TransactionTableSectionHeader title={props.title} subtitle={props.subtitle} />

      {isMobile ? (
        <TransactionCardListPanel
          rows={props.rows}
          loading={props.loading}
          toolbarNode={props.toolbarNode}
          onToggleFixedCost={props.onToggleFixedCost}
          onUpdateRow={props.onUpdateRow}
        />
      ) : (
        <TransactionDataGridPanel
          rows={props.rows}
          columns={columns}
          height={props.height}
          loading={props.loading}
          toolbarNode={props.toolbarNode}
          processRowUpdate={
            props.onUpdateRow
              ? (newRow: TransactionModel) => props.onUpdateRow!(newRow)
              : undefined
          }
        />
      )}
    </StyledRoot>
  );
};
