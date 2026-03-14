/**
 * @file mfCsvFileSchema.ts
 * @description マネーフォワードからエクスポートされたCSVデータの構造検証スキーマ。
 * Zodを使用してランタイムでの型安全性を保証し、不正な形式のデータが
 * システム内部へ混入することを入り口で防止します。
 */
import { z } from 'zod';

/** マネーフォワードCSV 1行分の検証スキーマ */
export const mfRowSchema = z.object({
  '計算対象': z.string(),
  '日付': z.string().regex(/^\d{4}\/\d{2}\/\d{2}$/, "日付形式が正しくありません (YYYY/MM/DD)"),
  '内容': z.string().min(1, "内容は必須です"),
  '金額（円）': z.preprocess(
    (v) => Number(String(v).replace(/,/g, '')), 
    z.number()
  ),
  '保有金融機関': z.string(),
  '大項目': z.string(),
  '中項目': z.string(),
  'メモ': z.string().optional(),
  '振替': z.string().optional(),
  'ID': z.string().optional(),
});

/** CSVファイル全体の検証用スキーマ */
export const mfCsvFileSchema = z.array(mfRowSchema);

/** 推論された型定義 */
export type MfRow = z.infer<typeof mfRowSchema>;
export type MfCsvData = z.infer<typeof mfCsvFileSchema>;