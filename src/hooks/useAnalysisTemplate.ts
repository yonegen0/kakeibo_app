/**
 * @file useAnalysisTemplate.ts
 * @description 分析実行画面（Step2）の状態管理。psvId解決・サマリー生成・AI分析実行をまとめる。
 */
import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { logClientError } from '@/lib/clientLog';
import { useAIAnalyzer } from '@/hooks/useAIAnalyzer';
import { useTransactionAutoAnalyzer } from '@/hooks/useTransactionAutoAnalyzer';
import type { SummaryModel } from '@/models/TransactionModel';
import { useSelectedPsvStore } from '@/stores/useSelectedPsvStore';

/* 
  useAnalysisTemplate の戻り値
*/
export type UseAnalysisTemplateReturn = {
  /* 集計サマリー */
  summaries: SummaryModel[];
  /* サマリーの読み込み中フラグ */
  loadingSummary: boolean;
  /* ローカルエラー */
  localError: string | null;
  /* サマリー生成エラー */
  summaryError: string | null;
  /* AI分析エラー */
  analyzeError: string | null;
  /* AI分析リクエスト進行中かどうか */
  isAnalyzing: boolean;
  /* プロンプトオーバーライド */
  promptOverride: string;
  /* プロンプトの読み込み中フラグ */
  isLoadingPrompt: boolean;
  /* プロンプトオーバーライドを設定 */
  setPromptOverride: Dispatch<SetStateAction<string>>;
  /* AI分析実行アクション */
  handleAnalyze: () => Promise<void>;
  /* デフォルトプロンプト読み込みアクション */
  handleLoadDefaultPrompt: () => Promise<void>;
  /* プロンプトオーバーライドをリセット */
  handleResetPrompt: () => void;
  /* アップロード画面へ遷移 */
  goUpload: () => void;
  /* サマリーがあるかどうか */
  hasSummary: boolean;
  /* PSV IDがあるかどうか */
  hasPsvId: boolean;
};

/**
 * 分析実行画面の状態管理を担当するフック
 * @returns 分析実行画面の状態管理オブジェクト
 */
