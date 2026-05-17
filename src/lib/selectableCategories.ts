/**
 * @file selectableCategories.ts
 * @description 金額の正負に応じて選択可能な大項目を絞り込むヘルパ。
 * DataGrid の編集セルとカードリストの編集ドロワーで共通利用する。
 */
import type { Category } from '@/models/TransactionModel';
import { VALID_CATEGORIES } from '@/lib/categoryValidation';

/**
 * 金額の値に応じて選べる大項目を返す
 * - 正: 「収入」のみ
 * - 負: 「収入」以外
 * - 0:  すべて
 * @param amountValue 金額の数値
 * @returns 選択可能な Category 配列
 */
export const getSelectableCategories = (amountValue: number): readonly Category[] => {
  if (amountValue > 0) return VALID_CATEGORIES.filter((c) => c === '収入');
  if (amountValue < 0) return VALID_CATEGORIES.filter((c) => c !== '収入');
  return VALID_CATEGORIES;
};
