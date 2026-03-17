/**
 * @file useAIAnalyzer.ts
 * @description 取引明細を AI 解析 API に送信し、結果を管理するためのカスタム Hooks
 */
import { useState, useCallback } from 'react';
import { TransactionModel } from '@/models/TransactionModel';

/**
 * API から返却される解析結果の型定義
 * Bedrock からの推論結果をフロントエンドのモデルへマッピングするために使用
 */
type AnalysisResult = {
  /** 取引を特定するための一意なID */
  id: string;
  /** AIが推論した大項目（例：食費、エンジニアリング） */
  category: string;
  /** AIが推論した中項目（例：ランチ、AWS） */
  subCategory: string;
  /** 定期的な支出（固定費）であるかどうかの推論結果 */
  isFixedCost: boolean;
  /** なぜそのカテゴリを選択したかの推論理由（UIでの補足説明用） */
  reason: string;
};

/**
 * useAIAnalyzer の戻り値の型定義
 * コンポーネント側で利用する状態と関数を定義
 */
type UseAIAnalyzerReturn = {
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
 * AI 解析を実行し、取引データに解析結果を統合する Hooks
 * @returns {UseAIAnalyzerReturn} 解析関数とステータス
 */
export const useAIAnalyzer = (): UseAIAnalyzerReturn => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 取引明細を AI 解析にかけ、結果をマージした新しい配列を返す
   * @param transactions 解析対象の取引明細リスト
   * @returns 解析結果が反映された取引明細リスト
   */
  const analyzeTransactions = useCallback(async (
    transactions: TransactionModel[]
  ): Promise<TransactionModel[]> => {
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