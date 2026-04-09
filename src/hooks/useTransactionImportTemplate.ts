/**
 * @file useTransactionImportTemplate.ts
 * @description アップロード画面（Step1）の状態管理。CSV取込結果を取引モデルへ変換し、PSV保存まで扱う。
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Amount, TransactionModel } from '@/models/TransactionModel';
import type { Transaction as MFUploadedTransaction } from '@/hooks/useMFUploader';
import { useMFUploader } from '@/hooks/useMFUploader';
import { useTransactionSummary } from '@/hooks/useTransactionSummary';
import { useTransactionAutoAnalyzer } from '@/hooks/useTransactionAutoAnalyzer';
import { useSelectedPsvStore } from '@/stores/useSelectedPsvStore';

/**
 * MF CSVの1行を、画面内で統一利用する TransactionModel へ変換する。
 * 取込時点では固定費判定がないため isFixedCost は false を初期値にする。
 */
const toTransactionModel = (row: MFUploadedTransaction): TransactionModel => {
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

export const useTransactionImportTemplate = () => {
  const router = useRouter();
  const setSelectedPsvId = useSelectedPsvStore((state) => state.setSelectedPsvId);
  const { data, error, isParsing } = useMFUploader();
  const [transactions, setTransactions] = useState<TransactionModel[]>([]);
  const summaries = useTransactionSummary(transactions);
  const { saveTransactionsAsPsv, isAnalyzing, error: saveError } = useTransactionAutoAnalyzer();

  /** CSV取込結果が更新されたら、表示・保存用の取引モデルに正規化する。 */
  useEffect(() => {
    if (!data) {
      setTransactions([]);
      return;
    }
    setTransactions(data.map(toTransactionModel));
  }, [data]);

  /**
   * 現在の取引一覧を PSV として保存し、分析画面へ遷移する。
   * 保存成功時には Zustand に psvId を保持して後続画面で再利用する。
   */
  const handleSavePsv = async () => {
    const saved = await saveTransactionsAsPsv(transactions, 'mf_uploaded.csv');
    if (!saved) return;
    setSelectedPsvId(saved.psvId);
    router.push(`/analysis?psvId=${saved.psvId}`);
  };

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
