/**
 * @file categoryValidation.ts
 * @description 取引の大項目（category）に対する選択肢制限と検証ヘルパ。
 */
import type { Category, TransactionModel } from '@/models/TransactionModel';

/** 有効な大項目の選択肢一覧（PSV保存前検証で使用） */
export const VALID_CATEGORIES: readonly Category[] = [
  '収入',
  '食費',
  '日用品',
  '趣味・娯楽',
  '交際費',
  '交通費',
  '衣服・美容',
  '健康・医療',
  '自動車',
  '教養・教育',
  '特別な支出',
  '現金・カード',
  '水道・光熱費',
  '通信費',
  '住宅',
  '税・社会保障',
  '保険',
  'その他',
];

/** value が有効な Category かどうかを判定する */
export const isValidCategory = (value: string): value is Category =>
  (VALID_CATEGORIES as readonly string[]).includes(value);

/** category が選択肢外の取引一覧を返す */
export const findInvalidCategoryTransactions = (
  transactions: TransactionModel[],
): TransactionModel[] =>
  transactions.filter((t) => !isValidCategory(t.category));

/** 選択肢外の行からユーザー向けエラーメッセージを生成する */
export const buildInvalidCategoryErrorMessage = (
  invalid: TransactionModel[],
): string => {
  const sample = invalid
    .slice(0, 3)
    .map((t) => `「${t.content.slice(0, 10)}」(現状: ${t.category || '未設定'})`)
    .join('、');
  const more = invalid.length > 3 ? ` ほか${invalid.length - 3}件` : '';
  return `大項目が選択肢外の取引が${invalid.length}件あります。下の取引明細から「大項目」セルをクリックして選択してください: ${sample}${more}`;
};

/** amount.value と category の整合性を1件チェックする（正→'収入'、負→'収入'以外、0→制約なし） */
export const isAmountCategoryConsistent = (transaction: TransactionModel): boolean => {
  const { value } = transaction.amount;
  if (value > 0) return transaction.category === '収入';
  if (value < 0) return transaction.category !== '収入';
  return true;
};

/** amount-category 不整合の取引一覧を返す */
export const findInconsistentAmountCategoryTransactions = (
  transactions: TransactionModel[],
): TransactionModel[] =>
  transactions.filter((t) => !isAmountCategoryConsistent(t));

/** amount-category 不整合の行からユーザー向けエラーメッセージを生成する */
export const buildInconsistentAmountCategoryErrorMessage = (
  invalid: TransactionModel[],
): string => {
  const sample = invalid
    .slice(0, 3)
    .map((t) => {
      const rule = t.amount.value > 0 ? '「収入」を選択してください' : '「収入」以外を選択してください';
      return `「${t.content.slice(0, 10)}」(${rule})`;
    })
    .join('、');
  const more = invalid.length > 3 ? ` ほか${invalid.length - 3}件` : '';
  return `金額と大項目が一致しない取引が${invalid.length}件あります。下の取引明細から「大項目」セルをクリックして選択してください: ${sample}${more}`;
};
