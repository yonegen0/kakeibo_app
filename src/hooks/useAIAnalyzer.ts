/**
 * @file useAIAnalyzer.ts
 * @description psvId を渡して AI 家計レポート（要約・本文など）を取得する。
 */
import { useCallback, useRef, useState } from 'react';
import type { AIReportModel } from '@/models/AIReportModel';
import { logClientError } from '@/lib/clientLog';

/* 
  useAIAnalyzerの戻り値
*/
export type UseAIAnalyzerReturn = {
  /* psvId から AI レポートを生成・取得する */
  analyzeByPsvId: (psvId: string, promptOverride?: string) => Promise<AIReportModel | null>;
  /* 既存のレポートIDからレポート本文を取得する */
  fetchReportById: (reportId: string) => Promise<AIReportModel | null>;
  /* POST 分析APIの応答待ち（連打時は進行中の1件のみ true） */
  isAnalyzing: boolean;
  /* GET レポート取得の応答待ち */
  isFetchingReport: boolean;
  /* 直近の失敗理由（なければ null） */
  error: string | null;
};

/**
 * AI レポートを取得するフック
 * @returns 取得処理と進捗・エラー
 */
export const useAIAnalyzer = (): UseAIAnalyzerReturn => {
  /* リクエスト進行中かどうか */
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  /* レポート取得リクエスト進行中かどうか */
  const [isFetchingReport, setIsFetchingReport] = useState(false);
  /* エラーを管理 */
  const [error, setError] = useState<string | null>(null);
  /* 分析リクエスト進行中は追加呼び出しを無視する（同期判定用） */
  const analyzeInFlightRef = useRef(false);
  /* 直近の fetchReportById 呼び出し世代（古い完了で isFetchingReport を下げない） */
  const fetchReportGenerationRef = useRef(0);

  /**
   * psvId を使って分析APIを呼び出し、AIレポートを作成する。
   * 進行中に再度呼ばれた場合は何もせず null を返す（連打無視）。
   * promptOverride を指定した場合は、サーバー側のデフォルトプロンプトより優先される。
   */
  const analyzeByPsvId = useCallback(async (psvId: string, promptOverride?: string) => {
    if (!psvId) return null;
    if (analyzeInFlightRef.current) return null;

    analyzeInFlightRef.current = true;
    setIsAnalyzing(true);
    setError(null);

    try {
      // API から分析APIを呼び出し、AI レポートを取得する
      const response = await fetch(`/api/analyze/${psvId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptOverride: promptOverride?.trim() ? promptOverride : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI report failed: ${response.statusText}`);
      }

      const data: { report: AIReportModel } = await response.json();
      return data.report;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
      logClientError('useAIAnalyzer', 'analyzeByPsvId failed', message, err);
      // 失敗時は null のみ返し、画面は呼び出し元のままにできる
      return null;
    } finally {
      analyzeInFlightRef.current = false;
      setIsAnalyzing(false);
    }
  }, []);

  /**
   * 生成済みレポートを reportId から取得する。
   * isAnalyzing は変更せず、isFetchingReport と error を更新する。
   */
  const fetchReportById = useCallback(async (reportId: string) => {
    if (!reportId) return null;

    const generation = ++fetchReportGenerationRef.current;
    setIsFetchingReport(true);
    setError(null);

    try {
      // API から生成済み AI レポートを取得する
      const response = await fetch(`/api/report/${reportId}`);
      if (!response.ok) {
        throw new Error(`Report fetch failed: ${response.statusText}`);
      }
      const data: { report: AIReportModel } = await response.json();
      return data.report;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
      logClientError('useAIAnalyzer', 'fetchReportById failed', message, err);
      return null;
    } finally {
      if (generation === fetchReportGenerationRef.current) {
        setIsFetchingReport(false);
      }
    }
  }, []);

  return {
    analyzeByPsvId,
    fetchReportById,
    isAnalyzing,
    isFetchingReport,
    error,
  };
};