/**
 * @file useReportTemplate.ts
 * @description レポート表示画面（Step3）の状態管理。reportId解決とレポート再取得を担当する。
 */
import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import type { AIReportModel } from '@/models/AIReportModel';
import { useAIAnalyzer } from '@/hooks/useAIAnalyzer';

/* 
  useReportTemplate の戻り値
*/
export type UseReportTemplateReturn = {
  /* レポートID */
  reportId: string;
  /* レポート本文 */
  report: AIReportModel | null;
  /* レポート取得中 */
  isLoading: boolean;
  /* エラー */
  error: string | null;
  /* 分析画面へ遷移 */
  goAnalysis: () => void;
  /* アップロード画面へ遷移 */
  goUpload: () => void;
};

/**
 * Step3 レポート画面の reportId 解決・取得・ナビゲーションをまとめる。
 * @returns reportId / レポート本文 / ローディング・エラー・画面遷移用ハンドラ
 */
export const useReportTemplate = (): UseReportTemplateReturn => {
  /* パスパラメータを取得 */
  const pathParams = useParams<{ reportId?: string }>();
  /* クエリパラメータを取得 */
  const params = useSearchParams();
  /* ルーターを取得 */
  const router = useRouter();
  /* レポートIDを管理 */
  const reportId = pathParams?.reportId ?? params.get('reportId') ?? '';
  /* レポートを管理 */
  const [report, setReport] = useState<AIReportModel | null>(null);
  /* AI分析を実行する */
  const { fetchReportById, error, isFetchingReport } = useAIAnalyzer();

  /**
   * reportId が確定したら API からレポートを取得する。
   * reportId 未指定時は fetch せず、画面側で案内文を表示する。
   */
  useEffect(() => {
    // アクティブなフラグを管理
    let active = true;
    // レポートを取得する関数
    const run = async () => {
      if (!reportId) {
        if (active) setReport(null);
        return;
      }

      // API からレポートを取得する
      const result = await fetchReportById(reportId);
      // レポートを設定
      if (active) {
        setReport(result);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [fetchReportById, reportId]);

  /** レポート取得中、または未取得のままエラー前（reportId あり時のみロード扱い） */
  const isLoading = Boolean(reportId) && (isFetchingReport || (report === null && !error));

  return {
    reportId,
    report,
    isLoading,
    error,
    goAnalysis: () => router.push('/analysis'),
    goUpload: () => router.push('/upload'),
  };
};
