/**
 * @file TransactionPreviewTable.tsx
 * @description 自動仕訳ボタン付きの取引プレビュー表。
 */

import type { TransactionModel } from '@/models/TransactionModel';
import { useTransactionAutoAnalyzer } from '@/hooks/useTransactionAutoAnalyzer';
import { TransactionAutoAnalyzeToolbar } from '@/components/molecules/TransactionAutoAnalyzeToolbar';
import { TransactionGrid } from '@/components/organisms/TransactionGrid';

/* --- Types --- */
/**
 * TransactionPreviewTable の Props
 */
type TransactionPreviewTableProps = {
  /** 表に出す取引 */
  rows: TransactionModel[];
  /** 仕訳後の一覧を親に返す */
  onDataUpdate: (newRows: TransactionModel[]) => void;
  /** 表の高さ */
  height?: number | string;
};

/**
 * 検証済みデータを一覧表示し、AI解析による補完機能を提供するテーブルコンポーネント。
 * @param props.rows 表示対象の取引データ
 * @param props.onDataUpdate AI解析結果で更新された取引データの反映先
 * @param props.height テーブル高さ（任意）
 * @returns 取引プレビュー表示用の要素
 */
/* --- Component --- */
export const TransactionPreviewTable = (props: TransactionPreviewTableProps) => {
  const { analyzeTransactions, isAnalyzing } = useTransactionAutoAnalyzer();

  /** ボタンから一括仕訳を走らせる */
  const handleAIAnalyze = async () => {
    const updatedData = await analyzeTransactions(props.rows);
    props.onDataUpdate(updatedData);
  };

  return (
    <TransactionGrid
      rows={props.rows}
      height={props.height}
      loading={isAnalyzing}
      title="取り込みデータプレビュー"
      subtitle="AI で大項目・中項目を自動補完できます"
      toolbarNode={
        <TransactionAutoAnalyzeToolbar
          onAnalyze={handleAIAnalyze}
          isAnalyzing={isAnalyzing}
          hasData={props.rows.length > 0}
        />
      }
    />
  );
};
