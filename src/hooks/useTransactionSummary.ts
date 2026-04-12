/**
 * @file useTransactionSummary.ts
 * @description 取引一覧から月ごとの収支サマリー（合計とカテゴリ内訳）を求める。入力が変わるまで結果を使い回す。
 */
import { useMemo } from 'react';
import type { SummaryModel, TransactionModel } from '@/models/TransactionModel';
import { buildSummary } from '@/lib/summary';

/** カテゴリ内訳の 1 行（名前・金額・割合・収入か支出か） */
export type CategorySummary = SummaryModel['categories'][number];

/* 
  useTransactionSummary の戻り値
*/
export type UseTransactionSummaryReturn = SummaryModel[];

/**
 * 取引一覧から月次サマリーを計算する（副作用なし）。
 * @param transactions 集計対象の取引
 * @returns 月ごとのサマリー（新しい月が先頭）
 */
export const calculateTransactionSummary = (
  transactions: TransactionModel[],
): SummaryModel[] => {
  // 月次集計サマリーを計算
  const summary = buildSummary(transactions);
  // 月次集計サマリーを返却
  return summary ? [summary] : [];
};

/**
 * 取引一覧が変わったときだけ再計算するラッパー。
 * @param transactions 集計対象の取引
 * @returns 月次サマリーの配列（新しい月が先頭）
 */
export const useTransactionSummary = (
  transactions: TransactionModel[],
): UseTransactionSummaryReturn => {
  // 月次集計サマリーを計算
  const summary = useMemo(() => calculateTransactionSummary(transactions), [transactions]);
  // 月次集計サマリーを返却
  return summary;
};
