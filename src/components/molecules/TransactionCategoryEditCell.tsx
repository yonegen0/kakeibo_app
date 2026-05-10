/**
 * @file TransactionCategoryEditCell.tsx
 * @description 取引「大項目」セル編集用コンポーネント。MUI Select で Category の選択肢を表示する。
 */
import { MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useGridApiContext, type GridRenderEditCellParams } from '@mui/x-data-grid';
import type { Category, TransactionModel } from '@/models/TransactionModel';
import { Select } from '@/components/atoms/Select';
import { VALID_CATEGORIES, isValidCategory } from '@/lib/categoryValidation';

/**
 * 取引「大項目」セルの編集 UI
 * MUI Select で Category の選択肢を表示し、選択肢外の値は空表示にする
 * @param params DataGrid の renderEditCell パラメータ
 * @returns 編集用の Select 要素
 */
export const TransactionCategoryEditCell = (params: GridRenderEditCellParams<TransactionModel, string>) => {
  const apiRef = useGridApiContext();
  const value = (params.value as string) ?? '';

  const { value: amountValue } = params.row.amount;
  const selectableCategories =
    amountValue > 0
      ? VALID_CATEGORIES.filter((c) => c === '収入')
      : amountValue < 0
      ? VALID_CATEGORIES.filter((c) => c !== '収入')
      : VALID_CATEGORIES;

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    apiRef.current.setEditCellValue({
      id: params.id,
      field: params.field,
      value: event.target.value as Category,
    });
  };

  return (
    <Select
      value={isValidCategory(value) ? value : ''}
      onChange={handleChange}
      size="small"
      fullWidth
      // biome-ignore lint/a11y/noAutofocus: 編集開始時にフォーカスを当てる必要がある
      autoFocus
      displayEmpty
      color="secondary"
      sx={{ height: '100%' }}
    >
      {/* value が選択肢外のとき MUI 警告を抑止するための隠し項目 */}
      <MenuItem value="" sx={{ display: 'none' }} />
      {selectableCategories.map((cat) => (
        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
      ))}
    </Select>
  );
};
