/**
 * @file TransactionPreviewTable.tsx
 * @description 解析・検証済みの取引明細データを DataGrid で表示するコンポーネント。
 */
import { Box, Typography, Paper } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import type { Transaction } from '@/hooks/useMFUploader';

/**
 * TransactionPreviewTableのプロップス定義
 */
type TransactionPreviewTableProps = {
  /** 表示対象の取引データ */
  rows: Transaction[];
  /** テーブル全体の高さ (デフォルト 500) */
  height?: number | string;
};

/* --- Styled Components --- */

/** ルートコンテナ */
const StyledRoot = styled(Box)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(4),
}));

/** タイトル */
const StyledTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginLeft: theme.spacing(1),
}));

/** テーブルの外枠 */
const StyledTableContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
}));

/** DataGrid用のラッパー */
const DataGridWrapper = styled('div')<Pick<TransactionPreviewTableProps, 'height'>>(({ height }) => ({
  height: height ?? 500,
  width: '100%',
}));

/* --- Column Definitions --- */

const columns: GridColDef<Transaction>[] = [
  { field: 'date', headerName: '計算日', width: 120 },
  { field: 'content', headerName: '内容', flex: 1, minWidth: 200 },
  { 
    field: 'amount', 
    headerName: '金額 (円)', 
    type: 'number', 
    width: 120,
    valueFormatter: (value: number) => value?.toLocaleString() ?? '0',
  },
  { field: 'source', headerName: '保有金融機関', width: 180 },
  { field: 'category', headerName: '大項目', width: 150 },
];

/**
 * 検証済みデータを一覧表示するテーブルコンポーネント。
 */
export const TransactionPreviewTable = (props: TransactionPreviewTableProps) => {
  return (
    <StyledRoot>
      <StyledTitle variant="h6" fontWeight="bold">
        取り込みデータプレビュー
      </StyledTitle>
      
      <StyledTableContainer>
        <DataGridWrapper height={props.height}>
          <DataGrid
            rows={props.rows}
            columns={columns}
            // ページネーションの設定（初期表示10件）
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            // セル選択時のアウトラインを抑制し、UXを向上
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                fontWeight: 'bold',
              },
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
            }}
          />
        </DataGridWrapper>
      </StyledTableContainer>
    </StyledRoot>
  );
};