export const useAnalysisTemplate = (): UseAnalysisTemplateReturn => {
  /* クエリパラメータを取得 */
  const params = useSearchParams();
  /* ルーターを取得 */
  const router = useRouter();
  /* クエリパラメータから psvId を取得 */
  const queryPsvId = params.get('psvId') ?? '';
  /* psvId を管理 */
  const [psvId, setPsvId] = useState('');
  /* 選択された psvId を管理 */
  const selectedPsvId = useSelectedPsvStore((state) => state.selectedPsvId);
  /* 選択された psvId を設定 */
  const setSelectedPsvId = useSelectedPsvStore((state) => state.setSelectedPsvId);

  /* サマリーを管理 */
  const [summary, setSummary] = useState<SummaryModel | null>(null);
  /* サマリーの読み込み中を管理 */
  const [loadingSummary, setLoadingSummary] = useState(false);
  /* ローカルエラーを管理 */
  const [localError, setLocalError] = useState<string | null>(null);
  /* プロンプトオーバーライドを管理 */
  const [promptOverride, setPromptOverride] = useState('');
  /* プロンプトの読み込み中を管理 */
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(false);

  /* サマリーを生成する */
  const { generateSummary, error: summaryError } = useTransactionAutoAnalyzer();
  /* AI 分析を実行する */
  const { analyzeByPsvId, isAnalyzing, error: analyzeError } = useAIAnalyzer();

  /**
   * psvId を「クエリ > Zustand > 最新PSV API」の優先順で解決する。
   * どこからも解決できない場合は、画面で再アップロードを促すエラーを表示する。
   */
  useEffect(() => {
    // アクティブなフラグを管理
    let active = true;
    // psvId を解決する関数
    const resolvePsvId = async () => {
      // クエリパラメータから psvId がある場合
      if (queryPsvId) {
        // クエリパラメータから psvId が選択された psvId と異なる場合
        if (active && queryPsvId !== selectedPsvId) {
          setSelectedPsvId(queryPsvId);
        }
        // クエリパラメータから psvId を設定
        if (active) setPsvId(queryPsvId);
        return;
      }

      // 選択された psvId がある場合
      if (selectedPsvId) {
        if (active) setPsvId(selectedPsvId);
        return;
      }

      try {
        // 最新の PSV を取得する API を呼び出す
        const response = await fetch('/api/psv/latest');
        if (!response.ok) {
          if (active) setLocalError('psvId が取得できません。アップロード画面からやり直してください。');
          return;
        }
        // 最新の PSV を取得
        const data: { psvId: string } = await response.json();
        if (!data.psvId) {
          if (active) setLocalError('psvId が取得できません。アップロード画面からやり直してください。');
          return;
        }
        if (active) {
          setSelectedPsvId(data.psvId);
          setPsvId(data.psvId);
        }
      } catch (err) {
        logClientError('useAnalysisTemplate', 'resolvePsvId: psv/latest failed', err);
        if (active) setLocalError('psvId の復元に失敗しました。アップロード画面からやり直してください。');
      }
    };

    // psvId を解決する
    resolvePsvId();
    // アクティブなフラグを解除
    return () => {
      active = false;
    };
  }, [queryPsvId, selectedPsvId, setSelectedPsvId]);

  /* psvId 解決後にサマリー生成APIを呼び、表示用サマリーを更新する。 */
  useEffect(() => {
    if (!psvId) return;
    setLocalError(null);

    // サマリーを生成する
    let active = true;
    // サマリーを生成する関数
    const run = async () => {
      setLoadingSummary(true);
      // サマリーを生成する
      const result = await generateSummary(psvId);
      // サマリーを設定
      if (active) {
        setSummary(result);
        setLoadingSummary(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [generateSummary, psvId]);

  /* SummaryCard 仕様に合わせ、単体 summary を配列へ変換する。 */
  const summaries = useMemo(() => (summary ? [summary] : []), [summary]);

  /* AI分析を実行し、成功時は生成された reportId の詳細画面へ遷移する。 */
  const handleAnalyze = async () => {
    // AI分析を実行する
    const report = await analyzeByPsvId(psvId, promptOverride);
    // 分析失敗の場合
    if (!report) return;
    // 分析成功の場合、レポート詳細画面へ遷移
    router.push(`/report/${report.reportId}`);
  };

  /* サーバーが生成するデフォルトプロンプトを取得し、入力欄へ反映する。 */
  const handleLoadDefaultPrompt = async () => {
    if (!psvId) return;
    // プロンプトの読み込み中を設定
    setIsLoadingPrompt(true);
    // デフォルトプロンプトを取得する
    try {
      // デフォルトプロンプトを取得する API を呼び出す
      const response = await fetch(`/api/analyze/${psvId}`);
      if (!response.ok) {
        throw new Error('デフォルトプロンプトの取得に失敗しました。');
      }
      // デフォルトプロンプトを取得
      const data: { prompt: string } = await response.json();
      // プロンプトを設定
      setPromptOverride(data.prompt ?? '');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'デフォルトプロンプトの取得に失敗しました。';
      logClientError('useAnalysisTemplate', 'handleLoadDefaultPrompt failed', message, error);
      setLocalError(message);
    } finally {
      setIsLoadingPrompt(false);
    }
  };

  return {
    summaries,
    loadingSummary,
    localError,
    summaryError,
    analyzeError,
    isAnalyzing,
    promptOverride,
    isLoadingPrompt,
    setPromptOverride,
    handleAnalyze,
    handleLoadDefaultPrompt,
    handleResetPrompt: () => setPromptOverride(''),
    goUpload: () => router.push('/upload'),
    hasSummary: Boolean(summary),
    hasPsvId: Boolean(psvId),
  };
};
