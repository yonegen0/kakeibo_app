/**
 * @file TransactionDataGridPanel.tsx
 * @description 取引表をカード状の枠に入れ、列・高さ・待機中・上段スロットをまとめる。
 */

import { Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { alpha, styled } from '@mui/material/styles';
import type { GridColDef } from '@mui/x-data-grid';
import type { TransactionModel } from '@/models/TransactionModel';

/* --- Types --- */
/**
 * TransactionDataGridPanel の Props
 */
type TransactionDataGridPanelProps = {
  /** 表の行データ */
  rows: TransactionModel[];
  /** 列の見え方 */
  columns: GridColDef<TransactionModel>[];
  /** 表の高さ */
  height?: number | string;
  /** データ待ちのとき true */
  loading?: boolean;
  /** 表の上に差し込む任意の UI */
  toolbarNode?: React.ReactNode;
};

/* --- Styled Components --- */
const StyledTableContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(0),
  borderRadius: theme.spacing(1.75),
  boxShadow: `0 1px 2px ${alpha(theme.palette.common.black, 0.06)}`,
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
}));

/** 表の高さを決める枠 */
const StyledDataGridWrapper = styled('div', {
  shouldForwardProp: (prop) => prop !== '$height',
})<{ $height?: number | string }>(({ theme, $height }) => ({
  height: $height ?? 600,
  width: '100%',
  backgroundColor: alpha(theme.palette.primary.main, 0.02),
}));

const StyledDataGrid = styled(DataGrid<TransactionModel>)(({ theme }) => ({
  border: 'none',
  backgroundColor: 'transparent',
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    borderBottom: `1px solid ${theme.palette.divider}`,
    minHeight: 44,
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: 700,
    fontSize: '0.7rem',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: theme.palette.text.secondary,
  },
  '& .MuiDataGrid-row:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
  '& .MuiDataGrid-cell': {
    borderColor: theme.palette.divider,
  },
  '& .MuiDataGrid-cell:focus': {
    outline: 'none',
  },
  '& .MuiDataGrid-cell:focus-within': {
    outline: 'none',
  },
  '& .MuiDataGrid-footerContainer': {
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.default,
    minHeight: 48,
  },
}));

/**
 * 取引一覧用 DataGrid をカードで包んだパネル
 * @param props.rows 取引明細の行
 * @param props.columns カラム定義
 * @param props.height グリッド高さ
 * @param props.loading ローディング状態
 * @param props.toolbarNode 表示するtoolbar（任意）
 * @returns DataGrid 表示用の要素
 */
/* --- Component --- */
export const TransactionDataGridPanel = (props: TransactionDataGridPanelProps) => {
  return (
    <StyledTableContainer elevation={0}>
      {props.toolbarNode}
      <StyledDataGridWrapper $height={props.height}>
        <StyledDataGrid
          rows={props.rows}
          columns={props.columns}
          loading={props.loading ?? false}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          disableRowSelectionOnClick
        />
      </StyledDataGridWrapper>
    </StyledTableContainer>
  );
};
