/**
 * @file useTransactionImportTemplate.ts
 * @description アップロード画面（Step1）の状態管理。CSV取込結果を取引モデルへ変換し、PSV保存まで扱う。
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Amount, Category, SummaryModel, TransactionModel } from '@/models/TransactionModel';
import type { Transaction as MFUploadedTransaction } from '@/hooks/useMFUploader';
import { useMFUploader } from '@/hooks/useMFUploader';
import { useTransactionAutoAnalyzer } from '@/hooks/useTransactionAutoAnalyzer';
import { useTransactionSummary } from '@/hooks/useTransactionSummary';
import { useSelectedPsvStore } from '@/stores/useSelectedPsvStore';
import {
  findOverLimitContentTransactions,
  buildContentLimitErrorMessage,
} from '@/lib/contentValidation';
import {
  findInvalidCategoryTransactions,
  buildInvalidCategoryErrorMessage,
  findInconsistentAmountCategoryTransactions,
  buildInconsistentAmountCategoryErrorMessage,
} from '@/lib/categoryValidation';

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
  /* 入力検証エラー（大項目文字数超過など） */
  validationError: string | null;
  /* PSV 保存して分析画面へ遷移 */
  handleSavePsv: () => Promise<void>;
  /* ファイル選択ハンドラ（CsvUploadMonitor へ渡す） */
  handleFileSelect: (file: File) => void;
  /* パース済み行数（0 = 未読込） */
  dataLength: number;
  /* 指定 id の固定費フラグをトグルする */
  handleToggleFixedCost: (id: string) => void;
  /* DataGrid のインライン編集を transactions に反映する */
  handleUpdateRow: (newRow: TransactionModel) => TransactionModel;
};

/* MF CSV の1行を、画面内で統一利用する TransactionModel へ変換する。 */
/* fixedCostContents に含まれる content を持つ行は isFixedCost を true に初期化する。 */
const toTransactionModel = (row: MFUploadedTransaction, fixedCostContents: Set<string>): TransactionModel => {
  const amount: Amount = {
    value: row.amount,
    unit: '円',
  };
  return {
    id: row.id,
    date: row.date,
    content: row.content,
    amount,
    category: row.category as Category,
    subCategory: row.subCategory,
    isFixedCost: fixedCostContents.has(row.content),
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
  const selectedPsvId = useSelectedPsvStore((state) => state.selectedPsvId);
  const setSelectedPsvId = useSelectedPsvStore((state) => state.setSelectedPsvId);
  /* MF 取込データを管理 */
  const { data, error, isParsing, handleFileSelect, fileName } = useMFUploader();

  /* 前回PSVの固定費 content 名セット（非同期ロード。完了前のアップロードは全 false） */
  const prevFixedCostContentsRef = useRef<Set<string>>(new Set());

  /* 取引一覧。data 更新時に初期化し、個別の isFixedCost トグルも受け付ける */
  const [transactions, setTransactions] = useState<TransactionModel[]>([]);
  /* 入力検証エラー（大項目文字数超過など） */
  const [validationError, setValidationError] = useState<string | null>(null);

  /* 月次集計サマリーを管理 */
  const summaries = useTransactionSummary(transactions);
  /* PSV 保存・分析 API を扱う */
  const { saveTransactionsAsPsv, loadPsvFixedCosts, isAnalyzing, error: saveError } = useTransactionAutoAnalyzer();

  /* 前回PSVが存在する場合、固定費 content 名をバックグラウンドでロードする */
  useEffect(() => {
    if (!selectedPsvId) {
      prevFixedCostContentsRef.current = new Set();
      return;
    }
    loadPsvFixedCosts(selectedPsvId).then((contents) => {
      prevFixedCostContentsRef.current = contents;
    });
  }, [selectedPsvId, loadPsvFixedCosts]);

  useEffect(() => {
    setTransactions(data ? data.map((row) => toTransactionModel(row, prevFixedCostContentsRef.current)) : []);
    setValidationError(null);
  }, [data]);

  /** 指定 id の固定費フラグを反転する */
  const handleToggleFixedCost = useCallback((id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isFixedCost: !t.isFixedCost } : t)),
    );
  }, []);

  /** DataGrid のインライン編集を transactions に反映する */
  const handleUpdateRow = useCallback((newRow: TransactionModel): TransactionModel => {
    setTransactions((prev) => prev.map((t) => (t.id === newRow.id ? newRow : t)));
    setValidationError(null);
    return newRow;
  }, []);
  /* 現在の取引一覧を PSV として保存し、分析画面へ遷移する。 */
  const handleSavePsv = useCallback(async () => {
    // 内容の文字数制限を検証
    const overLimit = findOverLimitContentTransactions(transactions);
    if (overLimit.length > 0) {
      setValidationError(buildContentLimitErrorMessage(overLimit));
      return;
    }
    // 大項目の選択肢を検証
    const invalidCategory = findInvalidCategoryTransactions(transactions);
    if (invalidCategory.length > 0) {
      setValidationError(buildInvalidCategoryErrorMessage(invalidCategory));
      return;
    }
    // 金額-カテゴリ整合性を検証
    const inconsistent = findInconsistentAmountCategoryTransactions(transactions);
    if (inconsistent.length > 0) {
      setValidationError(buildInconsistentAmountCategoryErrorMessage(inconsistent));
      return;
    }
    setValidationError(null);
    // 現在の取引一覧を PSV として保存
    const saved = await saveTransactionsAsPsv(transactions, fileName?.trim() || undefined);
    if (!saved) return;
    // 選択された PSV ID を設定
    setSelectedPsvId(saved.psvId);
    // 分析画面へ遷移
    router.push(`/analysis?psvId=${saved.psvId}`);
  }, [transactions, fileName, saveTransactionsAsPsv, setSelectedPsvId, router]);

  return {
    transactions,
    summaries,
    isParsing,
    isAnalyzing,
    error,
    saveError,
    validationError,
    handleSavePsv,
    handleFileSelect,
    dataLength: data?.length ?? 0,
    handleToggleFixedCost,
    handleUpdateRow,
  };
};
