/**
 * @file useMFUploader.ts
 * @description 取引明細ファイルの読み込みおよび整合性検証を管理するカスタムフック。
 */
import { useState } from 'react';
import Papa from 'papaparse';
import { mfCsvFileSchema, type MfCsvData } from '@/schemas/mfCsvFileSchema';

/**
 * ファイルアップロード処理の実行状態と結果を定義する型。
 */
export type MFUploaderResult = {
  /** 指定されたファイルの読み込み処理を開始するハンドラー */
  handleFileSelect: (file: File) => void;
  /** 形式検証を通過した正規の取引明細データ */
  data: MfCsvData | null;
  /** 読み込み失敗、またはデータの不整合に関するエラー内容 */
  error: string | null;
  /** ファイルの解析およびデータの検証処理を実行中かを示すフラグ */
  isParsing: boolean;
};

/**
 * 外部から取り込まれる取引データのパースおよびスキーマ検証を提供します。
 */
export const useMFUploader = (): MFUploaderResult => {
  const [data, setData] = useState<MfCsvData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  /**
   * ファイルデータを読み込み、システムが許容するデータ構造へと変換・検証します。
   */
  const handleFileSelect = (file: File) => {
    setIsParsing(true);
    setError(null);

    // CSV解析
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding: 'Shift_JIS', 
      complete: (results) => {
        // 構造検証
        const validated = mfCsvFileSchema.safeParse(results.data);
        
        if (validated.success) {
          // 整形済みデータをステートに保存
          setData(validated.data);
          setError(null);
        } else {
          // エラー詳細をコンソールに出し、ユーザーへ通知
          setError("データの形式が正しくありません。");
          console.error('[Schema Validation Error]:', validated.error);
        }
        setIsParsing(false);
      },
      /** ファイル読み込み自体の失敗（アクセス権限等） */
      error: () => {
        setError("データの読み込み中に問題が発生しました。");
        setIsParsing(false);
      }
    });
  };

  return { handleFileSelect, data, error, isParsing };
};