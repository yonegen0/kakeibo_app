/**
 * @file transactionDataGridColumns.tsx
 * @description 取引明細 DataGrid 用のカラム定義（表示ロジックはここに集約）。
 */
import type { GridColDef } from '@mui/x-data-grid';
import type { Amount, TransactionModel } from '@/models/TransactionModel';
import { MoneyText } from '@/components/atoms/MoneyText';

/**
 * TransactionModel 向け DataGrid カラム定義を返す
 * @returns GridColDef 配列
 */
export const getTransactionDataGridColumns = (): GridColDef<TransactionModel>[] => [
  { field: 'date', headerName: '計算日', width: 120 },
  { field: 'content', headerName: '内容', flex: 1, minWidth: 200 },
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
  { field: 'category', headerName: '大項目', width: 150, editable: true },
  { field: 'subCategory', headerName: '中項目', width: 150, editable: true },
  { field: 'memo', headerName: '解析理由/メモ', width: 250, editable: true },
];
