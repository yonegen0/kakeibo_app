/**
 * @file TransactionTable.tsx
 * @description 取引一覧だけを出す表（自動仕訳ボタンなし）。
 */

import type { TransactionModel } from '@/models/TransactionModel';
import { TransactionGrid } from './TransactionGrid';

/* --- Types --- */
/**
 * TransactionTable の Props（AI なし）
 */
export type TransactionTableProps = {
  /** 表に並べる取引 */
  rows: TransactionModel[];
  /** 表の高さ */
  height?: number | string;
};

/**
 * AI解析ボタンなしで取引明細を表示するテーブル
 * @param props.rows 表示対象の取引データ
 * @param props.height テーブル高さ
 * @returns 取引明細表示用の要素
 */
export const TransactionTable = (props: TransactionTableProps) => {
  return (
    <TransactionGrid
      rows={props.rows}
      height={props.height}
      title="取引明細"
      subtitle="取り込み済みの取引を一覧できます"
    />
  );
};