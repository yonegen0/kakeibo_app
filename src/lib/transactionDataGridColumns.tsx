/**
 * @file transactionDataGridColumns.tsx
 * @description 取引明細 DataGrid 用のカラム定義（表示ロジックはここに集約）。
 */
import { Box, Switch } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { GridColDef } from '@mui/x-data-grid';
import type { Amount, TransactionModel } from '@/models/TransactionModel';
import { MoneyText } from '@/components/atoms/MoneyText';
import { CONTENT_MAX_LENGTH } from '@/lib/contentValidation';
import { isValidCategory } from '@/lib/categoryValidation';
import { TransactionContentEditCell } from '@/components/molecules/TransactionContentEditCell';
import { TransactionCategoryEditCell } from '@/components/molecules/TransactionCategoryEditCell';

/** 内容セルのスタイル（文字数超過時に赤字） */
const StyledContentCell = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$isOver',
})<{ $isOver: boolean }>(({ theme, $isOver }) => ({
  color: $isOver ? theme.palette.error.main : 'inherit',
  fontWeight: $isOver ? 600 : 'inherit',
}));

/** 大項目セルのスタイル（選択肢外の値の時に赤字） */
const StyledCategoryCell = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$isInvalid',
})<{ $isInvalid: boolean }>(({ theme, $isInvalid }) => ({
  color: $isInvalid ? theme.palette.error.main : 'inherit',
  fontWeight: $isInvalid ? 600 : 'inherit',
}));

/** getTransactionDataGridColumns のオプション */
type GetColumnsOptions = {
  /** 固定費フラグをトグルするハンドラ（省略時は固定費列が disabled 表示） */
  onToggleFixedCost?: (id: string) => void;
};

/**
 * TransactionModel 向け DataGrid カラム定義を返す
 * @param options オプション（固定費トグルハンドラ）
 * @returns GridColDef 配列
 */
export const getTransactionDataGridColumns = (options?: GetColumnsOptions): GridColDef<TransactionModel>[] => [
  { field: 'date', headerName: '計算日', width: 120 },
  {
    field: 'content',
    headerName: '内容',
    flex: 1,
    minWidth: 200,
    editable: true,
    renderCell: (params) => {
      const value = (params.value as string) ?? '';
      return <StyledContentCell $isOver={value.length > CONTENT_MAX_LENGTH}>{value}</StyledContentCell>;
    },
    renderEditCell: (params) => <TransactionContentEditCell {...params} />,
  },
  {
    field: 'amount',
    headerName: '金額',
    type: 'number',
    width: 120,
    valueGetter: (value: Amount) => value?.value,
    renderCell: (params) => {
      const amount = params.row.amount;
      return <MoneyText amount={amount} />;
    },
  },
  {
    field: 'category',
    headerName: '大項目',
    width: 150,
    editable: true,
    renderCell: (params) => {
      const value = (params.value as string) ?? '';
      return (
        <StyledCategoryCell $isInvalid={!isValidCategory(value)}>
          {value || '（未選択）'}
        </StyledCategoryCell>
      );
    },
    renderEditCell: (params) => <TransactionCategoryEditCell {...params} />,
  },
  { field: 'subCategory', headerName: '中項目', width: 150, editable: true },
  { field: 'memo', headerName: '解析理由/メモ', width: 250, editable: true },
  {
    field: 'isFixedCost',
    headerName: '固定費',
    width: 90,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Switch
        size="small"
        checked={params.row.isFixedCost}
        onChange={() => options?.onToggleFixedCost?.(params.row.id)}
        disabled={!options?.onToggleFixedCost}
      />
    ),
  },
];
