/**
 * @file mfCsvFileSchema.ts
 * @description マネーフォワードからエクスポートされたCSVデータの構造検証スキーマ。
 * Zodを使用してランタイムでの型安全性を保証し、不正な形式のデータが
 * システム内部へ混入することを入り口で防止します。
 */
import { z } from 'zod';

/**
 * マネーフォワードCSV 1行分の検証・変換スキーマ 
 * 日本語のヘッダーを適切な英語プロパティにマッピングします。
 */
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
  'メモ': z.string().optional().transform(v => v ?? ""),
  '振替': z.string().optional(),
  'ID': z.string().optional(),
}).transform((data) => ({
  /* 計算対象フラグ */
  isCalculated: data['計算対象'] === '1',
  /* 日付 */
  date: data['日付'],
  /* 内容 */
  content: data['内容'],
  /* 金額 */
  amount: data['金額（円）'],
  /* 保有金融機関 */
  source: data['保有金融機関'],
  /* 大項目 */
  category: data['大項目'],
  /* 中項目 */
  subCategory: data['中項目'],
  /* メモ */
  memo: data['メモ'],
  /* 振替フラグ */
  isTransfer: data['振替'] === '1',
  /* ID */
  mfId: data['ID'],
}));

/** CSV全体の検証スキーマ（行の配列） */
export const mfCsvFileSchema = z.array(mfRowSchema);

/** 推論された型定義 */
export type MfRow = z.infer<typeof mfRowSchema>;
export type MfCsvData = z.infer<typeof mfCsvFileSchema>;