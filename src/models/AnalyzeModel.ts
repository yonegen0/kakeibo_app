/**
 * @file AnalyzeModel.ts
 * @description AI分析の実行状態を管理するモデル定義。DynamoDB analyze テーブルに対応する。
 */

/** AI分析の実行状態（psvId ごとに最新の分析結果を保持） */
export type AnalyzeModel = {
  psvId: string;            // PK
  latestReportId: string;   // 最新レポートへの参照
  promptSnapshot: string;   // 最終実行時のプロンプト
  updatedAt: string;        // 更新日時（ISO 8601）
};
