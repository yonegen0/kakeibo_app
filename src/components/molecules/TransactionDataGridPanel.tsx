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
  /** インライン編集確定時に呼ばれる（DataGrid processRowUpdate） */
  processRowUpdate?: (newRow: TransactionModel, oldRow: TransactionModel) => TransactionModel | Promise<TransactionModel>;
};

/* --- Styled Components --- */
const StyledTableContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(0),
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.primary.light}2A`,
  overflow: 'hidden',
  background: `
    radial-gradient(ellipse at 0% 0%, ${alpha(theme.palette.secondary.main, 0.06)}, transparent 60%),
    ${theme.palette.background.paper}
  `,
  boxShadow: `
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 16px 32px -16px rgba(15, 23, 42, 0.12),
    0 0 0 1px ${alpha(theme.palette.secondary.main, 0.04)}
  `,
}));

/** 表の高さを決める枠 */
const StyledDataGridWrapper = styled('div', {
  shouldForwardProp: (prop) => prop !== '$height',
})<{ $height?: number | string }>(({ $height }) => ({
  height: $height ?? 600,
  width: '100%',
  backgroundColor: 'transparent',
}));

/** 取引表の DataGrid */
const StyledDataGrid = styled(DataGrid<TransactionModel>)(({ theme }) => ({
  border: 'none',
  backgroundColor: 'transparent',
  '& .MuiDataGrid-columnHeaders': {
    background: `linear-gradient(180deg, ${alpha(theme.palette.secondary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.06)} 100%)`,
    borderBottom: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
    minHeight: 48,
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontFamily: '"JetBrains Mono", monospace',
    fontWeight: 700,
    fontSize: '0.7rem',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: theme.palette.secondary.dark,
  },
  '& .MuiDataGrid-row': {
    transition: 'background-color .15s ease',
  },
  '& .MuiDataGrid-row:nth-of-type(even)': {
    backgroundColor: alpha(theme.palette.secondary.main, 0.025),
  },
  '& .MuiDataGrid-row:hover': {
    backgroundColor: alpha(theme.palette.secondary.main, 0.07),
  },
  '& .MuiDataGrid-row.Mui-selected': {
    backgroundColor: alpha(theme.palette.secondary.main, 0.12),
    '&:hover': {
      backgroundColor: alpha(theme.palette.secondary.main, 0.16),
    },
  },
  '& .MuiDataGrid-cell': {
    borderColor: alpha(theme.palette.divider, 0.6),
  },
  '& .MuiDataGrid-cell:focus': {
    outline: 'none',
  },
  '& .MuiDataGrid-cell:focus-within': {
    outline: 'none',
    boxShadow: `inset 0 0 0 2px ${alpha(theme.palette.secondary.main, 0.4)}`,
  },
  '& .MuiDataGrid-footerContainer': {
    borderTop: `1px solid ${alpha(theme.palette.secondary.main, 0.25)}`,
    background: `linear-gradient(180deg, transparent 0%, ${alpha(theme.palette.secondary.main, 0.04)} 100%)`,
    minHeight: 48,
  },
  '& .MuiDataGrid-footerContainer .MuiIconButton-root:hover': {
    color: theme.palette.secondary.dark,
  },
  '& .MuiDataGrid-overlay': {
    backgroundColor: alpha(theme.palette.background.paper, 0.7),
    backdropFilter: 'blur(2px)',
  },
  '& .MuiDataGrid-cell--editing': {
    overflow: 'visible',
    position: 'relative',
    zIndex: 2,
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
          processRowUpdate={props.processRowUpdate}
          onProcessRowUpdateError={(err) => console.error('processRowUpdate failed', err)}
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
