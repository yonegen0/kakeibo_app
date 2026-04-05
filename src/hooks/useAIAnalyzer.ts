/**
 * @file useAIAnalyzer.ts
 * @description 月次の集計結果を AI レポート API に送信し、AIReportModel を取得する Hooks。
 * （`useMFUploader` がファイル入力を扱うのに対し、本フックは既に集計済みの `MonthlySummaryModel` を POST する）
 */
import { useCallback, useState } from 'react';
import type { MonthlySummaryModel } from '@/models/TransactionModel';
import type { AIReportModel } from '@/models/AIReportModel';

/** AI レポート API の実行状態と結果を定義する型 */
type UseAIAnalyzerReturn = {
  /**
   * 月次サマリーを解析し、AIレポートを取得する
   * @param summary 解析対象の月次集計
   */
  analyzeSummary: (summary: MonthlySummaryModel) => Promise<AIReportModel | null>;
  /** AI解析（API通信）が実行中かどうかを示すフラグ */
  isAnalyzing: boolean;
  /** 解析中に発生したエラーメッセージ（エラーがない場合は null） */
  error: string | null;
};

/**
 * 月次サマリーを `/api/ai-report` に送り、Markdown 含むレポートを取得します。
 * @returns `analyzeSummary` と、通信状態 `isAnalyzing` / `error`
 */
export const useAIAnalyzer = (): UseAIAnalyzerReturn => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 集計1件分をレポート生成 API に渡し、成功時は `AIReportModel` を返す
   */
  const analyzeSummary = useCallback(async (summary: MonthlySummaryModel) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // モック／将来の Bedrock 実装を吸収する API Route（`ai-report/route.ts`）
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
      // 失敗時は null（呼び出し側で既存表示を維持しやすい）
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