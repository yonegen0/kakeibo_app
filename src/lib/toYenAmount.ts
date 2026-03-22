/**
 * @file toYenAmount.ts
 * @description 数値を円建ての `Amount` に変換するユーティリティ。
 */
import type { Amount } from '@/models/TransactionModel';

/**
 * 円建て Amount を生成する
 * @param value 金額（数値）
 * @returns Amount
 */
export const toYenAmount = (value: number): Amount => ({
  value,
  unit: '円',
});
