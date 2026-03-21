/**
 * @file TransactionGrid.tsx
 * @description 取引テーブル（DataGrid）ブロックのレイアウトと表示を束ねる Organism 部品。
 * `TransactionTable` / `TransactionPreviewTable` から利用される。
 */

import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { TransactionModel } from '@/models/TransactionModel';
import { getTransactionDataGridColumns } from '@/lib/transactionDataGridColumns';
import { TransactionTableSectionHeader } from '@/components/molecules/TransactionTableSectionHeader';
import { TransactionDataGridPanel } from '@/components/molecules/TransactionDataGridPanel';

/* --- Types --- */
/**
 * TransactionGrid の Props（DataGrid 本体ラッパ）
 */
export type TransactionGridProps = {
  rows: TransactionModel[];
  height?: number | string;
  loading?: boolean;
  /** toolbarを表示したい場合のみ渡す（AI解析ボタン等） */
  toolbarNode?: React.ReactNode;
  title: string;
  /** タイトル横の補足（控えめな説明文） */
  subtitle?: string;
};

/* --- Styled --- */
/** 取引グリッドのルートコンテナ */
const StyledRoot = styled(Box)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(4),
}));

/* --- Columns --- */
const columns = getTransactionDataGridColumns();

/**
 * タイトル + DataGrid（ツールバー任意）
 * @param props.rows 表示対象の取引データ
 * @param props.height テーブル高さ
 * @param props.loading DataGrid のローディング状態
 * @param props.toolbarNode toolbar（任意）
 * @param props.title タイトル
 * @param props.subtitle タイトル横の補足（任意）
 * @returns DataGrid 表示用の要素
 */
/* --- Component --- */
export const TransactionGrid = (props: TransactionGridProps) => {
  return (
    <StyledRoot>
      <TransactionTableSectionHeader title={props.title} subtitle={props.subtitle} />
      <TransactionDataGridPanel
        rows={props.rows}
        columns={columns}
        height={props.height}
        loading={props.loading}
        toolbarNode={props.toolbarNode}
      />
    </StyledRoot>
  );
};
