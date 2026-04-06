/**
 * @file useAIAnalyzer.ts
 * @description 月次サマリーを渡して AI 家計レポート（要約・本文など）を取得する。
 */
import { useCallback, useState } from 'react';
import type { MonthlySummaryModel } from '@/models/TransactionModel';
import type { AIReportModel } from '@/models/AIReportModel';

/** レポート取得の進行状況と結果 */
type UseAIAnalyzerReturn = {
  /**
   * 指定月のサマリーからレポートを取得する
   * @param summary 対象月の収支サマリー
   */
  analyzeSummary: (summary: MonthlySummaryModel) => Promise<AIReportModel | null>;
  /** サーバー応答待ちかどうか */
  isAnalyzing: boolean;
  /** 直近の失敗理由（なければ null） */
  error: string | null;
};

/**
 * 月次サマリーから AI レポートを取りに行く
 * @returns 取得処理と進捗・エラー
 */
export const useAIAnalyzer = (): UseAIAnalyzerReturn => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeSummary = useCallback(async (summary: MonthlySummaryModel) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // レポート生成用のバックエンドへ送る
      const response = await fetch('/api/ai-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary }),
      });

      if (!response.ok) {
        throw new Error(`AI report failed: ${response.statusText}`);
      }

      const data: { report: AIReportModel } = await response.json();
      return data.report;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
      console.error('AI Report Error:', message);
      // 失敗時は null のみ返し、画面は呼び出し元のままにできる
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    analyzeSummary,
    isAnalyzing,
    error,
  };
};