/**
 * @file AIReportModel.ts
 * @description AI が生成した家計レポートのモデル定義。
 */
export type AIReportModel = {
  /** レポートID */
  reportId: string;
  /** 元データを識別するPSV ID */
  psvId: string;
  /** レポートタイトル（例: 2026-03 の家計レポート） */
  title: string;
  /** 要約テキスト（1〜2文想定） */
  summary: string;
  /** 重要なポイントの箇条書き */
  highlights: string[];
  /** 生成時に使ったプロンプト（監査用スナップショット） */
  promptSnapshot: string;
  /** レポート本文（Markdown 形式） */
  reportMarkdown: string;
  /** 生成日時 (ISO 8601) */
  createdAt: string;
};

