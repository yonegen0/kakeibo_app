/**
 * @file useTransactionImportTemplate.ts
 * @description アップロード画面（Step1）の状態管理。CSV取込結果を取引モデルへ変換し、PSV保存まで扱う。
 */
import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Amount, SummaryModel, TransactionModel } from '@/models/TransactionModel';
import type { Transaction as MFUploadedTransaction } from '@/hooks/useMFUploader';
import { useMFUploader } from '@/hooks/useMFUploader';
import { useTransactionAutoAnalyzer } from '@/hooks/useTransactionAutoAnalyzer';
import { useTransactionSummary } from '@/hooks/useTransactionSummary';
import { useSelectedPsvStore } from '@/stores/useSelectedPsvStore';

/* 
  useTransactionImportTemplate の戻り値
*/
export type UseTransactionImportTemplateReturn = {
  /* 取引一覧（MF CSV 取込結果から派生） */
  transactions: TransactionModel[];
  /* 月次集計サマリー */
  summaries: SummaryModel[];
  /* CSV パース・検証中 */
  isParsing: boolean;
  /* PSV 保存など API 進行中 */
  isAnalyzing: boolean;
  /* 取込エラー（MF CSV 側） */
  error: string | null;
  /* PSV 保存 API のエラー */
  saveError: string | null;
  /* PSV 保存して分析画面へ遷移 */
  handleSavePsv: () => Promise<void>;
};

/* MF CSV の1行を、画面内で統一利用する TransactionModel へ変換する。 */
/* 取込時点では固定費判定がないため isFixedCost は false を初期値にする。 */
const toTransactionModel = (row: MFUploadedTransaction): TransactionModel => {
  // 金額を管理
  const amount: Amount = {
    value: row.amount,
    unit: '円',
  };
  return {
    id: row.id,
    date: row.date,
    content: row.content,
    amount,
    category: row.category,
    subCategory: row.subCategory,
    isFixedCost: false,
    memo: row.memo,
    source: 'moneyforward',
    isCalculated: row.isCalculated,
    isTransfer: row.isTransfer,
  };
};

/**
 * アップロード画面（Step1）の状態管理。CSV取込結果を取引モデルへ変換し、PSV保存まで扱う。
 * ナビゲーションと Zustand 連携はこの画面用フックに含める。
 * @returns アップロード画面の状態管理オブジェクト
 */
export const useTransactionImportTemplate = (): UseTransactionImportTemplateReturn => {
  /* ルーターを取得 */
  const router = useRouter();
  /* 選択された PSV ID を管理 */
  const setSelectedPsvId = useSelectedPsvStore((state) => state.setSelectedPsvId);
  /* MF 取込データを管理 */
  const { data, error, isParsing } = useMFUploader();

  /** MF 取込 `data` から表示・保存用の取引一覧を派生する */
  const transactions = useMemo(
    // MF 取込データから表示・保存用の取引一覧を派生する
    () => (data ? data.map(toTransactionModel) : []),
    [data],
  );

  /* 月次集計サマリーを管理 */
  const summaries = useTransactionSummary(transactions);
  /* PSV 保存・分析 API を扱う */
  const { saveTransactionsAsPsv, isAnalyzing, error: saveError } = useTransactionAutoAnalyzer();
  /* 現在の取引一覧を PSV として保存し、分析画面へ遷移する。 */
  const handleSavePsv = useCallback(async () => {
    // 現在の取引一覧を PSV として保存
    const saved = await saveTransactionsAsPsv(transactions, 'mf_uploaded.csv');
    if (!saved) return;
    // 選択された PSV ID を設定
    setSelectedPsvId(saved.psvId);
    // 分析画面へ遷移
    router.push(`/analysis?psvId=${saved.psvId}`);
  }, [transactions, saveTransactionsAsPsv, setSelectedPsvId, router]);

  return {
    transactions,
    summaries,
    isParsing,
    isAnalyzing,
    error,
    saveError,
    handleSavePsv,
  };
};
