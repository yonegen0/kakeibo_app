/**
 * @file mfCsvTransactions.ts
 * @description MoneyForward 家計 CSV のパース結果を検証し、一覧用の一意 ID を付与する純粋処理。
 */
import type { ZodError } from 'zod';
import { mfCsvFileSchema, type MfCsvData } from '@/schemas/mfCsvFileSchema';

/** MoneyForward CSV の振替ペア行を示す金額文字列 */
const MF_TRANSFER_AMOUNT_LITERAL = '(振替)';

/** 日付を YYYY/M/D → YYYY/MM/DD にゼロパディングする */
const padMfDate = (raw: string): string => {
  const m = raw.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
  if (!m) return raw;
  return `${m[1]}/${m[2].padStart(2, '0')}/${m[3].padStart(2, '0')}`;
};

/**
 * MoneyForward 固有の書式ゆらぎを Zod 検証前に正規化する。
 * - 振替ペア行（金額が "(振替)" の行）を除外する
 * - 日付の月・日をゼロパディングして YYYY/MM/DD に揃える
 */
const normalizeMfCsvRows = (rows: unknown): unknown[] => {
  if (!Array.isArray(rows)) return [];

  return rows
    .filter((row): row is Record<string, unknown> => {
      if (typeof row !== 'object' || row === null) return false;
      const amount = (row as Record<string, unknown>)['金額（円）'];
      return String(amount).trim() !== MF_TRANSFER_AMOUNT_LITERAL;
    })
    .map((row) => {
      const date = row['日付'];
      if (typeof date !== 'string') return row;
      return { ...row, '日付': padMfDate(date) };
    });
};

/** 検証済み 1 行に、一覧用の安定キーを付けた形 */
export type MfCsvTransactionWithId = MfCsvData[number] & {
  /** 一覧用 ID */
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
  // 行配列を正規化してから検証
  const normalized = normalizeMfCsvRows(rows);
  const validated = mfCsvFileSchema.safeParse(normalized);
  if (!validated.success) {
    return {
      ok: false,
      error: 'CSVの形式が正しくありません。カラム名などを確認してください。',
      zodError: validated.error,
    };
  }

  // 検証成功時
  const { fileName, batchToken } = options;
  // 各行に一覧用 ID を付与
  const data: MfCsvTransactionWithId[] = validated.data.map((row, index) => ({
    ...row,
    id: `${fileName}-${batchToken}-${index}`,
  }));

  return { ok: true, data };
};
