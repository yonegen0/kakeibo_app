/**
 * @file contentValidation.ts
 * @description 取引の内容（content）に対する文字数制限と検証ヘルパ。
 */
import type { TransactionModel } from '@/models/TransactionModel';

/** 内容の最大文字数（PSV保存前検証で使用） */
export const CONTENT_MAX_LENGTH = 20;

/** content が制限超過の取引一覧を返す */
export const findOverLimitContentTransactions = (
  transactions: TransactionModel[],
): TransactionModel[] =>
  transactions.filter((t) => t.content.length > CONTENT_MAX_LENGTH);

/** 超過行からユーザー向けエラーメッセージを生成する */
export const buildContentLimitErrorMessage = (
  overLimit: TransactionModel[],
): string => {
  const sample = overLimit
    .slice(0, 3)
    .map((t) => `「${t.content.slice(0, 10)}…」(${t.content.length}文字)`)
    .join('、');
  const more = overLimit.length > 3 ? ` ほか${overLimit.length - 3}件` : '';
  return `内容が${CONTENT_MAX_LENGTH}文字を超える取引が${overLimit.length}件あります。下の取引明細から「内容」セルをクリックして編集してください: ${sample}${more}`;
};
