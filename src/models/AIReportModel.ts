/**
 * @file AIReportModel.ts
 * @description AI が生成した家計レポートのモデル定義。
 */
export type AIReportModel = {
  /** レポートタイトル（例: 2026-03 の家計レポート） */
  title: string;
  /** 要約テキスト（1〜2文想定） */
  summary: string;
  /** 重要なポイントの箇条書き */
  highlights: string[];
  /** レポート本文（Markdown 形式） */
  rawMarkdown: string;
};

