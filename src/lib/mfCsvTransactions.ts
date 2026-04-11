/**
 * @file mfCsvTransactions.ts
 * @description MoneyForward 家計 CSV のパース結果を検証し、一覧用の一意 ID を付与する純粋処理。
 */
import type { ZodError } from 'zod';
import { mfCsvFileSchema, type MfCsvData } from '@/schemas/mfCsvFileSchema';

/** 検証済み 1 行に、一覧用の安定キーを付けた形 */
export type MfCsvTransactionWithId = MfCsvData[number] & {
  id: string;
};

/* ビルド結果の型（成功時と失敗時） */
export type BuildMfCsvTransactionsResult =
  | { ok: true; data: MfCsvTransactionWithId[] }
  | { ok: false; error: string; zodError: ZodError };

/* ビルドオプションの型（ファイル名とバッチ識別子） */
export type BuildMfCsvTransactionsOptions = {
  /** 元ファイル名（ID の人間可読な区切りに利用） */
  fileName: string;
  /** 同一読み込みバッチをまとめるトークン（ファイル名＋同一 ms の衝突を避ける） */
  batchToken: string;
};

/**
 * PapaParse 等で得た行配列を検証し、各行に一覧用 ID を付与する。
 * @param rows ヘッダー付き CSV から得た行オブジェクトの配列（未検証）
 * @param options ファイル名とバッチ識別子
 * @returns 成功時は取引配列、失敗時はユーザー向けエラーメッセージ
 */
export const buildMfCsvTransactionsFromRows = (
  rows: unknown,
  options: BuildMfCsvTransactionsOptions,
): BuildMfCsvTransactionsResult => {
  /* 行配列を検証 */
  const validated = mfCsvFileSchema.safeParse(rows);
  /* 検証失敗時 */
  if (!validated.success) {
    return {
      ok: false,
      error: 'CSVの形式が正しくありません。カラム名などを確認してください。',
      zodError: validated.error,
    };
  }

  /* 検証成功時 */
  const { fileName, batchToken } = options;
  /* 各行に一覧用 ID を付与 */
  const data: MfCsvTransactionWithId[] = validated.data.map((row, index) => ({
    ...row,
    id: `${fileName}-${batchToken}-${index}`,
  }));

  return { ok: true, data };
};
