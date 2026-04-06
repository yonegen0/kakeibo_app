/**
 * @file useTransactionAutoAnalyzer.ts
 * @description 取引一覧を AI に渡し、返ってきたカテゴリ・メモなどを各行に反映した一覧を返す。
 */
import { useState, useCallback } from 'react';
import type { TransactionModel } from '@/models/TransactionModel';

/** サーバーが返す 1 件分の仕訳提案 */
type AnalysisResult = {
  /** 取引を特定するための一意なID */
  id: string;
  /** AIが推論した大項目（例：食費、エンジニアリング） */
  category: string;
  /** AIが推論した中項目（例：ランチ、AWS） */
  subCategory: string;
  /** なぜそのカテゴリを選択したかの推論理由（UIでの補足説明用） */
  reason: string;
  /** 定期的な支出（固定費）であるかどうかの推論結果 */
  isFixedCost: boolean;
};

/** 自動仕訳リクエストの進行状況と結果 */
type UseTransactionAutoAnalyzerReturn = {
  /**
   * 一覧をまとめて AI にかけ、反映後の一覧を返す
   * @param transactions 元になる取引一覧
   */
  analyzeTransactions: (transactions: TransactionModel[]) => Promise<TransactionModel[]>;
  /** サーバー応答待ちかどうか */
  isAnalyzing: boolean;
  /** 直近の失敗理由（なければ null） */
  error: string | null;
};

/**
 * 取引一覧の AI 自動仕訳
 * @returns 一括実行と進捗・エラー
 */
export const useTransactionAutoAnalyzer = (): UseTransactionAutoAnalyzerReturn => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeTransactions = useCallback(async (transactions: TransactionModel[]) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // 自動仕訳用のバックエンドへ送る
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data: { analysis: AnalysisResult[] } = await response.json();

      // 同じ取引どうしを突き合わせ、提案内容をマージ（配列は毎回新しく作る）
      const updatedTransactions = transactions.map((t) => {
        const result = data.analysis.find((res) => res.id === t.id);
        if (!result) return t;

        return {
          ...t,
          category: result.category,
          subCategory: result.subCategory,
          isFixedCost: result.isFixedCost,
          memo: result.reason,
          amount: { ...t.amount },
        };
      });

      return updatedTransactions;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
      console.error('AI Analysis Error:', message);
      // 失敗時は入力の一覧をそのまま返し、画面を止めない
      return transactions;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    analyzeTransactions,
    isAnalyzing,
    error,
  };
};
