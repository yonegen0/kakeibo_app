/**
 * @file src/app/api/ai-report/route.ts
 * @description 月次集計結果を受け取り、AI レポート（AIReportModel）を返すエンドポイント。
 * 現段階ではモックレスポンスを返却し、後から Bedrock 連携に差し替えやすい形にしておく。
 * 入力検証 → 処理 → JSON 返却の流れで扱う。
 */
import { NextResponse } from "next/server";
import type { MonthlySummaryModel } from "@/models/TransactionModel";
import type { AIReportModel } from "@/models/AIReportModel";

/**
 * POST ボディの型定義
 * フロントエンドから月次集計（`summary`）のみを受け取る。
 */
type AIReportRequestBody = {
  summary: MonthlySummaryModel;
};

/**
 * 月次サマリーに基づく AI レポート生成リクエストを処理する POST ハンドラ
 * @param request リクエストオブジェクト。body に summary: MonthlySummaryModel を期待。
 */
export async function POST(request: Request) {
  try {
    // フロントエンドから渡された月次集計を取得
    const { summary } = (await request.json()) as AIReportRequestBody;

    /**
     * ガード句：集計データが無い場合は早期リターン
     * 400 Bad Request を返し、クライアント側に通知する
     */
    if (!summary) {
      return NextResponse.json({ error: "summary is required" }, { status: 400 });
    }

    /**
     * モックレポート：
     * 本番では Bedrock 等のモデルへ summary を渡し、
     * Markdown / 構造化フィールドを生成して返す想定。
     */
    const mockReport: AIReportModel = {
      title: `${summary.month} の家計レポート`,
      summary: "この月は収入に対して支出がやや多めです。翌月に向けて固定費と食費の見直しを検討しましょう。",
      highlights: [
        `収入合計: ${summary.incomeTotal.toLocaleString()} 円`,
        `支出合計: ${summary.expenseTotal.toLocaleString()} 円`,
        `残高: ${summary.balance.toLocaleString()} 円`,
      ],
      rawMarkdown: [
        `## ${summary.month} の家計サマリー`,
        "",
        `- **収入合計**: ${summary.incomeTotal.toLocaleString()} 円`,
        `- **支出合計**: ${summary.expenseTotal.toLocaleString()} 円`,
        `- **残高**: ${summary.balance.toLocaleString()} 円`,
        "",
        "### 観察ポイント",
        "",
        "- 食費や生活費の割合が高くなっています。",
        "- 固定費は許容範囲ですが、長期的には最適化の余地があります。",
        "",
        "### 次のアクション例",
        "",
        "- 1ヶ月だけ食費の上限を決めて、支出をトラッキングしてみましょう。",
        "- サブスクや固定費の中で、ほとんど使っていないサービスがないか棚卸しします。",
      ].join("\n"),
    };

    // クライアントは { report: AIReportModel } 形式で受け取る
    return NextResponse.json({ report: mockReport });
  } catch (error) {
    /**
     * エラーハンドリング：
     * JSON パース失敗や予期しない例外をキャッチし、サーバーエラーとしてログ出力
     */
    console.error("AI Report Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
