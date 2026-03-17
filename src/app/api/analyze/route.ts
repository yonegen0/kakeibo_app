/**
 * @file src/app/api/analyze/route.ts
 * @description 取引明細を Bedrock (Claude 3.5 Sonnet) に送信し、AIによる自動仕訳を行うエンドポイント。
 */
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { NextResponse } from "next/server";
import { TransactionModel } from "@/models/TransactionModel";
import { TRANSACTION_ANALYSIS_PROMPT } from "@/constants/prompts";

/**
 * AWS SDK クライアントの初期化
 * リージョンは運用環境（us-east-1等）に合わせて設定
 */
const client = new BedrockRuntimeClient({ region: "us-east-1" });

/**
 * 取引データのAI解析リクエストを処理する POST ハンドラ
 * @param request リクエストオブジェクト。body に transactions: TransactionModel[] を期待。
 */
export async function POST(request: Request) {
  try {
    // フロントエンドから渡された取引データを取得
    const { transactions }: { transactions: TransactionModel[] } = await request.json();

    /**
     * ガード句：解析対象データが存在しない場合は早期リターン
     * 400 Bad Request を返し、クライアント側に通知
     */
    if (!transactions || transactions.length === 0) {
      return NextResponse.json({ error: "No transactions provided" }, { status: 400 });
    }

    /**
     * トークン節約とプライバシー保護：
     * 解析に必要な最小限のフィールド（ID、内容、金額）のみを抽出して AI に渡す。
     * 日付やソース情報（カード番号の一部等）を削ることで、セキュリティとコストを最適化。
     */
    const targetData = transactions.map(t => ({ 
      id: t.id, 
      content: t.content, 
      amount: t.amount.value 
    }));

    /**
     * Bedrock への送信コマンド構築
     * 詳細設計書に基づき、解析精度を安定させるため temperature: 0 (決定的) を採用。
     */
    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-5-sonnet-20240620-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: `${TRANSACTION_ANALYSIS_PROMPT}\n\n# 解析対象データ\n${JSON.stringify(targetData)}`,
          },
        ],
        temperature: 0, 
      }),
    });

    /**
     * AWS Bedrock へのリクエスト実行とレスポンスのパース
     */
    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    /**
     * AIの回答テキストから JSON 部分を抽出してパース
     * プロンプトで JSON 形式を強制しているため、そのまま解析結果としてクライアントへ返却
     */
    const result = JSON.parse(responseBody.content[0].text);

    return NextResponse.json(result);

  } catch (error) {
    /**
     * エラーハンドリング：
     * AWS SDK のエラーやパース失敗をキャッチし、サーバーエラーとしてログ出力
     */
    console.error("Bedrock Analysis Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}