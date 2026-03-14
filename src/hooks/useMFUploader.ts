/**
 * @file useMFUploader.ts
 * @description マネーフォワードCSVのパースおよびバリデーションを管理するカスタムフック。
 */
import { useState } from 'react';
import Papa from 'papaparse';
import { mfCsvFileSchema, type MfCsvData } from '@/schemas/mfCsvFileSchema';

/**
 * マネーフォワードCSVのアップロードおよび解析状態を管理するHooks
 */
export const useMFUploader = () => {
  const [data, setData] = useState<MfCsvData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  /**
   * 選択されたファイルを解析し、Zodスキーマで検証を行うメイン関数
   * @param file - Input[type=file] から取得したFileオブジェクト
   */
  const handleFileSelect = (file: File) => {
    setIsParsing(true);
    setError(null);

    // PapaParseによるCSV解析の開始
    Papa.parse(file, {
      header: true,           // 1行目をプロパティ名として使用
      skipEmptyLines: true,   // 空行を無視してバリデーションエラーを防ぐ
      encoding: 'Shift_JIS',  // 日本の金融機関CSV特有の文字化け回避
      
      /** 解析完了時のコールバック */
      complete: (results) => {
        // Step 1: 解析結果を Zod スキーマに流し込み、型の整合性をチェック
        const validated = mfCsvFileSchema.safeParse(results.data);
        
        if (validated.success) {
          // Step 2: 検証成功時、整形済みデータをステートに保存
          setData(validated.data);
          setError(null);
        } else {
          // Step 3: 検証失敗時、エラー詳細をコンソールに出し、ユーザーへ通知
          setError("CSVの形式が正しくありません。");
          console.error('[Validation Error]:', validated.error);
        }
        setIsParsing(false);
      },
      
      /** ファイル読み込み自体の失敗（アクセス権限等） */
      error: (err) => {
        setError("ファイルの読み込みに失敗しました。");
        setIsParsing(false);
      }
    });
  };

  return { handleFileSelect, data, error, isParsing };
};