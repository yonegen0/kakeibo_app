/**
 * @file useMFUploader.ts
 * @description 家計用 CSV の読み込み・形式チェックと、一覧で行を識別するための一意キー付け。
 */
import { useState } from 'react';
import Papa from 'papaparse';
import { mfCsvFileSchema, type MfCsvData } from '@/schemas/mfCsvFileSchema';

/**
 * CSV から取り込んだ取引 1 件（一覧用の識別子つき）
 */
export type Transaction = MfCsvData[number] & {
  id: string;
};

/** 取込処理の進捗と結果 */
export type MFUploaderResult = {
  /** 指定されたファイルの読み込み処理を開始するハンドラー */
  handleFileSelect: (file: File) => void;
  /** DataGridでの表示に適した（ID付与済み）取引明細データ */
  data: Transaction[] | null;
  /** エラー内容 */
  error: string | null;
  /** 読み取り・検証中フラグ */
  isParsing: boolean;
};

/**
 * CSV 取込の入口。パース後に定義済みルールで検証し、一覧用キーを各行に付ける。
 * @returns 開始用の関数と、データ・エラー・処理中フラグ
 */
export const useMFUploader = (): MFUploaderResult => {
  const [data, setData] = useState<Transaction[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  /**
   * CSVをパースし、Zodによる検証を経て、各行に一意のIDを付与します。
   */
  const handleFileSelect = (file: File) => {
    setIsParsing(true);
    setError(null);

    // FileReader でテキストとして読み込んでから PapaParse で解析する
    // （ブラウザ上で Shift_JIS 等の文字コードを扱うため）
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const text = typeof reader.result === 'string' ? reader.result : '';

        // 行・列に分解
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            // 期待する列と型で検証
            const validated = mfCsvFileSchema.safeParse(results.data);

            if (validated.success) {
              // 一覧で行を区別できるよう、各行に一意のキーを付けて保持する
              const formattedData: Transaction[] = validated.data.map((row, index) => ({
                ...row,
                // ファイル名、インデックス、タイムスタンプを組み合わせて一意性を確保
                id: `${file.name}-${index}-${Date.now()}`,
              }));

              setData(formattedData);
              setError(null);
            } else {
              // バリデーション失敗時の処理
              setError('CSVの形式が正しくありません。カラム名などを確認してください。');
              console.error('[Schema Validation Error]:', validated.error);
            }
            setIsParsing(false);
          },
          error: (err: unknown) => {
            setError('ファイルの読み込み中に問題が発生しました。');
            console.error('[PapaParse Error]:', err);
            setIsParsing(false);
          },
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`ファイルの読み込みに失敗しました: ${message}`);
        console.error('[FileReader/Parse Error]:', err);
        setIsParsing(false);
      }
    };

    reader.onerror = () => {
      setError('ファイルの読み込みに失敗しました。');
      console.error('[FileReader Error]:', reader.error);
      setIsParsing(false);
    };

    reader.readAsText(file, 'Shift_JIS');
  };

  return { handleFileSelect, data, error, isParsing };
};