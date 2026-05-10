/**
 * @file useTransactionAutoAnalyzer.ts
 * @description 取引一覧を PSV として保存し、psvId 起点の分析フローを扱う。
 */
import { useState, useCallback } from 'react';
import { apiFetch, ApiError, getCurrentUserId } from '@/lib/apiClient';
import { logClientError } from '@/lib/clientLog';
import type { PsvMetaModel, SummaryModel, TransactionModel } from '@/models/TransactionModel';

/* 保存結果の型 */
type SaveResult = {
  /* PSV ID */
  psvId: string;
  /* メタデータ */
  meta: PsvMetaModel;
};

/*
  useTransactionAutoAnalyzer の戻り値
*/
export type UseTransactionAutoAnalyzerReturn = {
  /* 取引一覧を PSV として保存し、psvId を返す */
  saveTransactionsAsPsv: (transactions: TransactionModel[], fileName?: string) => Promise<SaveResult | null>;
  /* 保存済みPSVからサマリーを生成（または再生成）する */
  generateSummary: (psvId: string) => Promise<SummaryModel | null>;
  /* psvId に紐づくメタ情報と取引一覧を復元する */
  loadPsv: (psvId: string) => Promise<{ meta: PsvMetaModel; transactions: TransactionModel[] } | null>;
  /* 前回PSVから固定費 content 名の Set を返す（isAnalyzing を変更しない） */
  loadPsvFixedCosts: (psvId: string) => Promise<Set<string>>;
  /* サーバー応答待ちかどうか */
  isAnalyzing: boolean;
  /* 直近の失敗理由（なければ null） */
  error: string | null;
};

/**
 * PSV の保存・取得とサマリー生成 API を扱う。画面のルーティングは担当しない。
 * @returns API 呼び出し・進捗（isAnalyzing）・エラー
 */
export const useTransactionAutoAnalyzer = (): UseTransactionAutoAnalyzerReturn => {
  /* リクエスト進行中かどうか */
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  /* エラーを管理 */
  const [error, setError] = useState<string | null>(null);

  /** 取引一覧を PSV として保存し、次画面連携に使う psvId を受け取る。 */
  const saveTransactionsAsPsv = useCallback(async (transactions: TransactionModel[], fileName?: string) => {
    if (transactions.length === 0) return null;
    setIsAnalyzing(true);
    setError(null);

    try {
      const data = await apiFetch<SaveResult>('/psv', {
        method: 'POST',
        body: JSON.stringify({
          userId: getCurrentUserId(),
          transactions,
          fileName: fileName ?? 'uploaded.csv',
        }),
      });
      return data;
    } catch (err) {
      const message = err instanceof ApiError ? `PSV save failed: ${err.status}` : 'Unknown error occurred';
      setError(message);
      logClientError('useTransactionAutoAnalyzer', 'saveTransactionsAsPsv failed', message, err);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  /* psvId をもとにサマリーAPIを呼び出し、分析前の集計情報を取得する。 */
  const generateSummary = useCallback(async (psvId: string) => {
    if (!psvId) return null;
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await apiFetch<{ summary: SummaryModel }>(`/summary/${psvId}`, { method: 'POST' });
      return data.summary;
    } catch (err) {
      const message = err instanceof ApiError ? `Summary generation failed: ${err.status}` : 'Unknown error occurred';
      setError(message);
      logClientError('useTransactionAutoAnalyzer', 'generateSummary failed', message, err);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  /* 編集や再分析のために、保存済みPSVデータを取得する。 */
  const loadPsv = useCallback(async (psvId: string) => {
    if (!psvId) return null;
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await apiFetch<{ meta: PsvMetaModel; transactions: TransactionModel[] }>(`/psv/${psvId}`);
      return data;
    } catch (err) {
      const message = err instanceof ApiError ? `PSV load failed: ${err.status}` : 'Unknown error occurred';
      setError(message);
      logClientError('useTransactionAutoAnalyzer', 'loadPsv failed', message, err);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  /* 前回PSVから固定費の content 名のみを Set として取得する（isAnalyzing は変更しない）。 */
  const loadPsvFixedCosts = useCallback(async (psvId: string): Promise<Set<string>> => {
    if (!psvId) return new Set();
    try {
      const data = await apiFetch<{ meta: PsvMetaModel; transactions: TransactionModel[] }>(`/psv/${psvId}`);
      return new Set(data.transactions.filter((t) => t.isFixedCost).map((t) => t.content));
    } catch (err) {
      logClientError('useTransactionAutoAnalyzer', 'loadPsvFixedCosts failed', err);
      return new Set();
    }
  }, []);

  return {
    saveTransactionsAsPsv,
    generateSummary,
    loadPsv,
    loadPsvFixedCosts,
    isAnalyzing,
    error,
  };
};
