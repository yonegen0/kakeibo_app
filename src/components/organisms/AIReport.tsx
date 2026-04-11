/**
 * @file AIReport.tsx
 * @description AI が出した家計レポート（要約・本文つき）を状態に応じてカードで表示する。
 */
import type { AIReportModel } from '@/models/AIReportModel';
import { EmptyState } from '@/components/atoms/EmptyState';
import { AIReportCardShell } from '@/components/molecules/AIReportCardShell';
import { AIReportErrorBody } from '@/components/molecules/AIReportErrorBody';
import { AIReportHeader } from '@/components/molecules/AIReportHeader';
import { AIReportLoadingBody } from '@/components/molecules/AIReportLoadingBody';
import { AIReportSuccessBody } from '@/components/molecules/AIReportSuccessBody';

/* --- Types --- */
/* 
 * AIReport の Props
 */
type AIReportProps = {
  /** レポート内容（まだ無いときは null） */
  report: AIReportModel | null;
  /** 取得中かどうか */
  isLoading: boolean;
  /** 失敗時のメッセージ（なければ null） */
  error: string | null;
};

/* --- Styled Components --- */
/** 家計レポートカード共通ヘッダーに表示する文言 */
const aiReportHeaderCopy = {
  eyebrowText: 'AI Insights',
  headingText: '家計レポート',
  sideCaption: '集計結果をもとにした分析レポート',
} as const;

/** 生成中本文の案内文 */
const aiReportLoadingCopy = {
  message: 'AI がデータを分析しています...',
} as const;

/**
 * AI 家計レポートを状態（Loading / Error / Empty / Success）に応じて表示する。
 * @param props.report 表示対象のレポート
 * @param props.isLoading 生成中フラグ
 * @param props.error エラーメッセージ
 * @returns レポート表示用カード
 */
export const AIReport = (props: AIReportProps) => {
  const header = <AIReportHeader {...aiReportHeaderCopy} />;

  if (props.isLoading) {
    return (
      <AIReportCardShell>
        {header}
        <AIReportLoadingBody message={aiReportLoadingCopy.message} />
      </AIReportCardShell>
    );
  }

  if (props.error) {
    return (
      <AIReportCardShell>
        {header}
        <AIReportErrorBody errorDetail={props.error} />
      </AIReportCardShell>
    );
  }

  if (!props.report) {
    return (
      <AIReportCardShell>
        {header}
        <EmptyState
          title="AI レポートがまだ生成されていません"
          description="集計を確認後、「AIレポートを生成」ボタンから作成できます。"
        />
      </AIReportCardShell>
    );
  }

  return (
    <AIReportCardShell successAccent>
      {header}
      <AIReportSuccessBody report={props.report} />
    </AIReportCardShell>
  );
};
