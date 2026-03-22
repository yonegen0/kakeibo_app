/**
 * @file useTransactionAutoAnalyzer.ts
 * @description 取引明細を AI 解析 API に送信し、結果を取引データへ統合するためのカスタム Hooks。
 *//**
 * @file useTransactionAutoAnalyzer.ts
 * @description 取引明細を AI 解析 API に送信し、結果を管理するためのカスタム Hooks
 */import { useState, useCallback } from 'react';
import type { TransactionModel } from '@/models/TransactionModel';

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

type UseTransactionAutoAnalyzerReturn = {
  /**
   * 複数の取引明細を一括で解析し、結果をマージした新しい配列を返す非同期関数
   * @param transactions 解析対象の取引明細リスト
   */
  analyzeTransactions: (transactions: TransactionModel[]) => Promise<TransactionModel[]>;
  /** AI解析（API通信）が実行中かどうかを示すフラグ */
  isAnalyzing: boolean;
  /** 解析中に発生したエラーメッセージ（エラーがない場合は null） */
  error: string | null;
};

/**
 * 取引明細を AI 解析 API に送信し、取引データへ統合する Hooks
 * @returns 解析実行関数 `analyzeTransactions` と状態フラグ `isAnalyzing` / `error`
 */
export const useTransactionAutoAnalyzer = (): UseTransactionAutoAnalyzerReturn => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 取引明細を AI 解析にかけ、結果をマージした新しい配列を返す
   * @param transactions 解析対象の取引明細リスト
   * @returns 解析結果が反映された取引明細リスト
   */
  const analyzeTransactions = useCallback(async (transactions: TransactionModel[]) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // API Route (/api/analyze) へ解析リクエストを送信
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data: { analysis: AnalysisResult[] } = await response.json();

      /**
       * 元のデータと AI の解析結果を ID をキーにしてマージ
       * 不変性を保つため、常に新しいオブジェクト配列を生成
       */
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
      return transactions; // 失敗時はフォールバックとして元のデータを返却
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

